Players = new Mongo.Collection('players');

if (Meteor.isClient) {
  Meteor.subscribe('thePlayers'),
  Template.leaderboard.helpers({
    msg: function() {
      return 'active players.'
    },
    player: function() {
      var currentUserId = Meteor.userId();
      return Players.find({}, {
        sort: {score: -1, name: 1}
      });
    },
    count: function() {
      return Players.find().count()
    },
    selectedClass: function() {
      var PlayerID = this._id,
          selectedPlayer = Session.get('selectedPlayer');

      if(selectedPlayer == this._id) {
        return 'selected'
      }
    },
    showSelectedPlayer: function() {
      var PlayerID = Session.get('selectedPlayer');
      var player = Players.findOne(PlayerID);

      return player
    },
    hide: function() {
      var PlayerID = Session.get('selectedPlayer');

      if(PlayerID) {
        return ''
      } else {
        return 'hide'
      }
    }
  });

  Template.leaderboard.events({
    'click .player': function() {
      var PlayerID = this._id;
      Session.set('selectedPlayer', PlayerID);
    },
    'click .add-points': function() {
      var info = {
        playerId: Session.get('selectedPlayer'),
        isInc: true
      };

      Meteor.call('modifyPlayerScore', info);
    },
    'click .take-points': function() {
      var info = {
        playerId: Session.get('selectedPlayer'),
        isInc: false
      };

      Meteor.call('modifyPlayerScore', info)
    }
  });

  Template.addPlayerForm.events ({
    'submit form': function(e) {
      e.preventDefault();
      var player = {
        name: e.target.playerName.value,
        score: e.target.playerScore.value || 0
      };

      Meteor.call('insertPlayerData', player);
      e.target.playerName.value = '';
      e.target.playerScore.value = '';
    },
    'click .remove-player': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      var removePlayer = confirm('Are you sure you want to delete this player?');
      if (removePlayer) {
        Meteor.call('removePlayerData', selectedPlayer);
      };
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return Players.find({createdBy: currentUserId});
  }),
  Meteor.startup(function() {
    return Meteor.methods({
      removeAllPlayers: function() {
        // this function allows us to use Meteor.call('removeAllPlayers')
        // client side (Trusted Code is Server Side)
        return Players.remove({})
      },
      removeAllUsers: function() {
        return Meteor.users.remove({});
      },
      insertPlayerData: function(player) {
        var currentUserId = Meteor.userId();
        Players.insert({
          name: player.name,
          //need to convert into numeric values
          score: parseInt(player.score),
          createdBy: currentUserId
        });
      },
      removePlayerData: function(selectedPlayer) {
        var currentUserId = Meteor.userId();
        Players.remove({_id: selectedPlayer, createdBy: currentUserId});
      },
      modifyPlayerScore: function(info) {
        var score = info.isInc ? 5 : -5,
            currentUserId = Meteor.userId();
        console.log(info)
        Players.update({_id:info.playerId,
          createdBy: currentUserId
        }, {$inc: {
          score: score
        }});
      }
    });
  });
}
