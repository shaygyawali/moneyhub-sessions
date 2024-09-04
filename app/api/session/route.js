import dbConnect from '../../../lib/mongodb';
import Session from '../../models/Session';
import QRCode from 'qrcode';

export async function POST(req) {
  await dbConnect();

  const LOCAL_URL = process.env.LOCAL_URL

  const { topic_id } = await req.json();

  console.log("topic id", topic_id)

  const session_id = `session_${new Date().getTime()}`;
  const session_url = `${LOCAL_URL}/${session_id}`;
  const session_qr = await QRCode.toDataURL(session_url);

  const session = new Session({
    session_id,
    session_url,
    session_qr,
    topic_id,
    students: [],
  });



  await session.save();

  return new Response(JSON.stringify(session), { status: 200 });
}
