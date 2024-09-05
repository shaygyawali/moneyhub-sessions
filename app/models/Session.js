import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  question_id: { type: Number, required: true },   
  selected_option_id: { type: String, required: true }, 
});

// Schema for each student participating in the session
const StudentSchema = new mongoose.Schema({
  student_id: { type: String, required: true },    
  name: { type: String, required: true },          
  target_sub_topics: {                             
    type: [String],                                
    default: [],
  },
  pre_quiz_answers: {                             
    type: [AnswerSchema], 
    default: [],
  },
  post_quiz_answers: {                             
    type: [AnswerSchema], 
    default: [],
  },
});

const InsightsSchema = new mongoose.Schema({
  quantitative: {type: String, required: false},
  qualitative: {type: String, required: false}
})

// Main schema for the session
const SessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true },
  session_url: { type: String, required: true },             
  session_qr: { type: String, required: true },
  insights: {type: [InsightsSchema], required: false},              
  topic_id: { type: String, required: true },                 
  students: { type: [StudentSchema], default: [] },           
  created_at: { type: Date, default: Date.now },             
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
