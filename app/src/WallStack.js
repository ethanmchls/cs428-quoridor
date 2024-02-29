const WallStack = ({player, numWalls, onClick}) => {
  const handleClick = () => {
    onClick();
  };

  let wallStack = [];
  for (let i = 0; i < (numWalls); i++) {
    wallStack.push(<div key={`wall-${i}`} className="h-[15px] w-[155px] bg-amber-600 hover:bg-amber-400" onClick={handleClick}></div>);
    if (i < 9) {
      wallStack.push(<div className="h-[70px] w-[155px] bg-orange-950" onClick={() => {}}></div>);
    }
  }
  for (let i = 0; i < (10 - numWalls); i++) {
    wallStack.push(<div className="h-[15px] w-[155px] bg-amber-900" onClick={() => {}}></div>);
    if (numWalls < 9 && i < 9 - numWalls) {
      wallStack.push(<div className="h-[70px] w-[155px] bg-orange-950" onClick={() => {}}></div>);
    }
  }

  return (
    <div className="flex flex-col">
      {wallStack}
    </div>
  );
}

export default WallStack;