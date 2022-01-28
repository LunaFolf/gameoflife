const GridCell = require('./GridCell.js')

// Class for a 2D grid of cells.
module.exports = class Grid {
  _frameHistory = []
  _cells = []
  _width = 0
  _height = 0
  _survivalRate = 0.5
  _stepsTaken = 0

  constructor(width, height) {
    this.setSize(width, height)
    this.generateStartingLife()
  }

  get width () {
    return this._width
  }

  get height () {
    return this._height
  }

  get cells () {
    return this._cells
  }

  get steps () {
    return this._stepsTaken
  }

  get frameHistory () {
    return this._frameHistory
  }

  pushToFrameHistory() {
    this._stepsTaken++
    this._frameHistory.push(this._cells)
    if (this._frameHistory.length > 3) {
      this._frameHistory.shift()
    }
  }

  get survivalRate () {
    return this._survivalRate
  }

  set survivalRate (value) {
    this._survivalRate = value
  }

  setSize(width, height) {
    this._width = width
    this._height = height
    this._cells = []
    for (let x = 0; x < width; x++) {
      this._cells[x] = []
      for (let y = 0; y < height; y++) {
        this._cells[x][y] = new GridCell(x, y)
      }
    }
  }

  getCell(x, y) {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
      return null
    }
    return this._cells[x][y]
  }

  setCell(x, y, alive) {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
      return
    }
    this._cells[x][y].alive = alive
  }

  get frame () {
    let frame = ""
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        // frame += this._cells[x][y].alive ? "■" : "☐"
        frame += this._cells[x][y].alive ? "•".green : "•".black
      }
      frame += "\n"
    }
    return frame
  }

  clearCells() {
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        this.setCell(x, y, false)
      }
    }
  }

  reset () {
    this._frameHistory = []
    this.clearCells()
    this._stepsTaken = 0
  }

  generateStartingLife() {
    const startingLife = []

    this.reset()
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (Math.random() > (1 - this._survivalRate)) {
          startingLife.push([x, y])
        }
      }
    }
    startingLife.forEach(life => {
      const [x, y] = life
      this.setCell(x, y, true)
    })

    this.pushToFrameHistory()
  }

  getNeighbors(x, y) {
    const neighbors = []
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        if (xOffset === 0 && yOffset === 0) continue
        else {
          const cell = this.getCell(x + xOffset, y + yOffset)
          if (cell) neighbors.push(cell)
        }
      }
    }
    return neighbors
  }

  step () {
    const nextCells = []
    for (let x = 0; x < this._width; x++) {
      nextCells[x] = []
      for (let y = 0; y < this._height; y++) {
        const neighbors = this.getNeighbors(x, y)
        const aliveNeighbors = neighbors.filter(cell => cell.alive).length
        const cell = this.getCell(x, y)
        if (cell.alive) {
          if (aliveNeighbors < 2 || aliveNeighbors > 3) {
            nextCells[x][y] = new GridCell(x, y)
          } else {
            nextCells[x][y] = new GridCell(x, y, true)
          }
        } else {
          if (aliveNeighbors === 3) {
            nextCells[x][y] = new GridCell(x, y, true)
          } else {
            nextCells[x][y] = new GridCell(x, y)
          }
        }
      }
    }
    this._cells = nextCells
    this.pushToFrameHistory()
  }

  // check if grid is stable by comparing the current frame to the last frame.
  checkIfGridIsStable() {
    if (this._frameHistory.length < 2) return true
    const currentFrame = this._cells
      .map(row => row.map(cell => cell.alive ? 1 : 0))
      .join('')
    const lastFrame = this._frameHistory[this._frameHistory.length - 2]
      .map(row => row.map(cell => cell.alive ? 1 : 0))
      .join('')
    const firstFrame = this._frameHistory[0]
      .map(row => row.map(cell => cell.alive ? 1 : 0))
      .join('')

    if (currentFrame === lastFrame) return false
    if (currentFrame === firstFrame) return false
    return true
  }

  get stable () {
    return this.checkIfGridIsStable()
  }

}