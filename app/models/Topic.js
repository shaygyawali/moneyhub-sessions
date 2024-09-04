import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  option_id: { type: String, required: true },  // Option ID (A, B, C, D, etc.)
  text: { type: String, required: true },      // Option text
});

const QuestionSchema = new mongoose.Schema({
  question_id: { type: Number, required: true },   // Question ID
  text: { type: String, required: true },          // Question text
  options: { type: [OptionSchema], required: true },  // Array of options
  correct_option_id: { type: String, required: true }, // Correct option ID
  topic: { type: String, required: true },         // Subtopic related to the question
});

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Topic name is required
  sub_topics: { type: [String], required: true },  // Subtopics are required
  quiz: { type: [QuestionSchema], required: false },  // Quiz questions can be optional
  topic_id: { type: String, required: true, unique: true }  // Unique topic ID
});


const Topic = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
export default Topic;