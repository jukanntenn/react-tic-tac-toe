import React from "react";

export type SquareValue = null | "X" | "O";
type Location = { col: number | null; row: number | null };
type History = { squares: SquareValue[]; location: Location }[];

function Square(props: {
  highlight: boolean;
  onClick: () => void;
  value: SquareValue;
}) {
  return (
    <button
      className={props.highlight ? "square highlight" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component<{
  squares: SquareValue[];
  line: [number, number, number];
  onClick: (i: number) => void;
}> {
  renderSquare(i: number) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        highlight={this.props.line.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(i * 3 + j));
      }
      rows.push(
        <div key={i} className="board-row">
          {squares}
        </div>
      );
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component<
  {},
  {
    history: History;
    stepNumber: number;
    xIsNext: boolean;
    ascending: boolean;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [
        { squares: Array(9).fill(null), location: { col: null, row: null } },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const col = (i % 3) + 1;
    const row = Math.floor(i / 3) + 1;
    this.setState({
      history: history.concat([
        { squares: squares, location: { col: col, row: row } },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  toggleOrdering() {
    this.setState({ ascending: !this.state.ascending });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " ( " +
          step.location.col +
          ", " +
          step.location.row +
          " )"
        : "Go to game start";
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? "selected" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status: string;
    let line: [number, number, number] = [-1, -1, -1];
    if (winner) {
      status = "Winner: " + winner.player;
      line = winner.line;
    } else {
      if (this.state.stepNumber < 9) {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      } else {
        status = "No one wins. The result is a draw!";
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            line={line}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            Order:{" "}
            <button onClick={() => this.toggleOrdering()}>
              {this.state.ascending ? "ascending" : "descending"}
            </button>
          </div>
          <ol>{this.state.ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(
  squares: SquareValue[]
): null | { player: SquareValue; line: [number, number, number] } {
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
      return { player: squares[a], line: lines[i] as [number, number, number] };
    }
  }
  return null;
}

export { Square, Board, Game, calculateWinner };
