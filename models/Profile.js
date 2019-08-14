const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  bio: {
    type: String
  },
  company: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  education: [
    {
      degree: {
        required: true,
        type: String
      },
      current: {
        default: false,
        required: true,
        type: Boolean
      },
      description: {
        type: String
      },
      fieldofstudy: {
        required: true,
        type: String
      },
      from: {
        required: true,
        type: Date
      },
      school: {
        required: true,
        type: String
      },
      to: {
        required: true,
        type: Date
      }
    }
  ],
  experience: [
    {
      company: {
        required: true,
        type: String
      },
      current: {
        default: false,
        required: true,
        type: Boolean
      },
      description: {
        type: String
      },
      from: {
        required: true,
        type: Date
      },
      location: {
        type: String
      },
      title: {
        required: true,
        type: String
      },
      to: {
        required: true,
        type: Date
      }
    }
  ],
  githubusername: {
    type: String
  },
  handle: {
    max: 40,
    required: true,
    type: String
  },
  location: {
    type: String
  },
  skills: {
    required: true,
    type: [String]
  },
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    },
    twitter: {
      type: String
    },
    youtube: {
      type: String
    }
  },
  status: {
    required: true,
    type: String
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  },
  website: {
    type: String
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
