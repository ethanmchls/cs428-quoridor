import React, { useEffect, useState } from 'react';
import { Player } from './player';
import { GameGrid } from './GameGrid.js';
import { Footer } from './footer';
import { Header, PATH } from './header.js';
import { offNewGameData, offPlayerError, onNewGameData, onPlayerError } from './socket/socketApi';

export const GameScreen = () => {

  // All possible wall positions. Used for highlighting available wall placements
  const allWalls = Array.from(new Set([
    "1-0", "1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8", "1-9", "1-10", "1-11", "1-12", "1-13", "1-14", "1-15", "1-16",
    "3-0", "3-1", "3-2", "3-3", "3-4", "3-5", "3-6", "3-7", "3-8", "3-9", "3-10", "3-11", "3-12", "3-13", "3-14", "3-15", "3-16",
    "5-0", "5-1", "5-2", "5-3", "5-4", "5-5", "5-6", "5-7", "5-8", "5-9", "5-10", "5-11", "5-12", "5-13", "5-14", "5-15", "5-16",
    "7-0", "7-1", "7-2", "7-3", "7-4", "7-5", "7-6", "7-7", "7-8", "7-9", "7-10", "7-11", "7-12", "7-13", "7-14", "7-15", "7-16",
    "9-0", "9-1", "9-2", "9-3", "9-4", "9-5", "9-6", "9-7", "9-8", "9-9", "9-10", "9-11", "9-12", "9-13", "9-14", "9-15", "9-16",
    "11-0", "11-1", "11-2", "11-3", "11-4", "11-5", "11-6", "11-7", "11-8", "11-9", "11-10", "11-11", "11-12", "11-13", "11-14", "11-15", "11-16",
    "13-0", "13-1", "13-2", "13-3", "13-4", "13-5", "13-6", "13-7", "13-8", "13-9", "13-1f0", "13-11", "13-12", "13-13", "13-14", "13-15", "13-16",
    "15-0", "15-1", "15-2", "15-3", "15-4", "15-5", "15-6", "15-7", "15-8", "15-9", "15-10", "15-11", "15-12", "15-13", "15-14", "15-15", "15-16",
    "0-1", "1-2", "0-3", "1-3", "3-3", "0-5", "1-5", "3-5", "0-7", "1-7", "3-7", "0-9", "1-9", "3-9", "0-11", "1-11", "3-11", "0-13", "1-13", "3-13", "0-15", "1-15", "3-15",
    "2-1", "3-2", "2-3", "3-3", "3-4", "2-5", "3-5", "3-6", "2-7", "3-7", "3-8", "2-9", "3-9", "3-10", "2-11", "3-11", "3-12", "2-13", "3-13", "3-14", "2-15", "3-15", "3-16",
    "4-1", "5-2", "4-3", "5-3", "5-4", "4-5", "5-5", "5-6", "4-7", "5-7", "5-8", "4-9", "5-9", "5-10", "4-11", "5-11", "5-12", "4-13", "5-13", "5-14", "4-15", "5-15", "5-16",
    "6-1", "7-2", "6-3", "7-3", "7-4", "6-5", "7-5", "7-6", "6-7", "7-7", "7-8", "6-9", "7-9", "7-10", "6-11", "7-11", "7-12", "6-13", "7-13", "7-14", "6-15", "7-15", "7-16",
    "8-1", "9-2", "8-3", "9-3", "9-4", "8-5", "9-5", "9-6", "8-7", "9-7", "9-8", "8-9", "9-9", "9-10", "8-11", "9-11", "9-12", "8-13", "9-13", "9-14", "8-15", "9-15", "9-16",
    "10-1", "11-2", "10-3", "11-3", "11-4", "10-5", "11-5", "11-6", "10-7", "11-7", "11-8", "10-9", "11-9", "11-10", "10-11", "11-11", "11-12", "10-13", "11-13", "11-14", "10-15", "11-15", "11-16",
    "12-1", "13-2", "12-3", "13-3", "13-4", "12-5", "13-5", "13-6", "12-7", "13-7", "13-8", "12-9", "13-9", "13-10", "12-11", "13-11", "13-12", "12-13", "13-13", "13-14", "12-15", "13-15", "13-16",
    "14-1", "15-2", "14-3", "15-3", "15-4", "14-5", "15-5", "15-6", "14-7", "15-7", "15-8", "14-9", "15-9", "15-10", "14-11", "15-11", "15-12", "14-13", "15-13", "15-14", "14-15", "15-15", "15-16",
    "16-1", "16-2", "16-3", "16-4", "16-5", "16-6", "16-7", "16-8", "16-9", "16-10", "16-11", "16-12", "16-13", "16-14", "16-15"
  ]));

  const [player1, setPlayer1] = useState(new Player(1, [0, 8], 10));
  const [player2, setPlayer2] = useState(new Player(2, [16, 8], 10));
  const [walls, setWalls] = useState([]);
  const [placeableWalls, setPlaceableWalls] = useState(allWalls);
  const [errorText, setErrorText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const updatePlayer1 = (player) => {
    setPlayer1(player);
  }
  const updatePlayer2 = (player) => {
    setPlayer2(player);
  }
  const updatePlaceableWalls = (wall) => {
    // var tmp = placeableWalls;
    // tmp.splice(wall, 1);
    // setPlaceableWalls(tmp);
    setPlaceableWalls((prevPlaceableWalls) => prevPlaceableWalls.filter((_, i) => i !== wall));
  }

  useEffect(() => {
    if (errorText) {
      setShowToast(true);
      // Hide the toast after 5 seconds
      const timeout = setTimeout(() => {
        setShowToast(false);
        setErrorText(""); // Clear the error text
      }, 5000);

      // Cleanup function to clear the timeout if component unmounts or error changes
      return () => clearTimeout(timeout);
    }
  }, [errorText]);

  useEffect(() => {
    const handleNewGameData = (data) => {
      console.log("Got new data: ", data);
      setWalls(data.walls.map((wall) => `${wall.r}-${wall.c}`));

      setPlayer1((prevPlayer) => {
        prevPlayer.nWalls = data.numWalls[0];
        prevPlayer.pawnPos = [data.pawns[0].r, data.pawns[0].c];
        return prevPlayer;
      });

      setPlayer2((prevPlayer) => {
        prevPlayer.nWalls = data.numWalls[1];
        prevPlayer.pawnPos = [data.pawns[1].r, data.pawns[1].c];
        return prevPlayer;
      });
    }

    const handlePlayerError = (error) => {
      setErrorText(error);
    }

    onNewGameData(handleNewGameData);
    onPlayerError(handlePlayerError);

    return () => {
      offNewGameData(handleNewGameData);
      offPlayerError(handlePlayerError);
    }
  }, []);

  return (
    <div className='bg-base-100 h-screen flex flex-col'>
      <Header currentPath={PATH.GAME} /> 
      <GameGrid
        player1={player1}
        updatePlayer1={updatePlayer1}
        player2={player2}
        updatePlayer2={updatePlayer2}
        walls={walls}
        placeableWalls={placeableWalls}
        updatePlaceableWalls={updatePlaceableWalls}
      />
      {/* <div className='error-text'>{errorText}</div> */}
      {showToast && (
        <div className="toast toast-start mb-12">
          <div className="alert alert-error">
            <span>{errorText}</span>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
