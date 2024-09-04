import dbConnect from '../../../lib/mongodb';
import Topic from '../../models/Topic';

export async function GET(req) {
  await dbConnect();
  console.log("MongoDB Connected");

  const topics = await Topic.find({});
  return new Response(JSON.stringify(topics), { status: 200 });
}
