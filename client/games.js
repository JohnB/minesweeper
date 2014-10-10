Template.games.helpers({
    games: function() { return Games.find(); }
});

Tracker.autorun(function () {
    Meteor.subscribe("myGames");
    Meteor.subscribe("games");
});
