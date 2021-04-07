import React from 'react';

import Square from './gameBoard/square';
import Restart from './gameBoard/restart';

class GameBoard extends React.Component {
  state = {
    squares: Array(9).fill(null),
    isXTurn: true
  }

  renderRestartButton() {
    return (
      <Restart
        onClick={() => {
          this.setState({
            squares: Array(9).fill(null),
            isXTurn: true
          });
        }}
      />
    );
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
          newSquares[i] = this.state.isXTurn ? 'X' : 'O';

          this.setState({
            squares: newSquares,
            isXTurn: !this.state.isXTurn
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
    return `${this.state.isXTurn ? 'X' : 'O'}'s turn`
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
