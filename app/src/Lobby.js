import React, { useState, useEffect } from 'react';
import { onConnectedPlayersChanged, offConnectedPlayersChanged, joinLobby, onGameStarted, offGameStarted } from './socket/socketApi'; // replace with the correct path
import quoridorPawn from './chess-piece.svg';
import { memo } from 'react';
import './Lobby.css';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import { Footer } from './footer.js';

export const Lobby = memo(() => {
  return (
    <div className={"App"}>
        <div className={'App-content'}>
          <div className={'game-description'}>
            <h1>Quoridor</h1>
            <p>Quoridor is a strategy game that is easy to learn and fun to play. The goal of the game is to move your pawn to the other side of the board. You can also place walls to block your opponent's path. The first player to reach the other side wins!</p>
            <h2>How to Play</h2>
            <p>Players take turns moving their pawns or placing walls. You can move your pawn one space in any direction (up, down, left, or right). You can also place a wall to block your opponent's path. The first player to reach the other side wins!</p>
            <h2>Rules</h2>
            <p>Walls can be placed anywhere on the board, but they cannot overlap. Pawns cannot move through walls. Players cannot jump over walls. The first player to reach the other side wins!</p>
          </div>
          <LobbyBox gamesInProgress={3} playersWaiting={3}/>
        </div>
        <Footer />
    </div>
  );
});

const LobbyBox = memo(({gamesInProgress, playersWaiting}) => {
  const [connectedPlayers, setConnectedPlayers] = useState(playersWaiting);
  const navigate = useNavigate();

  useEffect(() => {
    // Define the callback function to update the state when the number of connected players changes
    const handleConnectedPlayersChange = (numberOfPlayers) => {
      setConnectedPlayers(numberOfPlayers);
    };

    const handleReadyForGame = () => {
      navigate("/game");
    }

    // Set up the listener when the component mounts
    onConnectedPlayersChanged(handleConnectedPlayersChange);

    onGameStarted(handleReadyForGame);

    // Clean up the listener when the component unmounts
    return () => {
      offConnectedPlayersChanged(handleConnectedPlayersChange);
      offGameStarted(handleReadyForGame);
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div className={'lobby'}>
      <h2>Lobby</h2>
      <p>{gamesInProgress} games in progress</p>

      <div className={'lobby-line'}>
        <p>{connectedPlayers} players waiting for a game</p>
        {Array.from({ length: connectedPlayers }, (_, index) => (
            <img key={index} src={quoridorPawn} alt="pawn" className={'pawn'}/>
            ))}
      </div>
      <button className={'join-button'} onClick={() => joinLobby()}>Start Game</button>
    </div>
  );
});