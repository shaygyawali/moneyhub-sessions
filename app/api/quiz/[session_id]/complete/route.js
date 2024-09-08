import dbConnect from '../../../../lib/mongodb';
import Session from '../../../models/Session';
import Topic from '../../../models/Topic';

export async function GET(req, { params }) {
  await dbConnect();

  const { session_id } = params;

  const session = await Session.findOne({ session_id });
  if (!session) {
    return new Response(JSON.stringify({ message: 'Session not found' }), { status: 404 });
  }

  const topic = await Topic.findOne({ topic_id: session.topic_id });
  if (!topic) {
    return new Response(JSON.stringify({ message: 'Topic not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ quiz: topic.quiz, topic_info: { name: topic.name, icon: topic.icon_url } }), { status: 200 });
}

export async function POST(req, { params }) {
  await dbConnect();

  const { session_id } = params;
  const { studentName, answers, quizType, student_id } = await req.json();

  const session = await Session.findOne({ session_id });
  if (!session) {
    return new Response(JSON.stringify({ message: 'Session not found' }), { status: 404 });
  }

  const topic = await Topic.findOne({ topic_id: session.topic_id });
  if (!topic) {
    return new Response(JSON.stringify({ message: 'Topic not found' }), { status: 404 });
  }

  const correctAnswers = topic.quiz.map(question => question.correct_option_id);

  // Function to calculate score
  function calculateScore(answers) {
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === correctAnswers[i]) {
        score += 1;
      }
    }
    return (score / answers.length) * 100; // Score in percentage
  }

  let generatedStudentId = student_id;

  // Generate student ID only for pre-quiz
  if (quizType === 'pre') {
    function generateStudentId() {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let studentId = '';

      // Generate 3 random letters
      for (let i = 0; i < 3; i++) {
        studentId += letters.charAt(Math.floor(Math.random() * letters.length));
      }

      // Append a random number between 0 and 999
      studentId += Math.floor(Math.random() * 1000).toString();

      return studentId;
    }

    generatedStudentId = generateStudentId();

    const preScore = calculateScore(answers);

    session.students.push({
      student_id: generatedStudentId,
      name: studentName,
      pre_quiz_answers: answers,
      pre_score: preScore, // Store pre-quiz score
      post_quiz_answers: [],
      post_score: null, // Will be calculated later
      target_sub_topics: [],
    });
  } else if (quizType === 'post') {
    const student = session.students.find((s) => s.student_id === student_id);

    if (student) {
      const postScore = calculateScore(answers);
      student.post_quiz_answers = answers;
      student.post_score = postScore; // Store post-quiz score
    }
  }

  await session.save();
  return new Response(
    JSON.stringify({ message: 'Quiz submitted', student_id: generatedStudentId }),
    { status: 200 }
  );
}
