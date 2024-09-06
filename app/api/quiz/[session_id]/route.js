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

  console.log("session", session)


  const topic = await Topic.findOne({ topic_id: session.topic_id });
  const topicInfo = {
    name: topic.name,
    icon_url: topic.icon_url
  }
  if (!topic) {
    return new Response(JSON.stringify({ message: 'Topic not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ quiz: topic.quiz, topic_info: {name: topic.name, icon: topic.icon_url} }), { status: 200 });
}

export async function POST(req, { params }) {
  await dbConnect();

  const { session_id } = params;
  const { studentName, answers, quizType, student_id } = await req.json();

  const session = await Session.findOne({ session_id });
  if (!session) {
    return new Response(JSON.stringify({ message: 'Session not found' }), { status: 404 });
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

    session.students.push({
      student_id: generatedStudentId,
      name: studentName,
      pre_quiz_answers: answers,
      post_quiz_answers: [],
      target_sub_topics: [],
    });
  } else if (quizType === 'post') {
    const student = session.students.find((s) => s.student_id === student_id);

    if (student) {
      student.post_quiz_answers = answers;
    }
  }

  await session.save();
  return new Response(
    JSON.stringify({ message: 'Quiz submitted', student_id: generatedStudentId }),
    { status: 200 }
  );
}