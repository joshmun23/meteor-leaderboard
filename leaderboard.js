User = new Mongo.Collection('users');

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
    }
  });

  Template.addUserForm.events ({
    'submit form': function(e) {
      e.preventDefault();
      var userName = e.target.userName.value;
      var userScore = e.target.userScore.value || 0;

      User.insert({
        name: userName,
        score: userScore
      });
      e.target.userName.value = '';
      e.target.userScore.value = '';
    },
    'click .remove-user': function() {
      var selectedUser = Session.get('selectedUser');
      var removeUser = confirm('Are you sure you want to delete this user?');
      if (removeUser) {
        User.remove(selectedUser);
      };
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
