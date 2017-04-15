var emptyCell = {'x': 3, 'y': 3};
var gridSize = 4;

function createTile(x, y) {
  var tile = $('<div />', {'class':  'puzzlePiece'});
  tile.css('left', (x*100)+"px");
  tile.css('top', (y*100)+"px");
  tile.css('background-position', 'left '+ (-(x*100)) + 'px top ' + (-(y*100)) + 'px');

  $('div#puzzleContainer').append(tile);

}

function initPuzzle() {
  var tileCount = 0;
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      if (tileCount < (gridSize*gridSize-1)) {
        createTile(j,i);
        tileCount++;
      }
    }
  }
}

function randomize() {

}

function move() {

}

$(document).ready(function() {
  initPuzzle();
});
