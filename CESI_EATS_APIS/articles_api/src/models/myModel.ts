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
  stock:{
    type: Boolean,
    required: true,
  },
  prix:{
    type: Number,
    required: true
  },
  vegan:{
    type: Boolean,
    required: true
  },
  ingredients: {
    type: Array<String>
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Export model
export default mongoose.model('Article', MyModelSchema);
