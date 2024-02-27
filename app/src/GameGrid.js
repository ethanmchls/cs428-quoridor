import React from 'react';
import Pawn from './Pawn';
import { Footer } from './footer';
import './App.css';

export const GameScreen = () => {
  var pawn1 = [0, 8];
  var pawn2 = [16, 8];
  var walls = ["1-0", "1-1", "1-2", "10-7", "11-7", "12-7"];
  return (
    <div className='App'>
      <GameGrid pawn1Pos={pawn1} pawn2Pos={pawn2} walls={walls} />
      <Footer />
    </div>
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
  const gridSize = 17;  // 9 cells + 8 walls = 17 x 17 grid
  // Constants used to adjust the grid cell attributes
  const cellSize = "70";
  const wallSize = "15";
  const emptyWallColor = "bg-amber-900";
  const placedWallColor = "bg-amber-600";
  const borderColor = "border-amber-900";
  const cellColor = "bg-orange-950";
  const p1Color = "bg-red-500";
  const p2Color = "bg-yellow-500";
  // const p3Color = "bg-red-900";  // These can be used later when 4 player logic is added
  // const p4Color = "bg-yellow-200";

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
          // row.push(<div key={`${i}-${j}`} className={`${wallWidth} ${cellHeight} ${wallColor}`}></div>);
          row.push(<div key={`${i}-${j}`} className={`w-[${wallSize}px] h-[${cellSize}px] ${wallColor}`}></div>);
        }
        else if (isYWall && !isXWall) {
          row.push(<div key={`${i}-${j}`} className={`w-[${cellSize}px] h-[${wallSize}px] ${wallColor}`}></div>);
        }
        else if (isYWall && isXWall) {
          row.push(<div key={`${i}-${j}`} className={`w-[${wallSize}px] h-[${wallSize}px] ${wallColor}`}></div>);
        }
        else {
          row.push(<GridCell pos={`${i}-${j}`} classes={`w-[${cellSize}px] h-[${cellSize}px] ${cellColor}`}></GridCell>)
        }
      }

      grid.push(<div key={i} className={`flex`}>{row}</div>);
    }

    const pawn1R = pawn1Pos[0];
    const pawn1C = pawn1Pos[1];
    const pawn2R = pawn2Pos[0];
    const pawn2C = pawn2Pos[1];

    grid[pawn1R].props.children[pawn1C] = GridCell({ pos: `${pawn1R}-${pawn1C}`, classes: `w-[${cellSize}px] h-${cellSize}px] ${cellColor}`, children: <Pawn pawnColor={`${p1Color}`} /> });
    grid[pawn2R].props.children[pawn2C] = GridCell({ pos: `${pawn2R}-${pawn2C}`, classes: `w-[${cellSize}px] h-${cellSize}px] ${cellColor}`, children: <Pawn pawnColor={`${p2Color}`} /> });
    // TODO: make neighboring cells of pawns hoverable
    return grid;
  };

  return (
    <div className="flex justify-center items-center h-full mx-auto my-auto">
      <div className="w-auto flex mx-auto">
        <div className={`grid grid-cols-17 grow rounded-md ${borderColor} border-[${wallSize}px]`}>{renderGrid()}
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
