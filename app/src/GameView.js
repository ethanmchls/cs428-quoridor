import React, { useEffect, useState } from 'react';
import Pawn from './Pawn';
import WallStack from './WallStack';
import { Footer } from './footer';
import { makeMove, offNewGameData, offPlayerError, onNewGameData, onPlayerError } from './socket/socketApi';
import './App.css';

// Player object used to store player information
class Player {
  constructor(playerNum, pawnPos, nWalls) {
    this.playerNum = playerNum;
    this.pawnPos = pawnPos;
    this.nWalls = nWalls;
    this.moves = [];
    this.getAdjacentCells = (placedWalls) => {
      let r = this.pawnPos[0];
      let c = this.pawnPos[1];
      let moves = [];
      let isBlockedLeft = placedWalls.includes(`${r}-${c - 1}`);
      let isBlockedRight = placedWalls.includes(`${r}-${c + 1}`);
      let isBlockedUp = placedWalls.includes(`${r - 1}-${c}`);
      let isBlockedDown = placedWalls.includes(`${r + 1}-${c}`);
      if (r > 0 && !isBlockedUp) {
        moves.push(`${r - 2}-${c}`);
      }
      if (r < 16 && !isBlockedDown) {
        moves.push(`${r + 2}-${c}`);
      }
      if (c > 0 && !isBlockedLeft) {
        moves.push(`${r}-${c - 2}`);
      }
      if (c < 16 && !isBlockedRight) {
        moves.push(`${r}-${c + 2}`);
      }
      this.moves = moves;
    }
    this.getAdjacentCells([]);
  }
}

export const GameScreen = () => {

  // All possible wall positions. Used for highlighting available wall placements
  const allWalls = Array.from(new Set([
    "1-0", "1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8", "1-9", "1-10", "1-11", "1-12", "1-13", "1-14", "1-15", "1-16",
    "3-0", "3-1", "3-2", "3-3", "3-4", "3-5", "3-6", "3-7", "3-8", "3-9", "3-10", "3-11", "3-12", "3-13", "3-14", "3-15", "3-16",
    "5-0", "5-1", "5-2", "5-3", "5-4", "5-5", "5-6", "5-7", "5-8", "5-9", "5-10", "5-11", "5-12", "5-13", "5-14", "5-15", "5-16",
    "7-0", "7-1", "7-2", "7-3", "7-4", "7-5", "7-6", "7-7", "7-8", "7-9", "7-10", "7-11", "7-12", "7-13", "7-14", "7-15", "7-16",
    "9-0", "9-1", "9-2", "9-3", "9-4", "9-5", "9-6", "9-7", "9-8", "9-9", "9-10", "9-11", "9-12", "9-13", "9-14", "9-15", "9-16",
    "11-0", "11-1", "11-2", "11-3", "11-4", "11-5", "11-6", "11-7", "11-8", "11-9", "11-10", "11-11", "11-12", "11-13", "11-14", "11-15", "11-16",
    "13-0", "13-1", "13-2", "13-3", "13-4", "13-5", "13-6", "13-7", "13-8", "13-9", "13-10", "13-11", "13-12", "13-13", "13-14", "13-15", "13-16",
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
    const handleNewGameData = (data) => {
      console.log("Got new data: ", data);
      setWalls(data.walls.map((wall) => `${wall.r}-${wall.c}`));

      setPlayer1((prevPlayer) => {
        prevPlayer.nWalls = data.numWalls[0];
        return prevPlayer;
      });

      setPlayer2((prevPlayer) => {
        prevPlayer.nWalls = data.numWalls[1];
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
    <div className='App bg-[#7d543c] min-w-max'>
      <GameGrid
        player1={player1}
        updatePlayer1={updatePlayer1}
        player2={player2}
        updatePlayer2={updatePlayer2}
        walls={walls}
        placeableWalls={placeableWalls}
        updatePlaceableWalls={updatePlaceableWalls}
      />
      {/* TODO: make look nice */}
      <div className='error-text'>{errorText}</div>
      <Footer />
    </div>
  );
};

const GridCell = ({ pos, classes, children, onClick, player }) => {
  
  const handleClick = () => {
    onClick(pos)
  };

  return (
    <div key={`${pos}`} className={`${classes} justify-center items-center`} onClick={handleClick}>
      {children}
    </div>
  );
};

const GridWall = ({ pos, classes, children, onClick, player }) => {

  const handleClick = () => {
    onClick(pos, player)
  }

  return (
    <div key={`${pos}`} className={`${classes}`} onClick={handleClick}>
      {children}
    </div>
  );
};

const PlacedWall = ({ classes }) => {
  return (
    <div className={`${classes}`}></div>
  );
}


export const GameGrid = ({ player1, updatePlayer1, player2, updatePlayer2, walls, placeableWalls, updatePlaceableWalls }) => {
  const updateBlockedMoves = (player) => {
    const tmp = player;
    tmp.getAdjacentCells(walls);
    if (player.playerNum === 1) {
      updatePlayer1(tmp);
    }
    else {
      updatePlayer2(tmp);
    }
  }

  const gridSize = 17;  // 9 cells + 8 walls = 17 x 17 grid
  // Constants used to adjust the grid cell attributes
  const cellHeight = "xl:h-[70px] lg:h-[50px] h-[30px]";
  const cellWidth = "xl:w-[70px] lg:w-[50px] w-[30px]";
  const wallWidth = "xl:w-[15px] lg:w-[10px] w-[8px]";
  const wallHeight = "xl:h-[15px] lg:h-[10px] h-[8px]";
  const wallStackWidth = "xl:w-[155px] lg:w-[100px] w-[80px]"
  const clickedWallColor = "bg-amber-200";
  const hoveredWallColor = "hover:bg-amber-400";
  const emptyWallColor = "bg-amber-900";
  const emptyWallColorHl = "bg-amber-900 hover:bg-amber-600";
  const placedWallColor = "bg-amber-600";
  const borderWidth = "xl:border-[15px] lg:border-[10px] border-[8px]";
  const borderColor = "border-orange-950";
  const cellColor = "bg-orange-950";
  const cellColorHl = "bg-orange-300"
  const p1Color = "bg-red-500";
  const p2Color = "bg-yellow-500";
  // These can be used later when 4 player logic is added:
  // const p3Color = "bg-red-900";
  // const p4Color = "bg-yellow-200";

  // Maybe have one state with the currently selected thing? 
  const [pawn1Clicked, setPawn1Clicked] = useState(false);
  const [pawn2Clicked, setPawn2Clicked] = useState(false);
  const [cells1Clicked, setCells1Clicked] = useState(false);
  const [cells2Clicked, setCells2Clicked] = useState(false);
  const [p1WallClicked, setP1WallClicked] = useState(false);
  const [p2WallClicked, setP2WallClicked] = useState(false);
  const [p1SelectedWall, setP1SelectedWall] = useState(10);
  const [p2SelectedWall, setP2SelectedWall] = useState(10);

  updateBlockedMoves(player1);
  updateBlockedMoves(player2);

  const handlePawn1Click = (pawnID) => {
    setCells1Clicked(false);
    setPawn1Clicked(!pawn1Clicked);
  };

  const handlePawn2Click = (pawnID) => {
    setCells2Clicked(false);
    setPawn2Clicked(!pawn2Clicked);
  };

  const handleCells1Click = (pos) => {
    const r = parseInt(pos.split('-')[0]);
    const c = parseInt(pos.split('-')[1]);
    let player = player1;
    player.pawnPos = [r, c];
    player.getAdjacentCells(walls);
    updatePlayer1(player);
    setPawn1Clicked(false);
    setCells1Clicked(true);
  }

  const handleCells2Click = (pos) => {
    const r = parseInt(pos.split('-')[0]);
    const c = parseInt(pos.split('-')[1]);
    let player = player2;
    player.pawnPos = [r, c];
    player.getAdjacentCells(walls);
    updatePlayer2(player);
    setPawn2Clicked(false);
    setCells2Clicked(true);
  }

  const handleP1WallClick = (selectedWall) => {
    if (p1WallClicked) {
      setP1SelectedWall(10);
    }
    else {
      setP1SelectedWall(selectedWall);
    }

    setP1WallClicked(!p1WallClicked);
  }

  const handleP2WallClick = (selectedWall) => {
    if (p2WallClicked) {
      setP2SelectedWall(10);
    }
    else {
      setP2SelectedWall(selectedWall);
    }
    setP2WallClicked(!p2WallClicked);
  }

  const renderGrid = () => {
    const pawn1R = player1.pawnPos[0];
    const pawn1C = player1.pawnPos[1];
    const pawn2R = player2.pawnPos[0];
    const pawn2C = player2.pawnPos[1];
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        const isYWall = (i % 2 !== 0);
        const isXWall = (j % 2 !== 0);
        const isPlacedWall = walls.includes(`${i}-${j}`);
        const wallColor = isPlacedWall ? `${placedWallColor}` : `${emptyWallColor}`;

        if (i === pawn1R && j === pawn1C) {
          row.push(
              <GridCell
                pos={`${i}-${j}`}
                classes={`${cellWidth} ${cellHeight} ${cellColor}`}
                children={<Pawn pawnColor={p1Color} onClick={handlePawn1Click} pawnID={`${i}-${j}`} />}
                onClick={() => {}}
              />
            );
        }
        else if (i === pawn2R && j === pawn2C) {
          row.push(
              <GridCell
                pos={`${i}-${j}`}
                classes={`${cellWidth} ${cellHeight} ${cellColor}`}
                children={<Pawn pawnColor={p2Color}
                onClick={handlePawn2Click}
                pawnID={`${i}-${j}`} />}
                onClick={() => {}}
              />
            );
        }
        else {
          if (isXWall && !isYWall) {
            if (isPlacedWall) {
              row.push(
                  <GridWall
                    key={`${i}-${j}`}
                    pos={`${i}-${j}`}
                    classes={``}
                    children={<PlacedWall classes={`${wallWidth} ${cellHeight} ${wallColor}`} />}
                    onClick={() => {}}
                    player={0}
                  />
                );
            }
            else {
              row.push(
                  <GridWall
                    key={`${i}-${j}`}
                    pos={`${i}-${j}`}
                    classes={`${wallWidth} ${cellHeight} ${wallColor}`}
                    children={<div></div>}
                    onClick={() => {}}
                    player={0}
                  />
                );
            }
          }
          else if (isYWall && !isXWall) {
            if (isPlacedWall) {
              row.push(
                  <GridWall
                    key={`${i}-${j}`}
                    pos={`${i}-${j}`}
                    classes={``}
                    children={<PlacedWall classes={`${cellWidth} ${wallHeight} ${wallColor}`} />}
                    onClick={() => {}}
                    player={0}
                  />
                );
            }
            else {
              row.push(
                  <GridWall
                    key={`${i}-${j}`}
                    pos={`${i}-${j}`}
                    classes={`${cellWidth} ${wallHeight} ${wallColor}`}
                    children={<div></div>}
                    onClick={() => {}}
                    player={0}
                  />
                );
            }
          }
          else if (isYWall && isXWall) {
            if (isPlacedWall) {
              row.push(
                  <GridWall
                    key={`${i}-${j}`}
                    pos={`${i}-${j}`}
                    classes={``}
                    children={<PlacedWall classes={`${wallWidth} ${wallHeight} ${wallColor}`} />}
                    onClick={() => {}}
                    player={0}
                  />
                );
            }
            else {
              row.push(
                  <GridWall
                    key={`${i}-${j}`}
                    pos={`${i}-${j}`}
                    classes={`${wallWidth} ${wallHeight} ${wallColor}`}
                    children={<div></div>}
                    onClick={() => {}}
                    player={0}
                  />
                );
            }
          }
          else {
            row.push(<GridCell pos={`${i}-${j}`} classes={`${cellWidth} ${cellHeight} ${cellColor}`} onClick={() => {}}></GridCell>);
          }
        }
      }

      grid.push(<div key={`row-${i}`} className={`flex`}>{row}</div>);
    }
    return grid;
  };

  var grid = renderGrid();
  console.log('Updating wall stack: ', p1SelectedWall, p2SelectedWall)
  var p1WallStack =
    <WallStack
      player={1}
      numWalls={player1.nWalls}
      onClick={handleP1WallClick}
      selectedWall={p1SelectedWall}
      wallHeight={wallHeight}
      wallWidth={wallStackWidth}
      wallPadHeight={cellHeight}
      colorClicked={clickedWallColor}
      colorHover={hoveredWallColor}
      colorWall={placedWallColor}
      colorWallEmpty={emptyWallColor}
      colorCell={cellColor}
    />;
  var p2WallStack =
    <WallStack
      player={2}
      numWalls={player2.nWalls}
      onClick={handleP2WallClick}
      selectedWall={p2SelectedWall}
      wallHeight={wallHeight}
      wallWidth={wallStackWidth}
      wallPadHeight={cellHeight}
      colorClicked={clickedWallColor}
      colorHover={hoveredWallColor}
      colorWall={placedWallColor}
      colorWallEmpty={emptyWallColor}
      colorCell={cellColor}
    />;

  if (pawn1Clicked) {
    for (let i = 0; i < player1.moves.length; i++) {
      let r = parseInt(player1.moves[i].split('-')[0]);
      let c = parseInt(player1.moves[i].split('-')[1]);
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`${cellWidth} ${cellHeight} ${cellColorHl}`} children={<div></div>} onClick={handleCells1Click} />;
    }
  }
  if (pawn2Clicked) {
    for (let i = 0; i < player2.moves.length; i++) {
      let r = parseInt(player2.moves[i].split('-')[0]);
      let c = parseInt(player2.moves[i].split('-')[1]);
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`${cellWidth} ${cellHeight} ${cellColorHl}`} children={<div></div>} onClick={handleCells2Click} />;
    }
  }
  if (cells1Clicked) {
    for (let i = 0; i < player1.moves.length; i++) {
      let r = parseInt(player1.moves[i].split('-')[0]);
      let c = parseInt(player1.moves[i].split('-')[1]);
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`${cellWidth} ${cellHeight} ${cellColor}`} children={<div></div>} onClick={() => {}} />;
    }
  }
  if (cells2Clicked) {
    for (let i = 0; i < player2.moves.length; i++) {
      let r = parseInt(player2.moves[i].split('-')[0]);
      let c = parseInt(player2.moves[i].split('-')[1]);
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`${cellWidth} ${cellHeight} ${cellColor}`} children={<div></div>} onClick={() => {}} />;
    }
  }

  const handleWallPlaced = (pos, player) => {
    const r = parseInt(pos.split('-')[0]);
    const c = parseInt(pos.split('-')[1]);

    makeMove({
      wallMove: {
        r: r,
        c: c,
      }
    });

    setP1WallClicked(false);
    setP2WallClicked(false);
  }

  if (p1WallClicked) {
    for (let i = 0; i < placeableWalls.length; i++) {
      let r = parseInt(placeableWalls[i].split('-')[0]);
      let c = parseInt(placeableWalls[i].split('-')[1]);
      const isYWall = (r % 2 !== 0);
      const isXWall = (c % 2 !== 0);
      const isPlacedWall = walls.includes(`${r}-${c}`);
      if (isXWall && !isYWall) {
        if (!isPlacedWall) {
          grid[r].props.children[c] =
            <GridWall
              key={`${r}-${c}`}
              pos={`${r}-${c}`}
              classes={``}
              children={<PlacedWall classes={`${wallWidth} ${cellHeight} ${emptyWallColorHl}`} />}
              onClick={handleWallPlaced}
              player={1}
            />;
        }
      }
      else if (isYWall && !isXWall) {
        if (!isPlacedWall) {
          grid[r].props.children[c] =
            <GridWall
              key={`${r}-${c}`}
              pos={`${r}-${c}`}
              classes={``}
              children={<PlacedWall classes={`${cellWidth} ${wallHeight} ${emptyWallColorHl}`} />}
              onClick={handleWallPlaced}
              player={1}
            />;
        }
      }
      else if (isYWall && isXWall) {
        if (!isPlacedWall) {
          grid[r].props.children[c] =
            <GridWall
              key={`${r}-${c}`}
              pos={`${r}-${c}`}
              classes={``}
              children={<PlacedWall classes={`${wallWidth} ${wallHeight} ${emptyWallColorHl}`} />}
              onClick={handleWallPlaced}
              player={1}
            />;
        }
      }
    }
  }

  if (p2WallClicked) {
    for (let i = 0; i < placeableWalls.length; i++) {
      let r = parseInt(placeableWalls[i].split('-')[0]);
      let c = parseInt(placeableWalls[i].split('-')[1]);
      const isYWall = (r % 2 !== 0);
      const isXWall = (c % 2 !== 0);
      const isPlacedWall = walls.includes(`${r}-${c}`);

      if (isXWall && !isYWall) {
        if (!isPlacedWall) {
          grid[r].props.children[c] =
            <GridWall
              key={`${r}-${c}`}
              pos={`${r}-${c}`}
              classes={``}
              children={<PlacedWall classes={`${wallWidth} ${cellHeight} ${emptyWallColorHl}`} />}
              onClick={handleWallPlaced}
              player={2}
            />;
        }
      }
      else if (isYWall && !isXWall) {
        if (!isPlacedWall) {
          grid[r].props.children[c] =
            <GridWall
              key={`${r}-${c}`}
              pos={`${r}-${c}`}
              classes={``}
              children={<PlacedWall classes={`${cellWidth} ${wallHeight} ${emptyWallColorHl}`} />}
              onClick={handleWallPlaced}
              player={2}
            />;
        }
      }
      else if (isYWall && isXWall) {
        if (!isPlacedWall) {
          grid[r].props.children[c] =
            <GridWall
              key={`${r}-${c}`}
              pos={`${r}-${c}`}
              classes={``}
              children={<PlacedWall classes={`${wallWidth} ${wallHeight} ${emptyWallColorHl}`} />}
              onClick={handleWallPlaced}
              player={2}
            />;
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-full mx-auto my-auto">
      <div className={`flex flex-col mx-auto rounded-md ${borderColor} ${borderWidth}`}>
        <div className={`flex justify-center text-amber-600 font-bold text-lg w-full ${cellColor}`}>Player 1</div>
        <div className={`w-auto flex flex-row my-auto`}>
          {p1WallStack}
          <div className={`${borderWidth} border-l-black border-r-black border-t-amber-900 border-b-amber-900`}>
            <div className={`grid grid-cols-17 grow`}>{grid}</div>
          </div>
          {p2WallStack}
        </div>
        <div className={`flex justify-center text-amber-600 font-bold text-lg w-full ${cellColor}`}>Player 2</div>
      </div>
    </div>
  );
};

export default GameGrid;
