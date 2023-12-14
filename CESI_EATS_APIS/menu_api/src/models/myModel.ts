import mongoose from 'mongoose';

// Define schema for myModel
const MyModelSchema = new mongoose.Schema({
  id_restaurant: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true
  },
  promotion:{
    type: Number,
    required: true
  },
  id_article: {
    type: Array<String>
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Export model
export default mongoose.model('Menu', MyModelSchema);
