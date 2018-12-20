const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
	user: [{
		id: {
			type: String,
			required: true
		},
		firstname: {
			type: String,
			required: true
		}
	}],
	handle: {
		type: String,
		required: false,
		max: 40
	},
	backgroundimage: {
		type: String,
		required: false
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
			required: false
		},
		address:
		{
			type: String,
			required: false
		},
		phonenumber:
		{
			type: Number,
			required: false
		},
		website:
		{
			type: String,
			required: false
		},
		categories:
		{
			type: String,
			required: false
		},
		job:
		{
			type: String,
			required: false
		},
	}],
	experience: [{
		company: {
			type: String,
			required: false
		},
		location: {
			type: String
		},
		from: {
			type: Date,
			required: false
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
			required: false
		},
		degree: {
			type: String,
			required: false
		},
		fieldofstudy: {
			type: String,
			required: false
		},
		from: {
			type: Date,
			required: false
		},
		to: {
			type: Date
		},
		current: {
			type: Boolean,
			required: false
		},
		description: {
			type: String
		}
	}],
	vote: [{
		likes:[{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		}],
		unlikes: [{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		}],
		comments: [{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			text:{
				type: String,
				required: false
			},
			firstname:{
				type: String
			},
			lastname:{
				type: String
			},
			avatar:{
				type: String
			},
			date:{
				type: Date,
				default: Date.now
			}
		}],
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
