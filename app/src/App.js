// import logo from './logo.svg';
import './App.css';
// import { socket } from './socket';
import GameGrid from './GameGrid';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={ () => socket.emit('test', 'hello world')}>Send test</button>

      </header> */}

      {/* The code below loads the game grid. This should eventually be put into its own view once the router is set up */}
      <GameGrid pawn1Pos={[0, 8]} pawn2Pos={[16, 8]} />
    </div>
  );
}

export default App;