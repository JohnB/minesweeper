var defaults = {
  width: 10,
  height: 10,
  numBombs: 20,
  _offBoardWidth: 1,
  _cells: []
}

Boards = new Meteor.Collection("boards", {
  transform: function(options) {
    var obj = _.defaults(options, defaults);
    obj.fullWidth = obj.width + 2 * obj._offBoardWidth;
    obj.fullHeight = obj.height + 2 * obj._offBoardWidth;
    obj.numCells = obj.fullWidth * obj.fullHeight;
    obj.is_cellType = function(idx, cellType) { return obj.cells()[idx].cellType == cellType; }
    obj.is_offBoard = function(idx) { return obj.is_cellType(idx, 'offBoard'); }
    obj.is_empty = function(idx) { return obj.is_cellType(idx, 'empty'); }

    // Represent the board as a one-dimensional array of cells,
    // with "offBoard" cells around the edges so we don't have to
    // continually check whether we're off the board or not.
    // This allows us to reference our 8 neighbors with integer offsets.
    obj.neighbors = [
        -(obj.fullWidth+1), -obj.fullWidth, -(obj.fullWidth-1),
        1,                                  1,
        obj.fullWidth+1,     obj.fullWidth, obj.fullWidth-1
      ];
    obj.eachNeighbor = function(idx, fn) {
      var dispatch = function(element, index, array) {
        if ( !obj.is_offBoard(index) ) {
          fn(element);
        }
      }
      obj.neighbors.forEach( dispatch )
    };
    obj.addBombs = function() {
      var plantBomb = function(idx) {
        var increaseNearbyBombs = function(element) {
          element.nearbyBombs += 1;
        }
        obj.cells()[idx].cellType = 'bomb';
        obj.eachNeighbor(idx, increaseNearbyBombs);
      }
      var bombs = obj.numBombs;
      while( bombs > 0 ) {
        var idx = parseInt( Math.random() * obj.numCells );
        console.log(idx);
        if( obj.isEmpty(idx) ) {
          plantBomb(idx);
        }
      }
    };
    obj.topEdge    = obj.fullWidth;
    obj.bottomEdge = obj.fullWidth * (obj.height + obj._offBoardWidth);
    obj.leftEdge   = obj._offBoardWidth;
    obj.rightEdge  = obj.width + obj._offBoardWidth;

    obj.is_off_top_edge    = function(idx) { return idx < obj.topEdge };
    obj.is_off_bottom_edge = function(idx) { return idx > obj.bottomEdge };
    obj.is_off_left_edge   = function(idx) { return (idx % obj.fullWidth) < obj.leftEdge };
    obj.is_off_right_edge  = function(idx) { return (idx % obj.fullWidth) >= obj.rigtEdge };
    obj.is_off_board = function(idx) {
      return obj.is_off_top_edge(idx)  || obj.is_off_bottom_edge(idx) ||
             obj.is_off_left_edge(idx) || obj.is_off_right_edge(idx);
    }

    obj.cells = function() {
      if (obj._cells.length < obj.numCells) {
        obj._cells = new Array(obj.numCells);
        for (i = 0; i < obj.numCells; i++) {
          obj._cells[i] = {
            index: i,
            cellType: obj.is_off_board(i) ? 'offBoard' : 'empty',
            nearbyBombs: 0
          };
        }
        obj.addBombs(); // randomly add bombs
      }
      return obj._cells;
    };

    // finish the "constructor" by returning the object
    return obj;
  }
});

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
    // TODO: randomly add bombs

    return {
      cells: cells
    };
  }
});
