'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuizPage({ params }) {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [quizType, setQuizType] = useState('pre');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');  // State to store student ID

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await axios.get(`/api/quiz/${params.session_id}?quizType=${quizType}`);
      setQuiz(response.data.quiz);
    };
    fetchQuiz();
  }, [params.session_id, quizType]);

  const handleAnswerChange = (question_id, selected_option_id) => {
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.question_id === question_id
      );
      const updatedAnswers = [...prevAnswers];

      if (existingAnswerIndex !== -1) {
        // Update the existing answer
        updatedAnswers[existingAnswerIndex] = { question_id, selected_option_id };
      } else {
        // Add new answer
        updatedAnswers.push({ question_id, selected_option_id });
      }

      return updatedAnswers;
    });
  };

  const submitQuiz = async () => {
    if (!studentName && quizType === 'pre') {
      alert('Please enter your name');
      return;
    }

    const payload = {
      studentName,
      answers,
      quizType,
      student_id: studentId,  // Include the student ID for post-quiz
    };

    const response = await axios.post(`/api/quiz/${params.session_id}`, payload);

    if (quizType === 'pre') {
      // Store the student ID returned from the server after pre-quiz
      setStudentId(response.data.student_id);
      setQuizType('post');  // Move to post-quiz after submission
    }
  };

  return (
    <div>
      <h1>{quizType === 'pre' ? 'Pre-Quiz' : 'Post-Quiz'}</h1>

      {/* Name input only for pre-quiz */}
      {quizType === 'pre' && (
        <div>
          <label>
            Your Name:
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
        </div>
      )}

      {/* Quiz questions */}
      {quiz.map((q) => (
        <div key={q.question_id}>
          <p>{q.text}</p>
          {q.options.map((option) => (
            <div key={option.option_id}>
              <label>
                <input
                  type="radio"
                  name={q.question_id}
                  value={option.option_id}
                  onChange={(e) =>
                    handleAnswerChange(q.question_id, e.target.value)
                  }
                />
                {option.text}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={submitQuiz}>
        Submit {quizType === 'pre' ? 'Pre-Quiz' : 'Post-Quiz'}
      </button>

      {/* Button to move to post-quiz (in case the user doesn't auto-transition) */}
      {quizType === 'pre' && (
        <button onClick={() => setQuizType('post')}>Proceed to Post-Quiz</button>
      )}
    </div>
  );
}
