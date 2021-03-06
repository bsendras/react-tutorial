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
  /* movemos el constructor a Game.
  constructor (props) {
    super(props);
    // representamos el estado inicial con un objeto literal.
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
  */
  
  renderSquare(i) {
    return (
      <Square 
        value={ this.props.squares[i] }
        onClick={ () => this.props.onClick(i) }
    />);
  }

  render() {
    return (
      <div>
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
  /* volvemos a subir un nivel la gestion del estado */
  /* asique añadimos un constructor al componente de mas alto nivel */
  constructor (props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null) 
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // leemos el historial y lo copiamos desde el inicio hasta el ultimo estado en el que estamos.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // slice copia un subset del array. sin argumentos copia todo el array .
    const squares = current.squares.slice();

    // si ya hay un ganador o ya llene todos los cuadrados, salgo
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // lo modifico.
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // piso todo el array.
    this.setState({ 
        history: history.concat({
        squares: squares,
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

        return (
          /* al renderizar componentes de lista es nescesario añadir un key a cada iten
           ya que react unsa este identificador unico entre los items (no es necesario que sea globalmente unico)
           para actualizar selectivanmete cada item, mas aun en los casos en los que se insertan/mueven
           items en diferentes posiciones que no son el final de la lista. */
          <li key={ move }>
            <button onClick={ () => this.jumpTo(move) }>
              {desc}
            </button>
          </li>
        );
    });

    let status;    
    if (winner) {
      status = 'Winner is: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
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