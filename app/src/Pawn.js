const Pawn = ({ pawnColor, onClick, pawnID }) => {

  const handleClick = () => {
    onClick()
  };

  return (
    <div key={pawnID} className="w-full h-full justify-center items-center flex">
      <div className={`w-2/3 h-2/3 rounded-full ${pawnColor} border-2 border-black hover:scale-105 hover:shadow-lg`}
        onClick={handleClick}
      />
    </div>
  );
};

export default Pawn;
