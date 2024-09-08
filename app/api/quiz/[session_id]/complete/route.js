import dbConnect from '../../../../../lib/mongodb';
import Session from '../../../../models/Session';
import Topic from '../../../../models/Topic';

export async function POST(req, { params }) {
  await dbConnect();

  const { session_id } = params;
  const { session, topic_id } = await req.json();

  const existingSession = await Session.findOne({ session_id });
  if (!existingSession) {
    return new Response(JSON.stringify({ message: 'Session not found' }), { status: 404 });
  }

  const topic = await Topic.findOne({ topic_id });
  if (!topic) {
    return new Response(JSON.stringify({ message: 'Topic not found' }), { status: 404 });
  }

  // Dummy function to generate hardcoded insights
  function generateInsights() {
    return [
      { quantitative: "36%", qualitative: "Increase of understanding" },
      { quantitative: "100%", qualitative: "Students understand SMART goals" },
      { quantitative: "85%", qualitative: "Improvement in financial literacy concepts" }
    ];
  }

  const insights = generateInsights();

  // Save the insights to the session object
  existingSession.insights = insights;
  await existingSession.save();

  return new Response(JSON.stringify({ message: 'Insights generated', insights }), { status: 200 });
}