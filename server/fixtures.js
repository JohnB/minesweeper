if (Boards.find().count() === 0) {
  Boards.insert({cells: [1,2,3]});
  // Meteor.call('boardCreate');
  // Boards.insert({
  //   title: 'MeteorSweeper 2014-09-12 08:25:23',
  //   cells: []
  // });
}

