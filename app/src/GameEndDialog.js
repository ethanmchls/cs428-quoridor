import { useNavigate } from 'react-router-dom';

const GameEndDialog = ({ title, text }) => {
  const navigate = useNavigate();

  return (
    <dialog id="game_end_dialog" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{text}</p>
        <div className="modal-action">
          <form method="dialog">
            <button onClick={() => navigate("/")} className="btn">Exit</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default GameEndDialog;