import dbConnect from '../../../../lib/mongodb';
import Session from '../../../../models/Session';
import axios from 'axios';

export async function POST(req, { params }) {
  await dbConnect();

  const { session_id } = params;

  const session = await Session.findOne({ session_id });
  if (!session) {
    return new Response(JSON.stringify({ message: 'Session not found' }), { status: 404 });
  }

  const response = await axios.post('https://python-api-url/process', session);

  session.students.forEach((student, index) => {
    student.target_sub_topics = ["Visualizing Goals, Setting SMART Goals"]
   // student.target_sub_topics = response.data.students[index].target_sub_topics;
  });

  await session.save();
  return new Response(JSON.stringify({ message: 'Session processed', session }), { status: 200 });
}
