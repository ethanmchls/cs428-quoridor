import React, { useState, useEffect } from 'react';
import { onConnectedPlayersChanged, offConnectedPlayersChanged, joinLobby, onGameStarted, offGameStarted } from './socket/socketApi'; // replace with the correct path
import quoridorPawn from './chess-piece.svg';
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from './footer.js';
import { Header, PATH } from './header.js';

export const Lobby = memo(() => {
  return (
    <div className="flex flex-col h-screen">
      <Header currentPath={PATH.HOME} />
      <div className="flex-grow">
        <div className="flex flex-row w-3/4 mx-auto my-8 h-full">
          <div className="flex-col w-2/3 mr-4">
            <h1 className="text-3xl">Quoridor</h1>
            <p>Quoridor is a strategy game that is easy to learn and fun to play. The goal of the game is to move your pawn to the other side of the board. You can also place walls to block your opponent's path. The first player to reach the other side wins!</p>
            <h2 className="text-2xl">How to Play</h2>
            <p>Players take turns moving their pawns or placing walls. You can move your pawn one space in any direction (up, down, left, or right). You can also place a wall to block your opponent's path. The first player to reach the other side wins!</p>
            <h2 className="text-2xl">Rules</h2>
            <p>Walls can be placed anywhere on the board, but they cannot overlap. Pawns cannot move through walls. Players cannot jump over walls. The first player to reach the other side wins!</p>
          </div>
          <LobbyBox gamesInProgress={3} playersWaiting={3}/>
        </div>
      </div>
      <Footer />
    </div>
  );
});

const LobbyBox = memo(({gamesInProgress, playersWaiting}) => {
  const [connectedPlayers, setConnectedPlayers] = useState(playersWaiting);
  const [buttonText, setButtonText] = useState("Start Game");
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

  const handleJoinLobbyClicked = () => {
    joinLobby(); 
    setButtonText("Waiting on another player");
    // TODO: Add loading screen or something
  }

  return (
    <div className="h-fit p-8 flex flex-col border-2 border-primary mt-2 rounded-box bg-base-200">
      <h2>Lobby</h2>
      <p>{gamesInProgress} games in progress</p>
      <div className="flex flex-row mb-4">
        <p>{connectedPlayers} players waiting for a game</p>
        {Array.from({ length: connectedPlayers }, (_, index) => (
          <img key={index} src={quoridorPawn} alt="pawn" className="h-6"/>
          ))}
      </div>
      <Link to="/game"><button className="btn btn-secondary" onClick={handleJoinLobbyClicked}>Start Game</button></Link>
    </div>
  );
});