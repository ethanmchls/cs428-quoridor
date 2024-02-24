import React, { useState, useEffect } from 'react';
import { onConnectedPlayersChanged, offConnectedPlayersChanged } from './socket/socketApi'; // replace with the correct path

export default function Lobby () {
  const [connectedPlayers, setConnectedPlayers] = useState(0);

  useEffect(() => {
    // Define the callback function to update the state when the number of connected players changes
    const handleConnectedPlayersChange = (numberOfPlayers) => {
      setConnectedPlayers(numberOfPlayers);
    };

    // Set up the listener when the component mounts
    onConnectedPlayersChanged(handleConnectedPlayersChange);

    // Clean up the listener when the component unmounts
    return () => {
      offConnectedPlayersChanged(handleConnectedPlayersChange);
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div>
      <h2>Connected Players: {connectedPlayers}</h2>
    </div>
  );
};