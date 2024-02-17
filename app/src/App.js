import logo from './logo.svg';
import './App.css';
import { socket } from './socket';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {/* Test... */}
        <button onClick={ () => socket.emit('test', 'hello world')}>Send test</button>

      </header>
    </div>
  );
}

export default App;