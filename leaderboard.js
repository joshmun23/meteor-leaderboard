User = new Mongo.Collection('users');
const i = 0;

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    msg: function() {
      return 'active players.'
    },
    user: function() {
      return User.find({}, {
        sort: {score: -1, name: 1}
      });
    },
    count: function() {
      return User.find().count()
    },
    selectedClass: function() {
      var userID = this._id,
          selectedUser = Session.get('selectedUser');

      if(selectedUser == this._id) {
        return 'selected'
      }
    },
    showSelectedUser: function() {
      var userID = Session.get('selectedUser');
      var user = User.findOne(userID);

      return user
    },
    hide: function() {
      var userID = Session.get('selectedUser');

      if(userID) {
        return ''
      } else {
        return 'hide'
      }
    }
  });

  Template.leaderboard.events({
    'click .player': function() {
      var userID = this._id;
      Session.set('selectedUser', userID);
    },
    'click .add-points': function() {
      var userID = Session.get('selectedUser');

      User.update(userID, {
        $inc: {score: 5}
      });

      // user.update(score: user.score + 5);
    },
    'click .take-points': function() {
      var userID = Session.get('selectedUser');

      User.update(userID, {
        $inc: {score: -5}
      })
    },
    'submit .add-user': function(event) {
      var name = event.target.name.value;
      // console.log(name)
      User.insert({
        name: name, score: 0
      })
    },
    'click .remove-user': function(event) {
      event.preventDefault();
      var userID = Session.get('selectedUser');
      i++;
      console.log(i);
      removeUser = confirm('Are you sure if you want to remove this user?');

      if(removeUser) {
        User.remove(userID);
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
