import R from 'ramda';
import db from '../db/setup';
import bcrypt from 'bcrypt';
import sha256 from 'sha256';

var _bcryptRounds = 10;

exports.genHash = function (password) {
  return bcrypt.hashSync(sha256(password), _bcryptRounds);
};

exports.validatePassword = function(user, password) {
  return bcrypt.compareSync(sha256(password), user.passwordHash);
};

exports.checkAdmin = function(req, res, next) {

  db.Events.findById(req.params.eventId, function(err, event) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    if (!event) {
      return res.sendStatus(404);
    }
    var index = R.indexOf(req.user.username, event.adminUsers);
    if (index >= 0) {
      next();
    } else {
      res.sendStatus(401);
    }
  });
};
