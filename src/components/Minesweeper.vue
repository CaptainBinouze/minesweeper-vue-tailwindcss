<template>
  <div
    class="container h-screen mx-auto p-4 flex flex-col justify-start items-center"
  >
    <div class="w-full mt-7 h-16 flex flex-row justify-between items-center">
      <h1 class="text-2xl text-gray-800 font-semibold leading-tight">Minesweeper</h1>
      <div class="flex flex-row">
        <div
          v-if="started == true"
          @click="started = false"
          title="Back to home page"
          class="group flex justify-center items-center p-3 my-auto sm:p-5 rounded-xl mx-2 bg-white shadow-md cursor-pointer"
        >
          <font-awesome-icon icon="home" class="text-gray-800 group-hover:text-gray-500" />
        </div>
        <div
          v-if="started == true"
          @click="initGrid"
          title="Reset game"
          :class="['group flex justify-center items-center p-3 my-auto sm:p-5 rounded-xl mx-2 bg-white shadow-md cursor-pointer']"
        >
          <font-awesome-icon
            icon="undo"
            class="text-gray-800 group-hover:text-gray-500"
          />
        </div>
      </div>
    </div>
    <!--<div v-if="isMobile()">mobile</div>-->
    <div class="h-full flex flex-col justify-center items-center">
      <div v-if="!started" class="flex flex-col">
        <label class="mb-1 text-md text-grey-darkest" for="size">Size</label>
        <input
          id="size"
          v-model="size"
          @change="sizeHandler"
          type="number"
          name="size"
          class="border rounded-xl p-4 mb-5 text-grey-darkest"
          size="3"
        />
        <label class="mb-1 text-md text-grey-darkest" for="bombs">Mines</label>
        <input
          id="bombs"
          v-model="bombs"
          type="number"
          name="bombs"
          class="border rounded-xl p-4 mb-5 text-grey-darkest"
          size="3"
        />
        <button
          @click="initGrid"
          class="p-4 rounded-xl shadow-md text-grey-darkest bg-white"
        >
          Let's go
        </button>
      </div>

      <div v-else class="board">
        <div class="grid">
          <div class="stats"></div>

          <div
            v-for="(line, index) in grid"
            :key="index"
            class="line flex flex-row"
          >
            <div
              v-for="(c, cIndex) in line"
              :key="cIndex"
              class="cell"
              :class="[
                cellClass(c),
                'text-lg w-6 h-6 xl:w-8 xl:h-8 bg-gray-500 m-0.5 flex justify-center items-center text-white font-bold rounded',
              ]"
              @click="!gameOver ? trigger(c) : ''"
              @contextmenu.prevent="flag(c)"
            >
              {{ cellContent(c) }}
              <font-awesome-icon v-if="!gameOver && c.flagged" icon="flag" />
              <font-awesome-icon
                v-if="gameOver && c.bomb && c.triggered"
                icon="bomb"
                class="text-red-400"
              />
              <font-awesome-icon
                v-if="gameOver && c.bomb && !c.triggered"
                icon="bomb"
                class="text-white"
              />
            </div>
          </div>
          <div :class="['rounded mx-0.5 mt-3', !gameOver ? 'bg-gray-500' : won ? 'bg-green-600' : 'bg-red-600 ']">
            <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
              <div class="flex items-center justify-between flex-wrap">
                <div class="w-0 flex-1 flex items-center">
                  <span class="flex p-1 sm:p-2 rounded-md bg-white">
                    <div v-if="gameOver" class="h-6 w-6 flex justify-center items-center" >
                      <font-awesome-icon
                        v-if="won"
                        icon="trophy"
                        class="text-green-600"
                      />
                      <font-awesome-icon
                        v-if="lost"
                        icon="poop"
                        class="text-red-600"
                      />
                    </div>
                    <div v-else class="h-6 w-6 flex justify-center items-center" >
                      <font-awesome-icon
                        icon="clock"
                        class="text-gray-600"
                      />
                    </div>
                  </span>
                  <p class="ml-3 font-medium text-xs sm:text-lg text-white truncate">
                    <span v-if="gameOver" class="inline">
                      <span v-if="won">Win, in {{timePassed | time }} !</span>
                      <span v-else>Lost, try again !</span>
                    </span>
                    <span v-else class="inline">
                      {{timePassed | time }}
                    </span>
                  </p>
                </div>
                <div v-if="gameOver" class="order-3 flex-shrink-0 sm:order-2 sm:w-auto">
                  <a href="#" @click="initGrid" :class="['flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 text-gray-700']">
                    Play again
                  </a>
                </div>
                <div v-if="!gameOver && isMobile()" class="order-3 flex-shrink-0 sm:order-2 sm:w-auto flex flex-row">
                  <span @click="mobileAction = 1" :class="['flex p-1 sm:p-2 rounded-md',mobileAction == 1 ? 'bg-white' : 'bg-gray-500']">
                    <div class="h-6 w-6 flex justify-center items-center" >
                      <font-awesome-icon
                        icon="gavel"
                        :class="[mobileAction == 1 ? 'text-gray-600' : 'text-white']"
                      />
                    </div>
                  </span>
                  <span @click="firstClick ? mobileAction = 1 : mobileAction = 2" :class="['flex p-1 sm:p-2 rounded-md',mobileAction == 2 ? 'bg-white' : 'bg-gray-500']">
                    <div class="h-6 w-6 flex justify-center items-center" >
                      <font-awesome-icon
                        icon="flag"
                        :class="[mobileAction == 2 ? 'text-gray-600' : 'text-white']"
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Minesweeper",
  data() {
    return {
      grid: [],
      lost: false,
      won: false,
      started: false,
      flags: 0,
      bombs: 10,
      size: 10,
      firstClick: true,
      timePassed: 0,
      timeInterval: null,
      mobileAction: 1,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  },
  created() {
    window.addEventListener("resize", this.screenResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.screenResize);
  },
  filters: {
    time: function (value) {
      if (value == 0) return '0:00'
      if(value < 60) {
        return '0:' +  (value < 10 ? '0'+value : value)
      }
      if(value > 59) {
        return Math.trunc(value/60) + ':' + (value%60 < 10 ? '0'+(value%60) : value%60)
      }
    }
  },
  computed: {
    /**
     * Calculates the number of uncovered cells
     */
    left() {
      var left = 0;
      const size = this.size;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (!this.grid[i][j].revealed) {
            left++;
          }
        }
      }
      return left;
    },
    /**
     * Is the game over ?
     */
    gameOver() {
      return this.won || this.lost;
    },
    /**
     * Number of flags set
     */
    flagsSet() {
      var nbFlags = 0;
      const size = this.size;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (this.grid[i][j].flagged) {
            nbFlags++;
          }
        }
      }
      return nbFlags;
    },
  },
  methods: {
    timer() {
      this.timeInterval = setInterval(() => {
        this.timePassed = this.timePassed + 1
      }, 1000);
    },
    screenResize() {
      this.screenWidth = window.innerWidth
      this.screenHeight = window.innerHeight
      this.sizeHandler()
    },
    sizeHandler(){
      if(this.size < 10) {
        this.size = 10
      }
      if(this.screenWidth < 1025) {
        if(this.size > Math.trunc(this.screenWidth/28)) {
          this.size = Math.trunc(this.screenWidth/28)
        }
      } else {
        if(this.size > Math.trunc((this.screenHeight - 165)/36)) {
          this.size = Math.trunc((this.screenHeight - 165)/36)
        }
      }

    },
    initGrid() {
      clearInterval(this.timeInterval);
      const grid = [];
      const cells = [];
      const size = this.size;
      // Cell creation
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          cells.push({
            // Is the bomb flagged (simpleclick)
            flagged: false,
            // Is the bomb triggered (dblclick)
            triggered: false,
            // Is there a bomb on it ?
            bomb: false,
            // Nb of bombs around
            bombsAround: 0,
            // Is the cell content visible ?
            revealed: false,
            // Position
            x: j,
            y: i,
          });
        }
      }
      // Grid creation
      for (let i = 0; i < size; i++) {
        const line = [];
        for (let j = 0; j < size; j++) {
          // Finding cell in list:
          line.push(cells.shift());
        }
        grid.push(line);
      }
      // Initializ game vars
      this.grid = grid;
      this.points = 0;
      this.lost = false;
      this.won = false;
      this.started = true;
      this.firstClick = true;
      this.timePassed = 0;
      this.mobileAction = 1;
    },
    /**
     * Board initialization
     */
    start(firstCell) {
      this.timer()
      const grid = []; // Final grid
      const cells = []; // Cells list for easy loopings
      const size = parseInt(this.size); // Grid side size
      const bombs = this.bombs; // Number of bombs
      // Cell creation
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          cells.push({
            // Is the bomb flagged (simpleclick)
            flagged: false,
            // Is the bomb triggered (dblclick)
            triggered: false,
            // Is there a bomb on it ?
            bomb: false,
            // Nb of bombs around
            bombsAround: 0,
            // Is the cell content visible ?
            revealed: false,
            // Position
            x: j,
            y: i,
          });
        }
      }
      let idFirstClick = firstCell.y * size + firstCell.x;
      const excludedCell = [
        idFirstClick > size - 1 && idFirstClick % 10 > 0
          ? idFirstClick - size - 1
          : -1,
        idFirstClick > size - 1 ? idFirstClick - size : -1,
        idFirstClick > size - 1 && idFirstClick % 10 < 9
          ? idFirstClick - size + 1
          : -1,
        idFirstClick % 10 > 0 ? idFirstClick - 1 : -1,
        idFirstClick,
        idFirstClick % 10 < 9 ? idFirstClick + 1 : -1,
        idFirstClick < size * (size - 1) && idFirstClick % 10 > 0
          ? idFirstClick + size - 1
          : -1,
        idFirstClick < size * (size - 1) ? idFirstClick + size : -1,
        idFirstClick < size * (size - 1) && idFirstClick % 10 < 9
          ? idFirstClick + size + 1
          : -1,
      ];
      console.log(excludedCell);
      // Placing bombs
      const nbCells = cells.length;

      for (let i = 0; i < bombs; i++) {
        let random = Math.floor(Math.random() * nbCells);
        while (excludedCell.includes(random)) {
          random = Math.floor(Math.random() * nbCells);
        }
        const selectedCell = cells[random];
        let alreadyBomb = selectedCell.bomb;
        while (alreadyBomb === true) {
          const selectedCell = cells[Math.floor(Math.random() * nbCells)];
          alreadyBomb = selectedCell.bomb;
        }
        selectedCell.bomb = true;
      }
      // Grid creation
      for (let i = 0; i < size; i++) {
        const line = [];
        for (let j = 0; j < size; j++) {
          // Finding cell in list:
          line.push(cells.shift());
        }
        grid.push(line);
      }
      // Computing number of mines around cells
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const x = grid[i][j].x;
          const y = grid[i][j].y;
          let sum = 0;
          // ^ y
          //   +----+----+----+
          //   | NW | N  | NE |
          //   +----+----+----+
          //   | W  |    | E  |
          //   +----+----+----+
          //   | SW | S  | SE |
          //   +----+----+----+
          //                   >x
          // NW
          sum += x > 0 && y > 0 ? (grid[y - 1][x - 1].bomb ? 1 : 0) : 0;
          // N
          sum += y > 0 ? grid[y - 1][x].bomb : 0;
          // NE
          sum += x + 1 < size && y > 0 ? grid[y - 1][x + 1].bomb : 0;
          // W
          sum += x > 0 ? grid[y][x - 1].bomb : 0;
          // E
          sum += x + 1 < size ? grid[y][x + 1].bomb : 0;
          // SW
          sum += x > 0 && y + 1 < size ? grid[y + 1][x - 1].bomb : 0;
          // S
          sum += y + 1 < size ? grid[y + 1][x].bomb : 0;
          // SE
          sum += x + 1 < size && y + 1 < size ? grid[y + 1][x + 1].bomb : 0;
          grid[i][j].bombsAround = sum;
        }
      }
      // Initializ game vars

      this.bombs = bombs;
      this.flags = bombs;
      this.grid = grid;
      this.trigger(grid[firstCell.y][firstCell.x]);
    },
    /**
     * Triggered on a simple click
     * @param cell
     */
    flag(cell) {
      if (!cell.flagged && this.flagsSet < this.flags && !cell.revealed) {
        cell.flagged = true;
      } else if (cell.flagged) {
        cell.flagged = false;
      }
      this.testWin();
    },
    /**
     * Checks if the game should end
     */
    testWin() {
      if (this.left - this.flagsSet === 0) {
        this.end(true);
      }
    },
    /**
     * Triggered on a click
     * @param cell
     */
    trigger(cell) {
      
      if (this.firstClick) {
        this.firstClick = false;
        this.start(cell);
      } else {
        if(this.isMobile() && this.mobileAction == 2) {
          this.flag(cell)
          return
        }
        cell.flagged = false;
        cell.triggered = true;
        cell.revealed = true;
        if (cell.bomb) {
          cell.exploded = true;
          this.end(false);
          this.lost = true;
        } else if (cell.bombsAround === 0) {
          this.reveal(cell);
        }
        this.testWin();
      }
    },
    /**
     * Computes the cell content depending on the state
     * @param cell
     * @returns {String}
     */
    cellContent(cell) {
      return cell.revealed && !cell.bomb && cell.bombsAround > 0
        ? cell.bombsAround
        : "";
    },
    /**
     * Uncover blank cells
     * @param startingCell
     * @param previousCellBombCount
     */
    reveal(startingCell, previousCellBombCount = 0) {
      if (previousCellBombCount === 0) {
        // Current cell position
        const x = startingCell.x;
        const y = startingCell.y;
        // Testing north cell:
        const cells = [
          y - 1 >= 0 ? this.grid[y - 1][x] : null, // North
          y + 1 < this.size ? this.grid[y + 1][x] : null, // South
          x + 1 < this.size ? this.grid[y][x + 1] : null, // East
          x - 1 >= 0 ? this.grid[y][x - 1] : null, // West
          x - 1 >= 0 && y - 1 >= 0 ? this.grid[y - 1][x - 1] : null, // North-West
          x + 1 < this.size && y - 1 >= 0 ? this.grid[y - 1][x + 1] : null, // North-East
          x - 1 >= 0 && y + 1 < this.size ? this.grid[y + 1][x - 1] : null, // South-West
          x + 1 < this.size && y + 1 < this.size
            ? this.grid[y + 1][x + 1]
            : null, // South-East
        ];
        for (const c in cells) {
          const cell = cells[c];
          if (cell && !cell.revealed && !cell.bomb && !cell.flagged) {
            cell.revealed = true;
            // Running north
            this.reveal(cell, cell.bombsAround);
          }
        }
      }
    },
    /**
     * Determines cell classes
     * @param cell
     * @returns {{nobomb: boolean, flagged: boolean|computed.gameOver, bomb: boolean, notFoundBomb: boolean|*, exploded: boolean}}
     */
    cellClass(cell) {
      const debugString = `x-${cell.x}--y-${cell.y}--bomb-${cell.bomb}--revealed-${cell.revealed}--bombsaround-${cell.bombsAround}`;
      const classes = {
        // Discovered, safe cell
        nobomb: cell.revealed && !cell.bomb,
        // Undiscovered, Flagged cell
        flagged: cell.flagged && (!cell.revealed || this.gameOver),
        // Bomb cell, when the game is over
        bomb: cell.bomb && this.lost && cell.triggered && cell.exploded,
        // Visible cell: when the game is over
        notFoundBomb: cell.bomb && cell.revealed && !cell.exploded && this.lost,
        // visible: this.running && (this.lost || this.won),
        exploded: cell.exploded,
      };
      if (cell.revealed && cell.bombsAround > 0) {
        classes[`has-${cell.bombsAround}-bombs-around`] = true;
      }
      classes[debugString] = this.debug;
      return classes;
    },
    /**
     * Ends the game
     * @param status
     */
    end(status) {
      clearInterval(this.timeInterval);
      if (status && !this.lost) {
        this.won = true;
      } else {
        this.lost = true;
      }
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          this.grid[j][i].revealed = true;
          // this.grid[j][i].flagged = false
        }
      }
    },
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    }
  },
};
</script>