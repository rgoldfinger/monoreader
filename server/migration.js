import mongoose from 'mongoose';
mongoose.connect('mongodb://readitlive:HR14Rules@c194.capital.3.mongolayer.com:10194/ril');
var db = mongoose.connection;

import R from 'ramda';

var postsSchema = new mongoose.Schema({
  postText: String,
  author: String,
  eventId: String,
  time: Date,
  postIsComment: Boolean,
  avatarUrl: String,
  timeEU: String
});

var oldEventsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.Mixed,
  eventTitle: String,
  createdBy: String,
  adminUsers: [ String ],
  eventIsLive: Boolean,
  entries: [postsSchema],
  time: Date
});

var eventsSchema = new mongoose.Schema({
  eventTitle: String,
  createdBy: String,
  adminUsers: [ String ],
  eventIsLive: Boolean,
  entries: [postsSchema],
  time: Date
});

db.on('error', console.error);

db.once('open', function() {
  oldEvents = mongoose.model('Events', oldEventsSchema);
  Events = mongoose.model('EventsV2', eventsSchema);
  oldPosts = mongoose.model('Posts', postsSchema);
  Posts = mongoose.model('PostsV2', postsSchema);

  oldEvents.find(function(err, events) {
    if (err) {
      console.log(err);

    }

    R.forEach(function(oldEvent) {
      console.log('migrating oldEvent: ', oldEvent.eventTitle);
      var ops = oldEvent;
      console.log(ops);
      delete ops._id;
      delete ops.id;
      var newEvent = new Events({
        eventTitle: ops.eventTitle,
        createdBy: ops.createdBy,
        adminUsers: ops.adminUsers,
        eventIsLive: ops.eventIsLive,
        time: ops.time
      });
      console.log(newEvent);
      newEvent.save(function(err, savedEvent) {
        if (err) {
          console.log(err);
        } else {
          console.log('saved: ', savedEvent.eventTitle);

          oldPosts.find({eventId: oldEvent._id}, function(err, posts) {
            if (err) {
              console.log(err);
            } else {
              console.log('found ', posts.length, ' posts for event: ', savedEvent.eventTitle);
              posts.forEach(function(oldPost) {
                var newPost = new Posts({
                  postText: oldPost.postText,
                  author: oldPost.author,
                  eventId: savedEvent._id,
                  time: oldPost.time,
                  postIsComment: oldPost.postIsComment,
                  avatarUrl: oldPost.avatarUrl,
                  timeEU: oldPost.timeEU
                });
                newPost.save(function(err) {
                  if (err) console.log(err);
                  else console.log('saved post', newPost);
                });
              });
            }

          });
        }
      });

    }, events);
  });

});
