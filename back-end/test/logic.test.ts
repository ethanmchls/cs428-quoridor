import { Game } from "../lobby_logic/Game";
import { Player } from "../lobby_logic/Player";


describe('Logic', () => {
    it("should prevent pawns from being trapped", () => {
        const game = new Game([new Player(), new Player()]);
        let isNotTrapped = game.game.isPawnNotTrapped(game.game.players[0]!);
        
        expect(isNotTrapped).toBe(true);

        game.takeTurn(game.players[0]!, { wallMove: { r: 0, c: 7 } });
        game.takeTurn(game.players[1]!, { wallMove: { r: 0, c: 9 } });
        game.takeTurn(game.players[0]!, { wallMove: { r: 3, c: 8 } });

        isNotTrapped = game.game.isPawnNotTrapped(game.game.players[0]!);
        
        expect(isNotTrapped).toBe(false);
    });
});