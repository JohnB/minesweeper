var defaults = {
  width: 3,
  height: 3,
  numBombs: 2,
  _offBoardWidth: 1,
  _cells: []
}

Boards = new Meteor.Collection("boards", {
  // Inspiration for the transform function came from
  // http://stackoverflow.com/questions/15007231/whats-the-best-way-to-attach-behavior-to-a-meteor-collection
  //
  // TODO: improve http://docs.meteor.com/#mongo_collection so the
  //       transform-as-constructor model is more clear.
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
        -1,                                  1,
        obj.fullWidth-1,     obj.fullWidth, obj.fullWidth+1
      ];
    obj.eachNeighbor = function(idx, fn) {
      obj.neighbors.forEach( function(delta, ignoreInt, ignoreArray) {
        var index = idx + delta;
        if ( !obj.is_offBoard(index) ) {
          fn( obj.cells()[index] );
        }
      })
    };
    obj.plantBomb = function(idx) {
      var increaseNearbyBombs = function(element) {
        element.nearbyBombs += 1;
      };
      var cell = obj.cells()[idx]
      cell.cellType = 'bomb';
      obj.eachNeighbor(idx, increaseNearbyBombs);
    };
    obj.addBombs = function() {
      var bombs = obj.numBombs;
      while( bombs > 0 ) {
        var idx = parseInt( Math.random() * obj.numCells );
        console.log(idx);
        if( obj.is_empty(idx) ) {
          obj.plantBomb(idx);
          bombs -= 1;
        }
      }
    };
    obj.rows = function(perRowFn) {
      for( i = fullWidth + _offBoardWidth; i < bottomEdge; i += fullWidth ) {
        perRowFn( _cells().slice(i, i+width) );
      }
    };
    obj.topEdge    = obj.fullWidth;
    obj.bottomEdge = obj.fullWidth * (obj.height + obj._offBoardWidth);
    obj.leftEdge   = obj._offBoardWidth;
    obj.rightEdge  = obj.width + obj._offBoardWidth;

    obj.is_off_top_edge    = function(idx) { return idx < obj.topEdge };
    obj.is_off_bottom_edge = function(idx) { return idx >= obj.bottomEdge };
    obj.is_off_left_edge   = function(idx) { return (idx % obj.fullWidth) < obj.leftEdge };
    obj.is_off_right_edge  = function(idx) { return (idx % obj.fullWidth) >= obj.rightEdge };
    obj.is_off_board = function(idx) {
      return obj.is_off_top_edge(idx)  || obj.is_off_bottom_edge(idx) ||
             obj.is_off_left_edge(idx) || obj.is_off_right_edge(idx);
    }
    console.log(obj.inspect);

    obj.cells = function() {
      if (obj._cells.length < obj.numCells) {
        obj._cells = new Array(obj.numCells);
        for (i = 0; i < obj.numCells; i++) {
          var cellType = obj.is_off_board(i) ? 'offBoard' : 'empty';
          console.log(''+i+': '+cellType);
          obj._cells[i] = {
            index: i,
            cellType: cellType,
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
