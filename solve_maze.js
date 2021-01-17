// Created By: Jacob Bonner
// Created On: January 2021
// This program takes a maze in a txt file and solves it.

// Importing module that will read text files
const fs = require('fs');

// Creating a boolean version of the maze as a global variable
var boolList;

// This function finds the start and end points of a maze
function findBreakPoints(startMaze) {
  // Setting up a list for coordinates as well as coordinate variables
  let breakCoords = [];
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  // Searching the array for a starting point
  for (let start1 = 0; start1 < startMaze.length; start1++) {
    for (let start2 = 0; start2 < startMaze[start1].length; start2++) {
      if (startMaze[start1][start2] == 'S') {
        startX = start1;
        startY = start2;
        break;
      }
    }
  }

  // Searching the array for a starting point
  for (let end1 = 0; end1 < startMaze.length; end1++) {
    for (let end2 = 0; end2 < startMaze[end1].length; end2++) {
      if (startMaze[end1][end2] == 'G') {
        endX = end1;
        endY = end2;
        break;
      }
    }
  }

  // Adding the coordinates to an array
  breakCoords[0] = startX;
  breakCoords[1] = startY;
  breakCoords[2] = endX;
  breakCoords[3] = endY;

  // Returning the array with the coordinates
  return breakCoords;
}

// This function puts elements from a txt file into a 2D array to create a maze
function createMaze(mazeFile, length, width) {
  // Creating an array to add the items of the maze to
  let newMaze = [];

  // Creating a separate counter to aid in the creation of the columns
  let createCounter = 0;

  // Adding the maze elements to another array to create a 2D array
  for (let row = 0; row < width; row++) {
    let tempString = mazeFile.substr(createCounter, length);
    let tempArray = [];
    for (let column = 0; column < length; column++) {
      tempArray[column] = tempString[column];
    }
    newMaze[row] = tempArray;
    createCounter += length + 2;
  }

  // Returning the newly created maze
  return newMaze;
}

// This function prints a maze from a 2D array to the user
function printMaze(mazeArray, length, width) {
  // Printing the elements of the maze array
  for (let counterX = 0; counterX < width; counterX++) {
    let rowString = '';
    for (let counterY = 0; counterY < length; counterY++) {
      rowString = rowString + mazeArray[counterX][counterY] + ' ';
    }
    console.log(rowString);
  }
}

// This function finds a solution to the boolean maze variant using recursion
function travelMaze(boolMaze, pathTraveled, finishedMaze, coordX, coordY, 
                    goalX, goalY) {
  // Checking if the user has reached the end of the maze
  if (coordX == goalX && coordY == goalY) {
    return true;
  }

  // Checking if the program is on a wall or has already visited the space
  if (boolMaze[coordX][coordY] || pathTraveled[coordX][coordY]) {
    return false;
  }

  // Marking the spot the program is on as been traveled through before
  pathTraveled[coordX][coordY] = true;

  // Checking if the program is on the left edge of the maze
  if (coordX != 0) {
    if (travelMaze(boolMaze, pathTraveled, finishedMaze, coordX - 1, 
                   coordY, goalX, goalY)) {
      boolList[coordX][coordY] = true;
      return true;
    }
  }

  // Checking if the program is on the right edge of the maze
  if (coordX != boolMaze.length - 1) {
    if (travelMaze(boolMaze, pathTraveled, finishedMaze, coordX + 1, 
                   coordY, goalX, goalY)) {
      boolList[coordX][coordY] = true;
      return true;
    }
  }

  // Checking if the program is on the top edge of the maze
  if (coordY != 0) {
    if (travelMaze(boolMaze, pathTraveled, finishedMaze, coordX, 
                   coordY - 1, goalX, goalY)) {
      boolList[coordX][coordY] = true;
      return true;
    }
  }

  // Checking if the program is on the bottom edge of the maze
  if (coordY != boolMaze[0].length - 1) {
    if (travelMaze(boolMaze, pathTraveled, finishedMaze, coordX, 
                   coordY + 1, goalX, goalY)) {
      boolList[coordX][coordY] = true;
      return true;
    }
  }
    
  // Returning false should none of the above conditions be met
  return false;
}

// This function finds whether or not there is a solution for the maze
function exploreMaze(viewMaze, startStop, rowSize, columnSize) {
  // Creating boolean equivalents of the map to keep track of solving info
  boolList = [];
  let mapBoolean = [];
  let firstBoolList = [];
  let secondBoolList = [];

  // Creating a boolean equivalent to the maze
  for (let mapRow = 0; mapRow < viewMaze.length; mapRow++) {
    let tempBoolean = [];
    for (let mapColumn = 0; mapColumn < viewMaze[0].length; mapColumn++) {
      if (viewMaze[mapRow][mapColumn] == '#') {
        tempBoolean[mapColumn] = true;
      } else {
        tempBoolean[mapColumn] = false;
      }
    }
    mapBoolean[mapRow] = tempBoolean;
  }

  // Filling the other arrays with boolean values
  for (let booleanRow = 0; booleanRow < viewMaze.length; booleanRow++) {
    let tempBool = [];
    for (let booleanCol = 0; booleanCol < viewMaze[booleanRow].length;
         booleanCol++) {
      tempBool[booleanCol] = false;
    }
    boolList[booleanRow] = tempBool;
    firstBoolList[booleanRow] = tempBool;
    secondBoolList[booleanRow] = tempBool;
  }

  // Extracting important coordinates from the passed in array
  let beginX = startStop[0];
  let beginY = startStop[1];
  let stopX = startStop[2];
  let stopY = startStop[3];

  // Finding a solution for the maze
  let solution = travelMaze(mapBoolean, firstBoolList, secondBoolList, beginX, 
                            beginY, stopX, stopY);

  // Telling the user if a solution was found or not
  if (solution == true) {
    console.log("Solution Found");
  } else {
    console.log("No Solution Found");
  }

  // Initializing a character array containing the solved maze
  let solvedMaze = [];

  // Converting the boolean version of the maze back to normal
  for (let rows = 0; rows < columnSize; rows++) {
    let tempSolved = [];
    for (let cols = 0; cols < rowSize; cols++) {
      if (boolList[rows][cols] == true) {
        tempSolved[cols] = '+';
      } else if (boolList[rows][cols] == false
                 && viewMaze[rows][cols] == '.') {
        tempSolved[cols] = '.';
      } else {
        tempSolved[cols] = '#';
      }
    }
    solvedMaze[rows] = tempSolved;
  }

  // Redefining the start and end coordinates
  solvedMaze[beginX][beginY] = 'S';
  solvedMaze[stopX][stopY] = 'G';

  // Returning the newly solved maze
  return solvedMaze;
}

// Creating the first maze
let firstMazeFile = fs.readFileSync('Maze1.txt', 'utf8');
let firstMaze = createMaze(firstMazeFile, 6, 6);

// Printing the first maze at its starting point
console.log("Maze 1:");
printMaze(firstMaze, 6, 6);
console.log("");

// Finding the start and stop points of the first maze
let firstBreakPoints = findBreakPoints(firstMaze);

// Finding a solution to the first maze and printing it out
let firstSolved = exploreMaze(firstMaze, firstBreakPoints, 6, 6);
printMaze(firstSolved, 6, 6);
console.log("");
console.log("");

// Creating the second maze
let secondMazeFile = fs.readFileSync('Maze2.txt', 'utf8');
let secondMaze = createMaze(secondMazeFile, 6, 12);

// Printing the second maze at its starting point
console.log("Maze 2:");
printMaze(secondMaze, 6, 12);
console.log("");

// Finding the start and stop points of the second maze
let secondBreakPoints = findBreakPoints(secondMaze);

// Finding a solution to the second maze and printing it out
let secondSolved = exploreMaze(secondMaze, secondBreakPoints, 6, 12);
printMaze(secondSolved, 6, 12);
console.log("");
console.log("");

// Creating the third maze
let thirdMazeFile = fs.readFileSync('Maze3.txt', 'utf8');
let thirdMaze = createMaze(thirdMazeFile, 19, 9);

// Printing the third maze at its starting point
console.log("Maze 3:");
printMaze(thirdMaze, 19, 9);
console.log("");

// Finding the start and stop points of the third maze
let thirdBreakPoints = findBreakPoints(thirdMaze);

// Finding a solution to the third maze and printing it out
let thirdSolved = exploreMaze(thirdMaze, thirdBreakPoints, 19, 9);
printMaze(thirdSolved, 19, 9);
