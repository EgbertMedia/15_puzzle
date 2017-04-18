var emptyCell = {'x': 3, 'y': 3};
var gridSize = 4;
var animationDuration = 300;
var moveable = true;
var possiblePositions = [];

// Create puzzlePiece
function createTile(x, y, tileCount) {
  var tile = $('<div />', {'class':  'puzzlePiece'});
  // Set position
  tile.css('left', (x*100)+"px");
  tile.css('top', (y*100)+"px");
  // Set background to corresponding piece
  tile.css('background-position', 'left '+ (-(x*100)) + 'px top ' + (-(y*100)) + 'px');
  tile.text(tileCount);
  // Add data to tile
  tile.data('x', x);
  tile.data('y', y);
  // Add tile to puzzleContainer
  $('div#puzzleContainer').append(tile);

}

// Initialize puzzle, generate puzzle pieces
function initPuzzle() {
  var tileCount = 0;
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      // Don't generate div for emptyCell
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
  // Generate randomArrays until the array is solvable
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
  var permutation = 0;
  var array = arrayInput.slice();
  // For index in array
  for (var i = 0; i < array.length; i++) {
    // Check if at correct position
    if (array[i].id !== i) {
      var temp = array[i];
      // If incorrect, switch tile
      for (var j = 0; j < array.length; j++) {
        if (array[j].id === i) {
          array[i] = array[j];
          array[j] = temp;
          permutation++;
        }
      }
    }
  }
  // Return parity of permutation
  return permutation % 2;
}

// Check if random generated puzzle is solvable
function isSolvable(array) {
  if (calcParityOfSolution(array) === calcManhattanDist(array)) {
    return true;
  } else {
    return false;
  }
}

// Moves tiles to correct location based on input array
function randomize(randomArray) {
  for (var i = 0; i < randomArray.length; i++) {
    if (i != 15) {
      moveTile(i, randomArray[i].x, randomArray[i].y);
    } else {
      // Set emptyCell x, y to last index of array
      emptyCell.x = randomArray[15].x;
      emptyCell.y = randomArray[15].y;
    }
  }
}

// Moves tile to x, y
function moveTile(tileNumber, x, y) {
  tileNumber++; // CSS :nth-child selector starts with 1 instead of 0
  moveable = false;
  // Change data
  $('div.puzzlePiece:nth-child('+tileNumber+')').data('x', x);
  $('div.puzzlePiece:nth-child('+tileNumber+')').data('y', y);
  // Animate
  $('div.puzzlePiece:nth-child('+tileNumber+')').animate({
        'left': (x*100)+"px",
        'top': (y*100)+"px"
      }, animationDuration, 'linear', function() {
        // Allow movement when animation is done
        moveable = true;
      });
}

// Gets difference between 2 points
function getTileDifference(a, b) {
  if (a > b) {
    return a - b;
  } else {
    return b - a;
  }
}

// Handler for horizontal movement
function moveHorizontal(data) {
  var selectedTile;
  // Gets difference between clicked tile and emptyCell
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

// Handler for vertical movement
function moveVertical(data) {
  var selectedTile;
  // Gets difference between clicked tile and emptyCell
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

// Movement handler
function move(data) {
  if (data.x === emptyCell.x && moveable === true) {
    moveable = false;
    moveVertical(data);
  } else if (data.y === emptyCell.y && moveable === true) {
    moveable = false;
    moveHorizontal(data);
  }
}

// Change puzzle image to a random image
function randomizeImage() {
  var imageNum = getRandomInt(0, 12);
  $('div.puzzlePiece').each( function() {
    $(this).css('background-image', 'url("./_img/'+imageNum+'.jpg")');
  });
}

$(document).ready(function() {
  // Init puzzle
  initPuzzle();

  // Add event handler
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
