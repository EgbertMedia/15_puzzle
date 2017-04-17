var emptyCell = {'x': 3, 'y': 3};
var gridSize = 4;
var animationDuration = 1000;
var moveable = true;
var possiblePositions = [];

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
      possiblePositions.push({'x': j, 'y': i});
    }
  }
  console.log(possiblePositions);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomArray() {
  var randomArray = possiblePositions.slice(); // Duplicate array
  do {
    for (var i = 0; i < randomArray.length; i++) {
      var randomInt = getRandomInt(0, randomArray.length);
      var tempValue = randomArray[i];
      randomArray[i] = randomArray[randomInt];
      randomArray[randomInt] = tempValue;
    }
  } while (1 != 1);
  return randomArray;
}

function randomize(randomArray) {
  for (var i = 0; i < randomArray.length; i++) {
    moveTile($('div.puzzlePiece:nth-child('+(i + 1)+')'), randomArray[i].x, randomArray[i].y);
  }
}

function moveTile(tileNumber, x, y) {
  tileNumber++; // CSS :nth-child selector starts with 1 instead of 0
  moveable = false;
  $('div.puzzlePiece:nth-child('+tileNumber+')').data('x', x);
  $('div.puzzlePiece:nth-child('+tileNumber+')').data('y', y);
  $('div.puzzlePiece:nth-child('+tileNumber+')').animate({
        'left': (x*100)+"px",
        'top': (y*100)+"px"
      }, animationDuration, 'linear', function() {
        moveable = true;
      });
}

function getTileDifference(a, b) {
  if (a > b) {
    return a - b;
  } else {
    return b - a;
  }
}

function moveHorizontal(data) {
  var selectedTile;
  var tileDifference = getTileDifference(data.x, emptyCell.x);
  if (data.x > emptyCell.x) {
    // Left
    for (var i = 0; i < tileDifference; i++) {
      $('.puzzlePiece').each(function() {
        if ($(this).data().y === data.y && $(this).data().x === emptyCell.x + i + 1) {
          moveTile($(this).index(), $(this).data().x - 1, $(this).data().y);
        }
      });
    }
    emptyCell.x += tileDifference;
  } else {
    // Right
    for (var i = 0; i < tileDifference; i++) {
      $('.puzzlePiece').each(function() {
        if ($(this).data().y === data.y && $(this).data().x === emptyCell.x - i - 1) {
          moveTile($(this).index(), $(this).data().x + 1, $(this).data().y);
        }
      });
    }
    emptyCell.x -= tileDifference;
  }
}

function moveVertical(data) {
  var selectedTile;
  var tileDifference = getTileDifference(data.y, emptyCell.y);
  if (data.y > emptyCell.y) {
    // UP
    for (var i = 0; i < tileDifference; i++) {
      $('.puzzlePiece').each(function() {
        if ($(this).data().x === data.x && $(this).data().y === emptyCell.y + i + 1) {
          moveTile($(this).index(), $(this).data().x, $(this).data().y - 1);
        }
      });
    }
    emptyCell.y += tileDifference;
  } else {
    // DOWN
    for (var i = 0; i < tileDifference; i++) {
      $('.puzzlePiece').each(function() {
        if ($(this).data().x === data.x && $(this).data().y === emptyCell.y - i - 1) {
          moveTile($(this).index(), $(this).data().x, $(this).data().y + 1);
        }
      });
    }
    emptyCell.y -= tileDifference;

  }
}

function move(data) {
  if (data.x === emptyCell.x && moveable === true) {
    moveable = false;
    moveVertical(data);
  } else if (data.y === emptyCell.y && moveable === true) {
    moveable = false;
    moveHorizontal(data);
  }
}

$(document).ready(function() {
  initPuzzle();
  $('.puzzlePiece').click(function(evt) {
    move($(this).data());
  });

  $('#randomize').click(function() {
    var randomArray = generateRandomArray();
    console.log(randomArray);
    randomize(randomArray);
  });
});
