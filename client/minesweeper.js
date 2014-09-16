// set a global instance of Minesweeper
// minesweeper = new MineSweeper();
// minesweeper.init({
//     selector: '#minesweeper',
//     board_size: [30, 20],
//     mines: 0.05
// });

// counter starts at 0
Session.setDefault("counter", 0);

Template.controls.helpers({
  counter: function () {
    return Session.get("counter");
  }
});

Template.controls.events({
  'click button': function () {
    var board = {};
    board._id = Board.insert(board);
    // Router.go('postPage', board);
  }
});
