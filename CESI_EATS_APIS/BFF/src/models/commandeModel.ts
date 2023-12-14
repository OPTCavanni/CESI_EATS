import mongoose from 'mongoose';

// Define schema for myModel
const MyModelSchema = new mongoose.Schema({
  id_menu: {
    type: Array<String>,
    required: true,
  },
  id_restaurant: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  id_livreur: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Export model
export default mongoose.model('Commandes', MyModelSchema);
