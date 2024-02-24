import React from 'react';
import Pawn from './Pawn';
import { Footer } from './footer';
import './App.css';

export const GameScreen = () => {
  var pawn1 = [0, 8];
  var pawn2 = [16, 8];
  var walls = ["1-0", "1-1", "1-2", "10-7", "11-7", "12-7"];
  return (
    <>
    <div className='App'>
    <GameGrid pawn1Pos={pawn1} pawn2Pos={pawn2} walls={walls} />
    </div>
    <Footer />
    </>
  );
};

const GridCell = ({ pos, classes, children }) => {
  return (
    <div key={`${pos}`} className={`${classes} justify-center items-center`}>
      {children}
    </div>
  );
};

export const GameGrid = ({ pawn1Pos, pawn2Pos, walls }) => {
  const gridSize = 17;
  // Constants used to adjust the grid cell attributes
  const cellHeight = "h-[70px]";
  const cellWidth = "w-[70px]";
  const wallWidth = "w-[15px]";
  const wallHeight = "h-[15px]";
  const emptyWallColor = "bg-gray-200";
  const placedWallColor = "bg-black";
  const cellColor = "bg-gray-300";

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        const isYWall = (i % 2 !== 0);
        const isXWall = (j % 2 !== 0);
        const isPlacedWall = walls.includes(`${i}-${j}`);
        const wallColor = isPlacedWall ? `${placedWallColor}` : `${emptyWallColor}`;

        if (isXWall && !isYWall) {
          row.push(<div key={`${i}-${j}`} className={`${wallWidth} ${cellHeight} ${wallColor}`}></div>);
        }
        else if (isYWall && !isXWall) {
          row.push(<div key={`${i}-${j}`} className={`${cellWidth} ${wallHeight} ${wallColor}`}></div>);
        }
        else if (isYWall && isXWall) {
          row.push(<div key={`${i}-${j}`} className={`${wallWidth} ${wallHeight} ${wallColor}`}></div>);
        }
        else {
          row.push(<GridCell pos={`${i}-${j}`} classes={`${cellWidth} ${cellHeight} ${cellColor}`}></GridCell>)
        }
      }

      grid.push(<div key={i} className={`flex`}>{row}</div>);
    }

    const pawn1R = pawn1Pos[0];
    const pawn1C = pawn1Pos[1];
    const pawn2R = pawn2Pos[0];
    const pawn2C = pawn2Pos[1];

    grid[pawn1R].props.children[pawn1C] = GridCell({ pos: `${pawn1R}-${pawn1C}`, classes: `${cellWidth} ${cellHeight} ${cellColor}`, children: <Pawn pawnColor="bg-blue-500" /> });
    grid[pawn2R].props.children[pawn2C] = GridCell({ pos: `${pawn2R}-${pawn2C}`, classes: `${cellWidth} ${cellHeight} ${cellColor}`, children: <Pawn pawnColor="bg-red-500" /> });
    // TODO: make neighboring cells of pawns hoverable
    return grid;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-auto flex mx-auto">
        <div className="grid grid-cols-17 grow">{renderGrid()}
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
