import React, { useState } from 'react';
import Pawn from './Pawn';
import WallStack from './WallStack';
import { makeMove } from './socket/socketApi';

const GridCell = ({ pos, classes, children, onClick, player }) => {
  
  const handleClick = () => {
    onClick(pos)
  };

  return (
    <div key={`${pos}-${player}`} className={`${classes} justify-center items-center`} onClick={handleClick}>
      {children}
    </div>
  );
};

const GridWall = ({ pos, classes, children, onClick, player }) => {

  const handleClick = () => {
    onClick(pos, player)
  }

  return (
    <div key={`${pos}-${player}`} className={`${classes}`} onClick={handleClick}>
      {children}
    </div>
  );
};

const PlacedWall = ({ classes }) => {
  return (
    <div className={`${classes}`}></div>
  );
}

export const GameGrid = ({ player1, updatePlayer1, player2, updatePlayer2, walls, updateWalls, placeableWalls, updatePlaceableWalls, playerNum, isPlayerTurn }) => {

  // const subtractWall = (player) => {
  //   const tmp = player;
  //   tmp.nWalls -= 1;
  //   if (player.playerNum === 1) {
  //     updatePlayer1(tmp);
  //   }
  //   else {
  //     updatePlayer2(tmp);
  //   }
  // }

  const updateBlockedMoves = (player) => {
    const tmp = player;
    // tmp.getAdjacentCells(walls);
    if (player.playerNum === 1) {
      updatePlayer1(tmp);
    }
    else {
      updatePlayer2(tmp);
    }
  }

  const gridSize = 17;  // 9 cells + 8 walls = 17 x 17 grid
  // Constants used to adjust the grid cell attributes
  const cellHeight = "xl:h-[60px] lg:h-[50px] h-[30px]";
  const cellWidth = "xl:w-[60px] lg:w-[50px] w-[30px]";
  const wallWidth = "xl:w-[12px] lg:w-[10px] w-[8px]";
  const wallHeight = "xl:h-[12px] lg:h-[10px] h-[8px]";
  const wallStackWidth = "xl:w-[150px] lg:w-[100px] w-[80px]"
  const clickedWallColor = "bg-amber-200";
  const hoveredWallColor = "hover:bg-amber-400";
  const emptyWallColor = "bg-amber-900";
  const emptyWallColorHl = "bg-amber-900 hover:bg-amber-600";
  const placedWallColor = "bg-amber-600";
  const borderWidth = "xl:border-[12px] lg:border-[10px] border-[8px]";
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
  const [p1WallClicked, setP1WallClicked] = useState(false);
  const [p2WallClicked, setP2WallClicked] = useState(false);
  const [p1SelectedWall, setP1SelectedWall] = useState(10);
  const [p2SelectedWall, setP2SelectedWall] = useState(10);

  updateBlockedMoves(player1);
  updateBlockedMoves(player2);

  const handlePawn1Click = () => {
    setPawn1Clicked(!pawn1Clicked);
  };

  const handlePawn2Click = () => {
    setPawn2Clicked(!pawn2Clicked);
  };

  const handleCells1Click = (pos) => {
    const r = parseInt(pos.split('-')[0]);
    const c = parseInt(pos.split('-')[1]);
    // let player = player1;
    // player.pawnPos = [r, c];
    // player.getAdjacentCells(walls);
    // updatePlayer1(player);
    makeMove({
      pawnMove: {
        r: r,
        c: c,
      }
    });
    setPawn1Clicked(false);
  }

  const handleCells2Click = (pos) => {
    const r = parseInt(pos.split('-')[0]);
    const c = parseInt(pos.split('-')[1]);
    // let player = player2;
    // player.pawnPos = [r, c];
    // player.getAdjacentCells(walls);
    // updatePlayer2(player);
    makeMove({
      pawnMove: {
        r: r,
        c: c,
      }
    });
    setPawn2Clicked(false);
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
          console.log("Pushing pawn 1: ", player1.pawnPos);
          row.push(
              <GridCell
                key={`${i}-${j}`}
                pos={`${i}-${j}`}
                classes={`${cellWidth} ${cellHeight} ${cellColor}`}
                children={
                  <Pawn
                    pawnColor={p1Color}
                    onClick={handlePawn1Click}
                    pawnID={`pawn-${i}-${j}-1`}
                  />
                }
                onClick={() => {}}
                player={1}
              />
            );
        }
        else if (i === pawn2R && j === pawn2C) {
          console.log("Pushing pawn 2: ", player2.pawnPos);
          row.push(
              <GridCell
                key={`${i}-${j}`}
                pos={`${i}-${j}`}
                classes={`${cellWidth} ${cellHeight} ${cellColor}`}
                children={
                  <Pawn
                    pawnColor={p2Color}
                    onClick={handlePawn2Click}
                    pawnID={`pawn-${i}-${j}-2`}
                  />
                }
                onClick={() => {}}
                player={2}
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
                    children={
                      <PlacedWall
                        classes={`${wallWidth} ${cellHeight} ${wallColor}`}
                        key={`${i}-${j}`}
                      />
                    }
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
                    children={
                      <PlacedWall
                        classes={`${cellWidth} ${wallHeight} ${wallColor}`}
                        key={`${i}-${j}`}
                      />
                    }
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
                    children={
                      <PlacedWall
                        classes={`${wallWidth} ${wallHeight} ${wallColor}`}
                        key={`${i}-${j}`}
                      />
                    }
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
            row.push(<GridCell key={`${i}-${j}`} pos={`${i}-${j}`} classes={`${cellWidth} ${cellHeight} ${cellColor}`} onClick={() => {}} player={0} />);
          }
        }
      }

      grid.push(<div key={`row-${i}`} className={`flex`}>{row}</div>);
    }
    return grid;
  };

  var grid = renderGrid();
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
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`${cellWidth} ${cellHeight} ${cellColorHl}`} children={<div></div>} onClick={handleCells1Click} player={1} />;
    }
  }
  if (pawn2Clicked) {
    for (let i = 0; i < player2.moves.length; i++) {
      let r = parseInt(player2.moves[i].split('-')[0]);
      let c = parseInt(player2.moves[i].split('-')[1]);
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`${cellWidth} ${cellHeight} ${cellColorHl}`} children={<div></div>} onClick={handleCells2Click} player={2} />;
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

    setP1SelectedWall(10);
    setP2SelectedWall(10);

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
  const opponentName = "Opponent"
  const playerName = "You"

  return (
    <div className="flex-grow">
      <div className="flex justify-center items-center mx-auto h-full">
        <div className={`flex flex-col mx-auto rounded-md ${borderColor} ${borderWidth}`}>
          <div className={`flex justify-center text-primary font-bold text-lg w-full ${cellColor}`}>
            {isPlayerTurn
              ? opponentName
              : `\u2022 ${opponentName} \u2022`
            }
          </div>
          <div className={`w-auto flex flex-row my-auto`}>
            {playerNum === 1 ? <div className="scale-y-[-1]">{p2WallStack}</div> : <div className="scale-y-[-1]">{p1WallStack}</div>}
            <div className={`${borderWidth} border-l-black border-r-black border-t-amber-900 border-b-amber-900 ${playerNum === 1 ? "scale-y-[-1]" : ""}`}>
              <div className={`grid grid-cols-17 grow`}>{grid}</div>
            </div>
            {playerNum === 1 ? p1WallStack : p2WallStack}
          </div>
          <div className={`flex justify-center text-primary font-bold text-lg w-full ${cellColor}`}>
          {isPlayerTurn
              ? `\u2022 ${playerName} \u2022`
              : playerName
            }
          </div>
        </div>
      </div>
    </div>
  );
};
