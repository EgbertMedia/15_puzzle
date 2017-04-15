var emptyCell = {'x': 3, 'y': 3};
var tilePositions = [];
var gridSize = 4;

function createTile(x, y) {
  var tile = $('<div />', {'class':  'puzzlePiece'});
  tile.css('left', (x*100)+"px");
  tile.css('top', (y*100)+"px");
  tile.css('background-position', 'left '+ (-(x*100)) + 'px top ' + (-(y*100)) + 'px');
  tile.data('x', x);
  tile.data('y', y);
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

function moveHorizontal(data) {
  console.log('horizontal');
  $('.puzzlePiece').each(function() {
    if (data.x > emptyCell.x) {
      if ($(this).data().y === emptyCell.y && $(this).data().y <= data.y) {
        console.log('left');
      }
    } else {
      if ($(this).data().y === emptyCell.y && $(this).data().y >= data.y) {
        console.log('right');
      }
    }
  });
}

function moveVertical(data) {
  console.log('vertical');
  $('.puzzlePiece').each(function() {
    if (data.y > emptyCell.y) {
      if ($(this).data().x === emptyCell.x && $(this).data().x <= data.x) {
        console.log('up');
      }
    } else {
      if ($(this).data().x === emptyCell.x && $(this).data().x >= data.x) {
        console.log('down');
      }
    }
  });
}

function move(data) {
  console.log(data);
  if (data.x === emptyCell.x) {
    moveVertical(data);
  } else if (data.y === emptyCell.y) {
    moveHorizontal(data);
  }
}

$(document).ready(function() {
  initPuzzle();
  $('.puzzlePiece').click(function(evt) {
    move($(this).data());
  });
});
