import mongoose from 'mongoose';

exports.postsSchema = new mongoose.Schema({
  postText: String,
  author: String,
  eventId: String,
  time: Date,
  postIsComment: Boolean,
  avatarUrl: String,
  timeEU: String,
  replies: []
});

exports.postsSchema.index({eventId: 1});

exports.eventsSchema = new mongoose.Schema({
  eventTitle: String,
  eventIsLive: Boolean,
  createdBy: String,
  adminUsers: [ String ],
  time: Date
});

exports.commentsSchema = new mongoose.Schema({
  postText: String,
  author: String,
  eventId: String,
  time: Date,
  avatarUrl: String,
  timeEU: String
});
exports.commentsSchema.index({eventId: 1});

exports.usersSchema = new mongoose.Schema({
  facebookId: String,
  username: String,
  usernameLowercase: String,
  passwordHash: String,
  profile: {
    name: String,
    avatarUrl: String,
    email: String
  }
});

// Comments = new Meteor.Collection('comments');
//
//   // commentText: commentText,
//   // author: "commentator"
//   // eventId: this._id,
//   // time: Date.now()

// Presences = new Meteor.Collection('presences');
// // For backwards compatibilty
// Meteor.presences = Presences;
