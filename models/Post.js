const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  avatar: {
    type: String
  },
  comment: [
    {
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      },
      text: {
        required: true,
        type: String
      },
      user: {
        ref: 'users',
        type: Schema.Types.ObjectId
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      user: {
        ref: 'users',
        type: Schema.Types.ObjectId
      }
    }
  ],
  name: {
    type: String
  },
  text: {
    required: true,
    type: String
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
