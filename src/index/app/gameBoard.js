import React from 'react';

import Square from './gameBoard/square';
import Button from './gameBoard/button';
import Menace from './gameBoard/menace';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(9).fill(null)
    };

    this.menace = Menace.load(localStorage.getItem('menace'));
  }

  _stringBoardState(state) {
    return state.reduce((prev, cur) => {
      if(cur == null) {
        prev += ' ';
      } else {
        prev += cur;
      }

      return prev
    }, '');
  }

  renderRestartButton() {
    return (
      <Button
        value={'Play Again!'}
        onClick={() => {
          const winner = this.detectWinner();
          const boardFull = this.boardIsFull();

          const oWins = winner == 'O';
          const draw = (winner == null) && boardFull;


          const winOrDraw = oWins || draw;
          const train = (winner != null) || boardFull;

          this.menace.restart(winOrDraw, train);
          localStorage.setItem('menace', this.menace.save());

          this.setState({
            squares: Array(9).fill(null)
          }, () => {
            this._firstTurn();
          });
        }}
      />
    );
  }

  _firstTurn() {
    const newSquares = [...this.state.squares];

    const menaceTurn = this.menace.takeTurn(this._stringBoardState(newSquares));

    newSquares[menaceTurn] = 'O';

    this.setState({
      squares: newSquares
    });
  }

  componentDidMount() {
    this._firstTurn();
  }

  detectWinner() {
    const possibleWins = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

    const squares = this.state.squares;

    for(const possibleWin of possibleWins) {
      const [a,b,c] = possibleWin;

      if(squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
        return squares[a];
      }
    }

    return null;
  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      onClick={() => {
        if(this.state.squares[i] == null && this.detectWinner() == null) {
          const newSquares = [...this.state.squares];
          newSquares[i] = 'X';

          this.setState({
            squares: newSquares
          }, () => {
            if(this.detectWinner() == null && !this.boardIsFull()) {
              const newSquares = [...this.state.squares];
              const menaceTurn = this.menace.takeTurn(this._stringBoardState(newSquares));
              newSquares[menaceTurn] = 'O';

              this.setState({
                squares: newSquares
              });
            }
          });
        }
      }}
    />
  }

  boardIsFull() {
    return this.state.squares.filter(s => s == null).length == 0;
  }

  getStatus() {
    const winner = this.detectWinner();

    if(winner) {
      return "Winner: " + winner;
    } else if(this.boardIsFull()) {
      return 'Draw!';
    }
    return `Your turn`
  }

  render() {
    return (
      <div className='game'>
        <div className='gameBoard'>
          <div className='board-row'>
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className='board-row'>
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className='board-row'>
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        <div className='game-info'>{this.getStatus()}</div>
        <div className='restart-button'>{this.renderRestartButton()}</div>
      </div>
    );
  }
}

export default GameBoard;
