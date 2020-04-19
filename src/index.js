import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={'square ' + (props.isBingo ? 'bingo' : '')}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isBingo) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isBingo={isBingo}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  rendorRows(r, line) {
    return (
      [0, 1, 2].map((c) => {
        const index = r * 3 + c;
        return this.renderSquare(index, line.includes(index));
      })
    );
  }

  render() {
    const line = bingoLine(this.props.squares);
    const rows = [0, 1, 2].map((i) => {
      return (
        <div className="board-row" key={i}>
          {this.rendorRows(i, line)}
        </div>
      );
    });
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        latestIndex: null,
      }],
      isAsc: true,
      stepNumber: 0,
      xIsNext: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        latestIndex: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const ascMoves = () => {
      return history.map((step, move) => {
        const row = Math.floor(step.latestIndex / 3 + 1);
        const col = step.latestIndex % 3 + 1;
        const position = move ? `(${col},${row})` : '';
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        const className = this.state.stepNumber === move ? 'current-step' : ''
        return (
          <li key={move} className={className}>
            {position}
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
    }
    const moves = this.state.isAsc ? ascMoves() : ascMoves().reverse();

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const revertButton = <button onClick={() => { this.setState({ isAsc: !this.state.isAsc }) }}>revert history</button>;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{revertButton}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function bingoLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return [];
}

function calculateWinner(squares) {
  const line = bingoLine(squares);
  return line.length === 0 ? null : line[0];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
