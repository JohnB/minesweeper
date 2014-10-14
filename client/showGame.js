Template.showGame.helpers({
    boardRow: function(game) {
        if (!game) { return []; }  // why is it undefined the first time thru???
        console.log(game.bombs);

        // There must be a better way to create this board-size array
        var result = [];
        for(i = 0; i < game.height; i++) {
            var row = [];
            for(j = 0; j < game.width; j++) {
                var cell = i*game.width+j;
                row.push({cell: cell, isBomb: (game.bombs.indexOf(cell) >= 0) });
            }
            result.push({row: row});
        }
        return result;
    },
    cellClass: "cell",
    cellValue: function(isBomb) {
        return isBomb ? "B" : "";
    }
});
