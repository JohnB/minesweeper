Router.configure({
  // layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('games', {path: '/'});
  this.route('showGame', {
      path: '/game/:_id',
      data: function () {
        var game = Games.findOne({_id: this.params._id});
        return game;
      }
  });
});
