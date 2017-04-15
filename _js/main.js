var emptyCell = {'x': 3, 'y': 3};
var tilePositions = [];
var gridSize = 4;
var animationDuration = 1000;

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

function moveTile(tileNumber, x, y) {
  tileNumber++; // CSS :nth-child starts with 1 instead of 0
  console.log(tileNumber);
  $('div.puzzlePiece:nth-child('+tileNumber+')').animate({
        'left': (x*100)+"px",
        'top': (y*100)+"px",
        'background-position': 'left '+ (-(x*100)) + 'px top ' + (-(y*100)) + 'px'
        }, animationDuration, function() {
    $('div.puzzlePiece:nth-child('+tileNumber+')').data('x', x);
    $('div.puzzlePiece:nth-child('+tileNumber+')').data('y', y);
  });
}

function moveHorizontal(data) {
  console.log('horizontal');

  if (data.x > emptyCell.x) {
    $('.puzzlePiece').each(function() {
      if ($(this).data().y === emptyCell.y && $(this).data().y <= data.y) {
        console.log('left');
        moveTile($(this).index(), $(this).data().x - 1, $(this).data().y);
      }
    });
    emptyCell.x = 3;
  } else {
    $('.puzzlePiece').each(function() {
      if ($(this).data().y === emptyCell.y && $(this).data().y >= data.y) {
        console.log('right');
        moveTile($(this).index(), $(this).data().x + 1, $(this).data().y);
      }
    });
    emptyCell.x = 0;
  }
}

function moveVertical(data) {
  console.log('vertical');
  if (data.y > emptyCell.y) {
    $('.puzzlePiece').each(function() {
      if ($(this).data().x === emptyCell.x && $(this).data().x <= data.x) {
        console.log('up');
        moveTile($(this).index(), $(this).data().x, $(this).data().y - 1);
      }
    });
    emptyCell.y = 3;
  } else {
    $('.puzzlePiece').each(function() {
      if ($(this).data().x === emptyCell.x && $(this).data().x >= data.x) {
        console.log('down');
        moveTile($(this).index(), $(this).data().x, $(this).data().y + 1);
      }
    });
    emptyCell.y = 0;
  }
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
