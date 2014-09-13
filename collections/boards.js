Boards = new Meteor.Collection("boards");

Meteor.methods({
  boardCreate: function(attributes) {
    var offBoardWidth = 1,
        width =  attributes['width'] || 10,
        height = attributes['height'] || 10;
    var fullWidth = width + 2 * offBoardWidth,
        fullHeight = height + 2 * offBoardWidth,
        cellTypes = ['offBoard', 'empty', 'bomb'];
    // Represent the board as a one-dimensional array of cells,
    // with "offBoard" cells around the edges so we don't have to
    // continually check whether we're off the board or not.
    // This allows us to reference our 8 neighbors with integer offsets.
    var neighbors = [-(fullWidth+1), -fullWidth, -(fullWidth-1),
                     -1,                         1,
                     fullWidth+1,     fullWidth,   fullWidth-1]
    var numCells = fullWidth * fullHeight;
    var cells = new Array(numCells);
    for (i = 0; i < numCells; i++) {
      // This is the only spot where we should have to calculate offBoard-edness
      var cellType = 'empty';
      if (i < fullWidth * offBoardWidth)              { cellType = 'offBoard'; };
      if ((i       % fullWidth) < offBoardWidth)      { cellType = 'offBoard'; };
      if (((i + 1) % fullWidth) < offBoardWidth)      { cellType = 'offBoard'; };
      if (i >= numCells - offBoardWidth * fullWidth)  { cellType = 'offBoard'; };

      cells[i] = {cellType: cellType, nearbyBombs: 0};
    }

    var fields = {
      width:  attributes['width'] || 10,
      height: attributes['height'] || 10,
    }
  }
});
