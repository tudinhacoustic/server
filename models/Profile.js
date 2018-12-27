const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	handle: {
		type: String,
		required: false,
		max: 40
	},
	backgroundimage: {
		type: String,
		required: false,
	},
	about: [{
		user:
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		description:
		{
			type: String,
			required: true
		},
		address:
		{
			type: String,
			required: true
		},
		phonenumber:
		{
			type: Number,
			required: true
		},
		website:
		{
			type: String,
			required: false
		},
		job:
		{
			type: String,
			required: true
		},
	}],
	categories: {
		type: [String],
		required: true
	},
	experience: [{
		company: {
			type: String,
			required: true
		},
		location: {
			type: String
		},
		from: {
			type: Date,
			required: true
		},
		to: {
			type: Date
		},
		current: {
			type: Boolean,
			require: false
		},
		description: {
			type: String
		}
	}],
	education: [{
		school: {
			type: String,
			required: true
		},
		degree: {
			type: String,
			required: true
		},
		fieldofstudy: {
			type: String,
			required: true
		},
		from: {
			type: Date,
			required: true
		},
		to: {
			type: Date,
		},
		current: {
			type: Boolean,
			required: false
		},
		description: {
			type: String
		}
	}],
	love:[{
		user:{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	}],
	posts: [{
		user:{
			type: Schema.Types.ObjectId,
			ref: 'Posts'
		}
	}],
	followers: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	}],
	following: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	}],
	social: {
        youtube:{
          type: String,
        },
        twitter:{
          type: String,
        },
        facebook:{
          type: String,
        },
        likedin:{
          type: String,
        },
        instagram:{
          type: String,
        }
	}
})

module.exports = Profile = mongoose.model('Profile', ProfileSchema)
