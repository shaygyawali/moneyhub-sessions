import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  question_id: { type: Number, required: true },   // ID of the question
  selected_option_id: { type: String, required: true }, // ID of the selected option (A, B, C, etc.)
});

const StudentSchema = new mongoose.Schema({
  pre_score: { type: Number, default: 0 }, // Default score to 0
  post_score: { type: Number, default: 0 }, // Default score to 0
  student_id: { type: String, required: true }, // Unique ID for the student
  name: { type: String, required: true }, // Student's name
  target_sub_topics: { type: [String], default: [] }, // Subtopics the student needs to focus on
  pre_quiz_answers: { type: [AnswerSchema], default: [] }, // Pre-quiz answers
  post_quiz_answers: { type: [AnswerSchema], default: [] }, // Post-quiz answers
});

const InsightsSchema = new mongoose.Schema({
  quantitative: { type: String, required: false }, // Quantitative insights (e.g., "85%")
  qualitative: { type: String, required: false }, // Qualitative insights (e.g., "Improved understanding")
});

const SessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true }, // Unique session ID
  session_url: { type: String, required: true }, // URL for the session
  session_qr: { type: String, required: true }, // QR code for the session
  insights: { type: [InsightsSchema], default: [] }, // Insights generated after session
  topic_id: { type: String, required: true }, // ID of the topic
  students: { type: [StudentSchema], default: [] }, // List of students participating in the session
  avg_score: { type: Number, default: 0 }, // Average score for the session
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Indexes for faster querying
SessionSchema.index({ session_id: 1 });
SessionSchema.index({ topic_id: 1 });

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
