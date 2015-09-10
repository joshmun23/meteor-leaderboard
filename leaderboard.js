Players = new Mongo.Collection('players');

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    msg: function() {
      return 'active players.'
    },
    player: function() {
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
      var PlayerID = Session.get('selectedPlayer');

      Players.update(PlayerID, {
        $inc: {score: 5}
      });

      // Players.update(score: player.score + 5);
    },
    'click .take-points': function() {
      var PlayerID = Session.get('selectedPlayer');

      Players.update(PlayerID, {
        $inc: {score: -5}
      })
    }
  });

  Template.addPlayerForm.events ({
    'submit form': function(e) {
      e.preventDefault();
      var playerName = e.target.playerName.value;
      var playerScore = e.target.playerScore.value || 0;

      Players.insert({
        name: playerName,
        score: parseInt(playerScore) //need to convert into numeric values
      });
      e.target.playerName.value = '';
      e.target.playerScore.value = '';
    },
    'click .remove-player': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      var removePlayer = confirm('Are you sure you want to delete this player?');
      if (removePlayer) {
        Players.remove(selectedPlayer);
      };
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    return Meteor.methods({
      removeAllPlayers: function(){
        // this function allows us to use Meteor.call('removeAllPlayers')
        // client side (Trusted Code is Server Side)
        return Players.remove({})
      }
    });
  });
}
