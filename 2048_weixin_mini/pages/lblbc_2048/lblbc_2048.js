Page({
  data: {
    cellArr: [],
    isGameOver: false
  },
  onLoad: function () {
    this.startGame()
  },
  startGame() {
    this.setData({
      isGameOver: false,
      cellArr: Array.from(Array(4)).map(() => Array(4).fill(0)),
    })
    this.fillOneEmptyCell()
    this.fillOneEmptyCell()
  },
  //找到可以用于生成新数字的单元格，并生成新的数字进行填充
  fillOneEmptyCell() {
    let cellIndex = this.findOneEmptyCell()
    if (cellIndex != -1) {
      let row = Math.floor(cellIndex / 4)
      let col = cellIndex % 4
      let cellArr = this.data.cellArr
      cellArr[row][col] = this.getRandomValue()
      this.setData({
        cellArr: cellArr
      })
    }
  },
  //生成新的数字，90%几率生成2，10%几率生成4
  getRandomValue() {
    return this.random(1) < 0.9 ? 2 : 4
  },
  //生成随机数，0=<结果<max
  random(max) {
    return Math.floor(Math.random() * max)
  },
  //找到可以用于生成新数字的单元格
  findOneEmptyCell() {
    let cells = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.data.cellArr[i][j] == 0) {
          cells.push(i * 4 + j)
        }
      }
    }
    if (cells.length) {
      return cells[this.random(cells.length)]
    } else {
      return -1
    }
  },
  /*
   判断是否还可以移动。
   1、当前单元格是否为0；
   2、当前单元格和右侧单元格是否相等；
   3、当前单元格和下方单元格是否相等。
   */
  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let cell = this.data.cellArr[i][j]
        if (cell) {
          //和右侧单元格比较，是否相等
          if (j < 3 && this.data.cellArr[i][j] == this.data.cellArr[i][j + 1]) {
            return true
          }
          //和下方单元格比较，是否相等
          if (i < 3 && this.data.cellArr[i][j] == this.data.cellArr[i + 1][j]) {
            return true
          }
        } else {
          return true
        }
      }
    }
    return false
  },
  /**
   * 将单元格数向左或向右移动，移除空字符串并对相邻相同数进行叠加
   * toLeft表示是否是向左
   */
  horizontalMoveCells(toLeft) {
    for (let i = 0; i < 4; i++) {
      let newArr = Array(4).fill(0)
      for (let j = 0; j < 4; j++) {
        newArr[j] = this.data.cellArr[i][j]
      }
      let resultArr = this.removeZerosAndAdd(newArr, toLeft)
      for (let j = 0; j < 4; j++) {
        this.data.cellArr[i][j] = resultArr[j]
      }
    }
  },
  /**
   * 将单元格数向下或向上移动，移除空字符串并对相邻相同数进行叠加
   * toUp表示是否是向上
   */
  verticalMoveCells(toUp) {
    for (let i = 0; i < 4; i++) {
      let newArr = Array(4).fill(0)
      for (let j = 0; j < 4; j++) {
        newArr[j] = this.data.cellArr[j][i]
      }
      let resultArr = this.removeZerosAndAdd(newArr, toUp)
      for (let j = 0; j < 4; j++) {
        this.data.cellArr[j][i] = resultArr[j]
      }
    }
  },
  /**
   * 1、去掉数组中的空字符串，向头或向尾压缩数组。
   * 空字符串,4,空字符串,4向左压缩变成：4,4,空字符串,空字符串. 向右压缩变成：空字符串,空字符串,4,4
   * 2、相邻的数如果相同，则进行相加运算。
   * 4,4,空字符串,空字符串向左叠加变成：8,空字符串,空字符串,空字符串. 向右叠加变成：空字符串,空字符串,空字符串,8
   * toHead表示是否是头压缩
   */
  removeZerosAndAdd(arr, toHead) {
    let newArr = Array(4).fill(0)
    let arrWithoutZero = arr.filter((x) => x !== 0) //去掉所有的空字符串
    if (arrWithoutZero.length == 0) {
      return newArr
    }
    if (toHead) {
      for (let i = 0; i < arrWithoutZero.length; i++) {
        newArr[i] = arrWithoutZero[i]
      }
      //对相邻相同的数进行叠加
      for (let i = 0; i < newArr.length - 1; i++) {
        if (newArr[3 - i] === newArr[2 - i] && newArr[3 - i] !== 0) {
          newArr[3 - i] = 0
          newArr[2 - i] *= 2
        }
      }
    } else {
      for (let i = 0; i < arrWithoutZero.length; i++) {
        newArr[newArr.length - i - 1] =
          arrWithoutZero[arrWithoutZero.length - i - 1]
      }

      //对相邻相同的数进行叠加
      for (let i = 0; i < newArr.length - 1; i++) {
        if (newArr[i] === newArr[i + 1] && newArr[i] !== 0) {
          newArr[i] = 0
          newArr[i + 1] *= 2
        }
      }
    }

    return newArr
  },
  //键盘监听事件
  keyDown(e) {
    let arr = null
    switch (e.keyCode) {
      case 38: //上
        this.moveUp()
        break
      case 40: //下
        this.moveDown()
        break
      case 37: //左
        this.moveLeft()
        break
      case 39: //右
        this.moveRight()
        break
    }
  },
  moveUp() {
    this.verticalMoveCells(true)
    this.checkGameOverOrContinue()
  },
  moveDown() {
    this.verticalMoveCells(false)
    this.checkGameOverOrContinue()
  },
  moveLeft() {
    this.horizontalMoveCells(true)
    this.checkGameOverOrContinue()
  },
  moveRight() {
    this.horizontalMoveCells(false)
    this.checkGameOverOrContinue()
  },
  checkGameOverOrContinue() {
    if (this.canMove()) {
      this.fillOneEmptyCell()
    } else {
      this.setData({
        isGameOver: true
      })
    }
  },

  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function (ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function (ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function () {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
      var direction = absdisX > absdisY ? (disX < 0 ? "right" : "left") : (disY < 0 ? "down" : "up")
      if (direction == "up") {
        this.moveUp()
      } else if (direction == "down") {
        this.moveDown()
      } else if (direction == "left") {
        this.moveLeft()
      } else if (direction == "right") {
        this.moveRight()
      }
    }
  },

})