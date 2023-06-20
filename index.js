"use strict";
(function() {
  window.addEventListener("load", init);
  // in the inner-most size 2 array, index 0 is whether ship is there (1 for yes and 0 for no);
  // index 1 is size of ship (0 for no ship and 5,4,3,2 for yes ship's size)
  let userShips =  [
    [[0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1]],
    [[0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1]],
    [[0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1]],
    [[0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1]],
    [[0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1]]
  ];
  // in the inner-most size 3 array, index 0 is whether ship is there (1 for yes and 0 for no);
  // index 1 is size of ship (0 for no ship and 5,4,3,2 for yes ship's size);
  // index 2 is type of ship (0 for on row and 1 for on column)
  let aiShips =  [
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]]
  ];
  //for index 0: 1 represents ship found, 2 represents ship sunk, 0 represents not checked, -1 represents no ship
  // for index 1: ship type, 0 means not checked or miss
  let userGuesses =  [
    [[0,0], [0,0], [0,0], [0,0], [0,0]],
    [[0,0], [0,0], [0,0], [0,0], [0,0]],
    [[0,0], [0,0], [0,0], [0,0], [0,0]],
    [[0,0], [0,0], [0,0], [0,0], [0,0]],
    [[0,0], [0,0], [0,0], [0,0], [0,0]]
  ];
  let aiGuesses =  [ //var is for ai's guess
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  let shipsLeft = [5, 4, 3, 2]; //var is for ai's guess
  let sizes = [];
  let counter = 0;
  let currType;
  const POSSIBLE_SHIPS = [5, 4, 3, 2];
  //for ai's guess below
  let AMT = 0.04;
  let fiveShip; //fiveShip, fourShip, threeShip, and twoShip store probabilities at each position in grid for specific-size ships to exist
  let fourShip;
  let threeShip;
  let twoShip;
  let max5 = 0;
  let max4 = 0;
  let max3 = 0;
  let max2 = 0;
  let twoLoc = [0,0];
  let threeLoc = [0,0];
  let fourLoc = [0,0];
  let fiveLoc = [0,0];

  function prob() {
    //all zeros in aiGuesses originally have equal probability; the 1s, 2s, and -1s in aiGuesses have -1 probability
    populateArray();
    highestProbability();
    let arr = [];
    if (shipsLeft.includes(5)) {
      arr.push(max5);
    }
    if (shipsLeft.includes(4)) {
      arr.push(max4);
    }
    if (shipsLeft.includes(3)) {
      arr.push(max3);
    }
    if (shipsLeft.includes(2)) {
      arr.push(max2);
    }
    let maxProb = Math.max.apply(null, arr);
    if (maxProb === max5) {
      return fiveLoc;
    } else if (maxProb === max4) {
      return fourLoc;
    } else if (maxProb === max3) {
      return threeLoc;
    } else if (maxProb === max2) {
      return twoLoc;
    }
  }
  function highestProbability() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (shipsLeft.includes(5)) {
          let fiveProb = fiveShip[i][j];
          if (fiveProb > max5) {
            max5 = fiveProb;
            fiveLoc[0] = i;
            fiveLoc[1] = j;
          }
        }
        if (shipsLeft.includes(4)) {
          let fourProb = fourShip[i][j];
          if (fourProb > max4) {
            max4 = fourProb;
            fourLoc[0] = i;
            fourLoc[1] = j;
          }
        }
        if (shipsLeft.includes(3)) {
          let threeProb = threeShip[i][j];
          if (threeProb > max3) {
            max3 = threeProb;
            threeLoc[0] = i;
            threeLoc[1] = j;
          }
        }
        if (shipsLeft.includes(2)) {
          let twoProb = twoShip[i][j];
          if (twoProb > max2) {
            max2 = twoProb;
            twoLoc[0] = i;
            twoLoc[1] = j;
          }
        }
      }
    }
  }

  function populateArray() {
    createProbArrays();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        let shipThere = aiGuesses[i][j];
        if (shipThere === 0) {
          update(i, j);
        } else if (shipThere === 1) {
          countOnes(i, j);
        }
      }
    }
  }

  function countOnes(row, col) {
    //right
    let i = col;
    let count = 0;
    //while you are not to end of row and element is ship, keep going forward
    while (i < 4 && aiGuesses[row][i] === 1) {
      count++;
      i++;
    }
    // once you find element that is not known, increase its corresponding probability
    if (aiGuesses[row][i] === 0) {
      for (let j = 0; j < shipsLeft.length; j++) {
        let shipVal = shipsLeft[j];
        if (count < shipVal) {
          if (shipVal === 5) {
            fiveShip[row][i] += (AMT * count);
          } else if (shipVal === 4) {
            fourShip[row][i] += (AMT * count);
          } else if (shipVal === 3) {
            threeShip[row][i] += (AMT * count);
          } else if (shipVal === 2) {
            twoShip[row][i] += (AMT * count);
          }
        }
      }
    }
    //left
    i = col;
    count = 0;
    while (i > 0 && aiGuesses[row][i] === 1) {
      count++;
      i--;
    }
    if (aiGuesses[row][i] === 0) {
      for (let j = 0; j < shipsLeft.length; j++) {
        let shipVal = shipsLeft[j];
        if (count < shipVal) {
          if (shipVal === 5) {
            fiveShip[row][i] += (AMT * count);
          } else if (shipVal === 4) {
            fourShip[row][i] += (AMT * count);
          } else if (shipVal === 3) {
            threeShip[row][i] += (AMT * count);
          } else if (shipVal === 2) {
            twoShip[row][i] += (AMT * count);
          }
        }
      }
    }
    //down
    i = row;
    count = 0;
    while (i < 4 && aiGuesses[i][col] === 1) {
      count++;
      i++;
    }
    if (aiGuesses[i][col] == 0) {
      for (let j = 0; j < shipsLeft.length; j++) {
        let shipVal = shipsLeft[j];
        if (count < shipVal) {
          if (shipVal === 5) {
            fiveShip[i][col] += (AMT * count);
          } else if (shipVal === 4) {
            fourShip[i][col] += (AMT * count);
          } else if (shipVal === 3) {
            threeShip[i][col] += (AMT * count);
          } else if (shipVal === 2) {
            twoShip[i][col] += (AMT * count);
          }
        }
      }
    }
    //up
    i = row;
    count = 0;
    while (i > 0 && aiGuesses[i][col] === 1) {
      count++;
      i--;
    }
    if (aiGuesses[i][col] === 0) {
      for (let j = 0; j < shipsLeft.length; j++) {
        let shipVal = shipsLeft[j];
        if (count < shipVal) {
          if (shipVal === 5) {
            fiveShip[i][col] += (AMT * count);
          } else if (shipVal === 4) {
            fourShip[i][col] += (AMT * count);
          } else if (shipVal === 3) {
            threeShip[i][col] += (AMT * count);
          } else if (shipVal === 2) {
            twoShip[i][col] += (AMT * count);
          }
        }
      }
    }
  }

  function update(i, j) {
    if (shipsLeft.includes(5)) {
      fiveShip[i][j] += AMT;
    }
    if (shipsLeft.includes(4)) {
      fourShip[i][j] += AMT;
    }
    if (shipsLeft.includes(3)) {
      threeShip[i][j] += AMT;
    }
    if (shipsLeft.includes(2)) {
      twoShip[i][j] += AMT;
    }
  }

  function createProbArrays() {
    if (shipsLeft.includes(5)) {
      fiveShip = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ];
    }
    if (shipsLeft.includes(4)) {
      fourShip = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ];
    }
    if (shipsLeft.includes(3)) {
      threeShip = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ];
    }
    if (shipsLeft.includes(2)) {
      twoShip = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ];
    }
  }

  function init() {
    getId("add-ships").addEventListener("click", displayUserGrid);
    let createShipBtns = qsa("#create-ship > button");
    for (let i = 0; i < createShipBtns.length; i++) {
      createShipBtns[i].addEventListener("click", createShip);
    }
    let chooseShipBtns = qsa("#user-ships > button");
    for (let i = 0; i < chooseShipBtns.length; i++) {
      chooseShipBtns[i].addEventListener("click", addShip);
      chooseShipBtns[i].disabled = true;
    }
    let guessOptions = qsa("#user-guess > button");
    for (let i = 0; i < guessOptions.length; i++) {
      guessOptions[i].disabled = true;
      guessOptions[i].addEventListener("click", addUserGuess);
    }
    getId("start-game").addEventListener("click", startGame);
  }

  function createShip() {
    //figure out which ship is being created
    sizes.push(parseInt(this.id.split("-")[1]));
    // disable all create buttons until this one is fully created
    let createShipBtns = qsa("#create-ship > button");
    for (let i = 0; i < createShipBtns.length; i++) {
      createShipBtns[i].disabled = true;
    }
    // enable choosing the ship squares on the grid
    getId("choose-ship-type").classList.remove("hidden");
    //add event listener
    let types = qsa("#choose-ship-type > button");
    for (let i = 0; i < types.length; i++) {
      types[i].addEventListener("click", chooseType);
      types[i].disabled = false;
    }
  }

  function chooseType() {
    currType = this.id.split("-")[1];
    let types = qsa("#choose-ship-type > button");
    for (let i = 0; i < types.length; i++) {
      types[i].disabled = true;
    }
    enableChoosingUserShips(true);
  }

  function enableChoosingUserShips(yes) {
    let chooseBtns = qsa("#user-ships > button");
    for (let i = 0; i < chooseBtns.length; i++) {
      chooseBtns[i].disabled = !yes;
    }
  }

  function addShip() {
    if (counter < sizes[sizes.length - 1]) {
      let rowColStr = this.id.split("-");
      let rowToCheck = parseInt(rowColStr[0]);
      let colToCheck = parseInt(rowColStr[1]);
      this.classList.add("make-green");
      this.textContent = sizes[sizes.length - 1];
      this.removeEventListener("click", addShip);
      // update userShips array
      let type;
      if (currType === "row") {
        type = 0;
      } else {
        type = 1;
      }
      userShips[rowToCheck - 1][colToCheck - 1] = [1, sizes[sizes.length - 1], type];
      counter++;
      if (counter > 0) {
        let chooseBtns = qsa("#user-ships > button");
        for (let i = 0; i < chooseBtns.length; i++) {
          let row = parseInt(chooseBtns[i].id.split("-")[0]);
          let col = parseInt(chooseBtns[i].id.split("-")[1]);
          if (currType === "row" && row === rowToCheck && ((col === colToCheck - 1) || (col === colToCheck + 1))) {
            chooseBtns[i].disabled = false;
          } else if (currType === "column" && col === colToCheck && ((row === rowToCheck - 1) || (row === rowToCheck + 1))) {
            chooseBtns[i].disabled = false;
          } else if (counter === 1 || (chooseBtns[i].disabled != false)) {
            chooseBtns[i].disabled = true;
          }
        }
      }
    }

    if (counter === sizes[sizes.length - 1]) {
      // disable choosing ship squares on grid
      enableChoosingUserShips(false);
      // enable all create ship buttons except the ones chosen previously
      let createShipBtns = qsa("#create-ship > button");
      for (let i = 0; i < createShipBtns.length; i++) {
        let id = parseInt(createShipBtns[i].id.split("-")[1]);
        if (!sizes.includes(id)) {
          createShipBtns[i].disabled = false;
        }
      }
      counter = 0;
    }
    //check whether to allow start game
    if (sizes.length === POSSIBLE_SHIPS.length) {
      getId("start-game").disabled = false;
    }
  }

  function startGame() {
    getId("start-game").disabled = true;
    // set up AI's functionality with 5x5x2 grid with random ships
    createAIShips();
    getId("turn-text").classList.remove("hidden");
    enableGuessOptions(true);
  }

  function enableGuessOptions(yes) {
    getId("turn-text").textContent = "It's your turn! Click on a square to guess if there's a ship there. It will turn green on ship sunk, red on miss, and yellow on a ship hit";
    let guessOptions = qsa("#user-guess > button");
    for (let i = 0; i < guessOptions.length; i++) {
      guessOptions[i].disabled = !yes;
    }
  }

  function addUserGuess() {
    // check if it is a hit, miss, or sunk and update
    // get position clicked
    let id = this.id.split("-");
    let row = parseInt(id[1]) - 1;
    let col = parseInt(id[2]) - 1;
    let shipSize = aiShips[row][col][1];
    userGuesses[row][col][1] = shipSize;
    if (aiShips[row][col][0] === 1) {
      //hit
      userGuesses[row][col][0] = 1;
      this.classList.add("make-yellow");
      this.textContent = "Hit :)";
      // check if sunk and update to 2, then do make-green
      let hits = sunk(row, col, shipSize, aiShips[row][col][2]);
      if (hits.length > 0) {
        for (let i = 0; i < hits.length; i++) {
          let hitRow = hits[i][0];
          let hitCol = hits[i][1];
          userGuesses[hitRow][hitCol][0] = 2;
          //remove id's color and make green and change textcontent to sunk
          let itemToChange = getId("guess-" + (hitRow + 1) + "-" + (hitCol + 1));
          itemToChange.classList.add("make-green");
          itemToChange.textContent = "SUNK :)";
        }
        //check win here
        console.log("about to check win for you");
        if (checkWin(true)) {
          console.log("you won!");
          //show win page for user to win
          qs("main").classList.add("hidden");
          let view = getId("win-view");
          view.classList.remove("hidden");
        }
      }
    } else {
      // miss
      userGuesses[row][col][0] = -1;
      this.classList.add("make-red");
      this.textContent = "Miss :(";
    }
    enableGuessOptions(false);
    addAIGuess();
  }

  function addAIGuess() {
    getId("turn-text").textContent = "It's the opponent's turn! It will highlight its guess on your board in orange if it hits your ship, red if it sinks, and yellow in a miss.";
    let chosenPos = prob();
    let row = chosenPos[0];
    let col = chosenPos[1];
    if (userShips[row][col][0] === 0) {
      aiGuesses[row][col] = -1;
      getId((row + 1) + "-" + (col + 1)).classList.remove("make-green");
      getId((row + 1) + "-" + (col + 1)).classList.remove("make-red");
      getId((row + 1) + "-" + (col + 1)).classList.add("make-yellow");
    } else {
      getId((row + 1) + "-" + (col + 1)).classList.remove("make-green");
      getId((row + 1) + "-" + (col + 1)).classList.remove("make-yellow");
      //check sunk; if so, set aiGuesses to 2 and remove that size ship from shipsLeft
      let type = userShips[row][col][2];
      let size = userShips[row][col][1];
      aiGuesses[row][col] = 1;
      let hits = userShipSunk(row, col, size, type);
      if (hits.length > 0) {
        for (let i = 0; i < hits.length; i++) {
          let pos = hits[i];
          aiGuesses[pos[0]][pos[1]] = 2;
          getId((pos[0] + 1) + "-" + (pos[1] + 1)).classList.remove("make-green");
          getId((pos[0] + 1) + "-" + (pos[1] + 1)).classList.remove("make-yellow");
          getId((pos[0] + 1) + "-" + (pos[1] + 1)).classList.remove("make-orange");
          getId((pos[0] + 1) + "-" + (pos[1] + 1)).classList.add("make-red");
        }
        shipsLeft.splice(shipsLeft.indexOf(size), 1);
        //check win
        if (checkWin(false)) {
          // show in page for ai to win
          qs("main").classList.add("hidden");
          let view = getId("win-view");
          view.classList.remove("hidden");
          qs("#win-view > h2").textContent = "Oh no! The opponent won :) Good luck next time";
        }
      } else {
        getId((row + 1) + "-" + (col + 1)).classList.add("make-orange");
      }
    }
    resetAIGuess();
    setTimeout(enableGuessOptions, 500, true);
  }

  function checkWin(me) {
    if (me) { //if user wins, it has sunk all of AI's ships (2)
      let totalShipSquares = 0;
      for (let i = 0; i < POSSIBLE_SHIPS.length; i++) {
        totalShipSquares += (POSSIBLE_SHIPS[i]);
      }
      let count = 0;
      console.log("userGuesses is ");
      console.log(userGuesses);
      for (let i = 0; i < userGuesses.length; i++) {
        for (let j = 0; j < userGuesses[0].length; j++) {
          console.log("val is " + userGuesses[i][j][0]);
          if (userGuesses[i][j][0] === 2) {
            count++;
          }
        }
      }
      console.log("count is" + count);
      return count === totalShipSquares; //5+4+3+2=14 for ship sizes
    } else {
      return shipsLeft.length === 0; //if AI wins, there are no more ships left for it to check
    }
  }

  function resetAIGuess() {
    max5 = 0;
    max4 = 0;
    max3 = 0;
    max2 = 0;
    twoLoc = [0,0];
    threeLoc = [0,0];
    fourLoc = [0,0];
    fiveLoc = [0,0];
  }

  function userShipSunk(row, col, size, type) {
    //check userGuesses to see if there are size number of hits in the given type (row or col)
    // if true, return list of all positions/ships hit in that row; else, return empty list
    let countHits = 0;
    let hits = [];
    for (let j = 0; j < 5; j++) {
      let newRow;
      let newCol;
      if (type === 0) {
        newRow = row;
        newCol = j;
      } else {
        newRow = j;
        newCol = col;
      }
      let hitOrNot = aiGuesses[newRow][newCol];
      let vals = userShips[newRow][newCol];
      if (hitOrNot === 1 && vals[1] === size && vals[2] === type) {
        countHits++;
        hits.push([newRow, newCol]);
      }
    }
    if (countHits === size) {
      return hits;
    }
    return [];
  }

  function sunk(row, col, size, type) {
    //check userGuesses to see if there are size number of hits in the given type (row or col)
    // if true, return list of all positions/ships hit in that row; else, return empty list
    let countHits = 0;
    let hits = [];
    for (let j = 0; j < 5; j++) {
      let vals;
      let newRow;
      let newCol;
      if (type === 0) {
        newRow = row;
        newCol = j;
      } else {
        newRow = j;
        newCol = col;
      }
      vals = userGuesses[newRow][newCol];
      if (vals[1] === size && vals[0] === 1) {
        countHits++;
        hits.push([newRow, newCol]);
      }
    }
    if (countHits === size) {
      return hits;
    }
    return [];
  }

  function createAIShips() {
    for (let i = 0; i < POSSIBLE_SHIPS.length; i++) {
      addAIShip(POSSIBLE_SHIPS[i]);
    }
  }

  function aiShipContainsEl(row, col) {
    if (aiShips[row][col][0] === 0 && aiShips[row][col][1] === 0) {
      return false;
    } else {
      return true;
    }
  }

  function findPossiblities(byRow, size, prev) {
    let possibilities = [];
    for (let i = 0; i < 5; i++) {
      let countAdj = 0;
      for (let j = 0; j < 5; j++) {
        let row = i;
        let col = j;
        if (!byRow) {
          row = j;
          col = i;
        }
        if (aiShips[row][col][0] === 0) {
          countAdj++;
        } else if (countAdj < size) {
          countAdj = 0;
        }
        if (countAdj === size) {
          let start = j + 1 - size;
          let val;
          if (byRow) {
            val = [i, start];
          } else {
            val = [start, i];
          }
          // check if already exists
          if ((prev && !containsEl(prev, val)) || !prev) {
            possibilities.push(val);
          }
          break;
        }
      }
    }
    return possibilities;
  }

  function addAIShip(size) {
    //check which rows are possible
    let possibleRows = findPossiblities(true, size);
    let possibleCols = findPossiblities(false, size, possibleRows);

    // choose randomly whether to create row (0) or column (1)
    let type = Math.round(Math.random());
    if (type === 0 && possibleRows.length === 0) {
      type = 1;
    } else if (type === 1 && possibleCols.length === 0) {
      type = 0;
    }
    // index 0 is row, index 1 is col, index 2 is whether that position is part of row or column
    let startPos = [];
    if (type === 0) {
      let index = Math.floor(Math.random() * possibleRows.length);
      startPos.push(possibleRows[index][0]);
      startPos.push(possibleRows[index][1]);
      startPos.push(0);
    } else if (type === 1) {
      let index = Math.floor(Math.random() * possibleCols.length);
      startPos.push(possibleCols[index][0]);
      startPos.push(possibleCols[index][1]);
      startPos.push(1);
    }
    // update aiShips
    for (let i = 0; i < size; i++) {
      let type = startPos[2];
      if (type === 0) {
        aiShips[startPos[0]][startPos[1] + i] = [1, size, 0];
      } else if (type === 1) {
        aiShips[startPos[0] + i][startPos[1]] = [1, size, 1];
      }
    }
  }

  function containsEl(arr, target) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === target[0] && arr[i][1] === target[1]) {
        return true;
      }
    }
    return false;
  }

  function displayUserGrid() {
    getId("user-view").classList.remove("hidden");
    getId("add-ships").disabled = true;
  }

  //HELPER FUNCTIONS
  function getId(id) {
    return document.getElementById(id);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function gen(type) {
    return document.createElement(type);
  }

})();