import React, { useState } from 'react';
import Pawn from './Pawn';
import { Footer } from './footer';
import './App.css';

export const GameScreen = () => {
  var pawn1 = [0, 8];
  var pawn2 = [16, 8];
  var pawn1Moves = ["0-6", "0-10", "2-8"]
  var pawn2Moves = ["16-6", "16-10", "14-8"]
  var walls = ["1-0", "1-1", "1-2", "10-7", "11-7", "12-7"];
  return (
    <div className='App'>
      <GameGrid pawn1Pos={pawn1} pawn2Pos={pawn2} walls={walls} pawn1Moves={pawn1Moves} pawn2Moves={pawn2Moves} />
      <Footer />
    </div>
  );
};

const GridCell = ({ pos, classes, children, onClick }) => {
  
  const handleClick = () => {
    onClick(pos)
  };

  return (
    <div key={`${pos}`} className={`${classes} justify-center items-center`} onClick={handleClick}>
      {children}
    </div>
  );
};

export const GameGrid = ({ pawn1Pos, pawn2Pos, pawn1Moves, pawn2Moves, walls }) => {
  const gridSize = 17;  // 9 cells + 8 walls = 17 x 17 grid
  // Constants used to adjust the grid cell attributes
  const cellSize = "70";
  const wallSize = "15";
  const emptyWallColor = "amber-900";
  const placedWallColor = "amber-600";
  const cellColor = "orange-950";
  const cellColorHl = "orange-300"
  const p1Color = "red-500";
  const p2Color = "yellow-500";
  // const p3Color = "bg-red-900";  // These can be used later when 4 player logic is added
  // const p4Color = "bg-yellow-200";

  const [pawn1Clicked, setPawn1Clicked] = useState(false);
  const [pawn2Clicked, setPawn2Clicked] = useState(false);
  const [cells1Clicked, setCells1Clicked] = useState(false);
  const [cells2Clicked, setCells2Clicked] = useState(false);

  // Function to handle pawn click
  const handlePawn1Click = (pawnID) => {
    // Do something with the pawn information, e.g., update state
    console.log('Pawn 1 clicked: ', pawnID);
    setCells1Clicked(false);
    setPawn1Clicked(true);
  };

  const handlePawn2Click = (pawnID) => {
    // Do something with the pawn information, e.g., update state
    console.log('Pawn 2 clicked: ', pawnID);
    setCells2Clicked(false);
    setPawn2Clicked(true);
  };

  const handle1CellsClick = (pos) => {
    console.log('Cell clicked: ', pos)
    setCells1Clicked(true);
  }

  const handle2CellsClick = (pos) => {
    console.log('Cell clicked: ', pos)
    setCells2Clicked(true);
  }

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
          row.push(<div key={`${i}-${j}`} className={`w-[${wallSize}px] h-[${cellSize}px] bg-${wallColor}`}></div>);
        }
        else if (isYWall && !isXWall) {
          row.push(<div key={`${i}-${j}`} className={`w-[${cellSize}px] h-[${wallSize}px] bg-${wallColor}`}></div>);
        }
        else if (isYWall && isXWall) {
          row.push(<div key={`${i}-${j}`} className={`w-[${wallSize}px] h-[${wallSize}px] bg-${wallColor}`}></div>);
        }
        else {
          row.push(<GridCell pos={`${i}-${j}`} classes={`w-[${cellSize}px] h-[${cellSize}px] bg-${cellColor}`} onClick={() => {}}></GridCell>)
        }
      }

      grid.push(<div key={i} className={`flex`}>{row}</div>);
    }
    return grid;
  };

  var grid = renderGrid();

  const pawn1R = pawn1Pos[0];
  const pawn1C = pawn1Pos[1];
  const pawn2R = pawn2Pos[0];
  const pawn2C = pawn2Pos[1];

  grid[pawn1R].props.children[pawn1C] = <GridCell pos={`${pawn1R}-${pawn1C}`} classes={`w-[${cellSize}px] h-${cellSize}px] bg-${cellColor}`} children={<Pawn pawnColor={`bg-${p1Color}`} onClick={handlePawn1Click} pawnID={`${pawn1R}-${pawn1C}`} />} onClick={() => {}} />;
  grid[pawn2R].props.children[pawn2C] = <GridCell pos={`${pawn2R}-${pawn2C}`} classes={`w-[${cellSize}px] h-${cellSize}px] bg-${cellColor}`} children={<Pawn pawnColor={`bg-${p2Color}`} onClick={handlePawn2Click} pawnID={`${pawn2R}-${pawn2C}`} />} onClick={() => {}} />;
  if (pawn1Clicked) {
    for (let i = 0; i < pawn1Moves.length; i++) {
      let r = pawn1Moves[i].split('-')[0];
      let c = pawn1Moves[i].split('-')[1];
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`w-[${cellSize}px] h-${cellSize}px] bg-${cellColorHl}`} children={<div></div>} onClick={handle1CellsClick} />
    }
  }
  if (pawn2Clicked) {
    for (let i = 0; i < pawn2Moves.length; i++) {
      let r = pawn2Moves[i].split('-')[0];
      let c = pawn2Moves[i].split('-')[1];
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`w-[${cellSize}px] h-${cellSize}px] bg-${cellColorHl}`} children={<div></div>} onClick={handle2CellsClick} />
    }
  }
  if (cells1Clicked) {
    for (let i = 0; i < pawn1Moves.length; i++) {
      let r = pawn1Moves[i].split('-')[0];
      let c = pawn1Moves[i].split('-')[1];
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`w-[${cellSize}px] h-${cellSize}px] bg-${cellColor}`} children={<div></div>} onClick={() => {}} />
    }
  }
  if (cells2Clicked) {
    for (let i = 0; i < pawn2Moves.length; i++) {
      let r = pawn2Moves[i].split('-')[0];
      let c = pawn2Moves[i].split('-')[1];
      grid[r].props.children[c] = <GridCell pos={`${r}-${c}`} classes={`w-[${cellSize}px] h-${cellSize}px] bg-${cellColor}`} children={<div></div>} onClick={() => {}} />
    }
  }

  return (
    <div className="flex justify-center items-center h-full mx-auto my-auto">
      <div className={`w-auto flex mx-auto`}>
        <div className={`rounded-md border-${emptyWallColor} border-[${wallSize}px] my-auto`}>
          <div className={`grid grid-cols-17 grow`}>{grid}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
