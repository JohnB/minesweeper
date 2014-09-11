// set a global instance of Minesweeper
// minesweeper = new MineSweeper();
// minesweeper.init({
//     selector: '#minesweeper',
//     board_size: [30, 20],
//     mines: 0.05
// });

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.controls.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.controls.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });
}
