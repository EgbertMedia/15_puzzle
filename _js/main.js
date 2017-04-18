var emptyCell = {'x': 3, 'y': 3};
var gridSize = 4;
var animationDuration = 300;
var moveable = true;
var possiblePositions = [];

// Create puzzlePiece
function createTile(x, y, tileCount) {
  var tile = $('<div />', {'class':  'puzzlePiece'});
  tile.css('left', (x*100)+"px");
  tile.css('top', (y*100)+"px");
  tile.css('background-position', 'left '+ (-(x*100)) + 'px top ' + (-(y*100)) + 'px');
  tile.text(tileCount);
  tile.data('x', x);
  tile.data('y', y);
  $('div#puzzleContainer').append(tile);

}

// Initialize puzzle, generate puzzle pieces
function initPuzzle() {
  var tileCount = 0;
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      if (tileCount < (gridSize*gridSize-1)) {
        createTile(j,i, tileCount);
        possiblePositions.push({'x': j, 'y': i, 'id': tileCount});
        tileCount++;
      } else {
        possiblePositions.push({'x': 3, 'y': 3, 'id': 15, 'empty': true});
      }
    }
  }
}

// Get random integer in range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Generates array with random positions
function generateRandomArray() {
  var randomArray = possiblePositions.slice(); // Duplicate array
  do {
    for (var i = 0; i < randomArray.length; i++) {
      var randomInt = getRandomInt(0, randomArray.length);
      var tempValue = randomArray[i];
      randomArray[i] = randomArray[randomInt];
      randomArray[randomInt] = tempValue;
    }
  } while (!isSolvable(randomArray));
  return randomArray;
}

// Calculate parity of Manhattan distance of emptyCell
function calcManhattanDist(array) {
  var xDifference = getTileDifference(array[15].x, 3);
  var yDifference = getTileDifference(array[15].y, 3);

  return (xDifference + yDifference) % 2;
}

// Check partity of permutation
function calcParityOfSolution(arrayInput) {
  var difference = 0;
  var array = arrayInput.slice();
  for (var i = 0; i < array.length; i++) {
    if (array[i].id !== i) {
      var temp = array[i];
      for (var j = 0; j < array.length; j++) {
        if (array[j].id === i) {
          array[i] = array[j];
          array[j] = temp;
          difference++;
        }
      }
    }
  }
  return difference % 2;
}

// Check if random generated puzzle is solvable
function isSolvable(array) {
  if (calcParityOfSolution(array) === calcManhattanDist(array)) {
    return true;
  } else {
    return false;
  }
}

//
function randomize(randomArray) {
  for (var i = 0; i < randomArray.length; i++) {
    if (i != 15) {
      moveTile(i, randomArray[i].x, randomArray[i].y);
    } else {
      emptyCell.x = randomArray[15].x;
      emptyCell.y = randomArray[15].y;
    }
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

function randomizeImage() {
  var imageNum = getRandomInt(0, 12);
  $('div.puzzlePiece').each( function() {
    $(this).css('background-image', 'url("./_img/'+imageNum+'.jpg")');
  });
}

$(document).ready(function() {
  initPuzzle();
  $('.puzzlePiece').click(function(evt) {
    move($(this).data());
  });

  $('#randomize').click(function() {
    var randomArray = generateRandomArray();
    randomize(randomArray);
  });

  $('#image').click(function() {
    randomizeImage();
  });
});
