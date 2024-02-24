// import logo from './logo.svg';
import './App.css';
// import { socket } from './socket';
import GameGrid from './GameGrid';
import Lobby from './Lobby';

function App() {
  var pawn1 = [0, 8];
  var pawn2 = [16, 8];
  var walls = ["1-0", "1-1", "1-2", "10-7", "11-7", "12-7"];
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={ () => socket.emit('test', 'hello world')}>Send test</button>

      </header> */}

      {/* The code below loads the game grid. This should eventually be put into its own view once the router is set up.
      Currently I'm handling pawn and wall placements by just giving it coordinates as pawn positions and arrays of keys for walls. */}
      <Lobby />
      <GameGrid pawn1Pos={pawn1} pawn2Pos={pawn2} walls={walls} />
    </div>
  );
}

export default App;