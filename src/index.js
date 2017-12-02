import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Los componentes que constan solo de una funcion 'render()'
   pueden simplificarse escribiendolos como componentes funcionales
   reemplasando la definicion de la clase que extiende de React.Component
   por la definicion de una funcion que recibe props y devuelve qué renderizar.
*/
// class Square extends React.Component {
//   render () {
//     return (
//       <button className="square" onClick={ () => this.props.onClick() } >
//         { this.props.value }
//       </button>
//     );
//   }
// }

/* componente funcional que simplifica al de arriba. */
function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor (props) {
    super(props);
    /* representamos el estado inicial con un objeto literal. */
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    // slice copia un subset del array. sin argumentos copia todo el array .
    const squares = this.state.squares.slice();

    // si ya hay un ganador o ya llene todos los cuadrados, salgo
    if (calculateWinner(this.state.squares) || squares[i]) {
      return;
    }
    // lo modifico.
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // piso todo el array.
    this.setState({ 
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square 
        value={ this.state.squares[i] }
        onClick={ () => this.handleClick(i) }
    />);
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;

    if (winner) {
      status = 'Winner is: ' + winner; 
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
    /*Wooow declaro una variale con la forma del vector en lines[i]!!*/
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      /* indico el ganador devolviendo la X o la O en esa posicion. */
      return squares[a];
    }
  }

  /* no hay ganador */
  return null;
}