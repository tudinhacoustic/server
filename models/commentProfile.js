const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentProfile = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
  love:[{
		user:{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	}],
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }

})

module.exports = Profile = mongoose.model('commentProfile', commentProfile)
