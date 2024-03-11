const WallStack = ({player, numWalls, onClick, selectedWall, wallWidth, wallHeight, wallPadHeight, colorClicked, colorHover, colorWall, colorWallEmpty, colorCell}) => {
  const handleClick = (i) => {
    onClick(i);
  };

  let wallStack = [];
  for (let i = 0; i < (numWalls); i++) {
    if (i === selectedWall) {
      wallStack.push(<div key={`wall-${i}`} className={`${wallHeight} ${wallWidth} ${colorClicked}`} onClick={() => {handleClick(i)}}></div>);
    }
    else {
      wallStack.push(<div key={`wall-${i}`} className={`${wallHeight} ${wallWidth} ${colorWall} ${colorHover}`} onClick={() => {handleClick(i)}}></div>);
    }
    if (i < 9) {
      wallStack.push(<div className={`${wallPadHeight} ${wallWidth} ${colorCell}`} onClick={() => {}}></div>);
    }
  }
  for (let i = 0; i < (10 - numWalls); i++) {
    wallStack.push(<div className={`${wallHeight} ${wallWidth} ${colorWallEmpty}`} onClick={() => {}}></div>);
    if (numWalls < 9 && i < 9 - numWalls) {
      wallStack.push(<div className={`${wallPadHeight} ${wallWidth} ${colorCell}`} onClick={() => {}}></div>);
    }
  }

  return (
    <div className="flex flex-col">
      {wallStack}
    </div>
  );
}

export default WallStack;