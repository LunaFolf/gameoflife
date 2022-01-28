const colors = require('colors')
const Grid = require('./Grid.js')

console.clear()

const history = []

const options = {
  restartOnUnstable: true
}

let generation = 0
const grid = new Grid(process.stdout.columns, process.stdout.rows - 5)

let interval

function startGame () {
  generation++
  setInterval(() => {
    console.clear()
    console.log(`Generation: ${Number(generation).toLocaleString()}`)
    console.log(`Steps: ${Number(grid.steps).toLocaleString()}`)
    console.log(`Survival Rate: ${Number(grid.survivalRate).toLocaleString()}`)
    console.log(`Stable ${grid.stable ? '✓'.green : '✗'.red}`)
    console.log(grid.frame)

    // check if grid is stable
    if (!grid.stable) {
      // console.log("Grid is not stable".red)
      history.push({
        generation,
        frames: grid.frameHistory,
        steps: grid.steps
      })
      restartOrQuit()
    } else {
      grid.step()
    }
  }, 154 / 10)
}

function restartOrQuit () {
  clearInterval(interval)

  if (options.restartOnUnstable) {
    grid.survivalRate = Math.random()
    grid.generateStartingLife()
    startGame()
  }
}

startGame()