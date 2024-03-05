const WallStack = ({player, numWalls, onClick, selectedWall, wallWidth, wallHeight, wallPadHeight}) => {
  const handleClick = (i) => {
    onClick(i);
  };

  let wallStack = [];
  for (let i = 0; i < (numWalls); i++) {
    if (i === selectedWall) {
      wallStack.push(<div key={`wall-${i}`} className={`${wallHeight} ${wallWidth} bg-amber-200`} onClick={() => {handleClick(i)}}></div>);
    }
    else {
      wallStack.push(<div key={`wall-${i}`} className={`${wallHeight} ${wallWidth} bg-amber-600 hover:bg-amber-400`} onClick={() => {handleClick(i)}}></div>);
    }
    if (i < 9) {
      wallStack.push(<div className={`${wallPadHeight} ${wallWidth} bg-orange-950`} onClick={() => {}}></div>);
    }
  }
  for (let i = 0; i < (10 - numWalls); i++) {
    wallStack.push(<div className={`${wallHeight} ${wallWidth} bg-amber-900`} onClick={() => {}}></div>);
    if (numWalls < 9 && i < 9 - numWalls) {
      wallStack.push(<div className={`${wallPadHeight} ${wallWidth} bg-orange-950`} onClick={() => {}}></div>);
    }
  }

  return (
    <div className="flex flex-col">
      {wallStack}
    </div>
  );
}

export default WallStack;