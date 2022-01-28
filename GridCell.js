// Class for a singular cell in the grid.
module.exports = class GridCell {
  _position = {
    x: 0,
    y: 0
  }
  _alive = false

  constructor(x, y, alive) {
    this.setPosition(x, y)
    if (alive !== undefined) {
      this.alive = alive
    }
  }

  get position () {
    return this._position
  }

  get alive () {
    return this._alive
  }

  set alive (value) {
    this._alive = !!value
  }

  setPosition(x, y) {
    this._position.x = x
    this._position.y = y
  }
}