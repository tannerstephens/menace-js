export default class Menace {
  constructor() {
    this.boardStates = {};
    this.turns = [];
  }

  save() {
    return JSON.stringify(
      this.boardStates
    );
  }

  static load(json) {
    const newMenace = new Menace();

    newMenace.boardStates = JSON.parse(json);

    if(newMenace.boardStates == null) {
      newMenace.boardStates = {};
    }

    return newMenace;
  }

  /**
   *
   * @param {string} boardState
   * @param {boolean} isXTurn
   */
  takeTurn(boardState) {
    if(!(boardState in this.boardStates)) {
      this.boardStates[boardState] = this._generateFreshBoardState(boardState);
    }

    const boardStateSize = this.boardStates[boardState].reduce((prev, cur) => prev + cur, 0);

    let move = Math.floor(Math.random() * boardStateSize);

    for(let i = 0; i < 9; i++) {
      move -= this.boardStates[boardState][i];

      if(move < 0) {
        this.turns.push({
          boardState,
          move: i
        });
        return i;
      }
    }
  }

  restart(winOrDraw, train=true) {
    if(train) {
      this.turns.forEach(turn => {
        this.boardStates[turn.boardState][turn.move] += winOrDraw ? 3 : -1;
        this.boardStates[turn.boardState][turn.move] = Math.max(this.boardStates[turn.boardState][turn.move], 0);

        if(this.boardStates[turn.boardState].reduce((prev, cur) => prev + cur, 0) == 0) {
          this.boardStates[turn.boardState] = this._generateFreshBoardState(turn.boardState);
        }
      });
    }

    this.turns = [];
  }

  /**
   *
   * @param {string} boardState
   */
  _generateFreshBoardState(boardState) {
    return boardState.split('').map((cur) => cur == ' ' ? 5 : 0);
  }
}
