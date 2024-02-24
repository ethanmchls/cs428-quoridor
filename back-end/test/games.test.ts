import { describe, it, expect, beforeEach } from 'bun:test';
import { Games, MAX_GAMES } from '../lobby_logic/Games';
import { Game } from '../lobby_logic/Game';

describe('Games', () => {
    let gamesInstance: Games;

    beforeEach(() => {
        gamesInstance = Games.getInstance();
        gamesInstance.removeAll();
    });

    it('should create an instance of Games', () => {
        expect(gamesInstance).toBeInstanceOf(Games);
    });

    it('should be a singleton, with the same instance returned on subsequent calls', () => {
        const secondInstance = Games.getInstance();
        expect(gamesInstance).toBe(secondInstance);
    });

    it('should create a game and retrieve it using get method', () => {
        const game = new Game([]);
        gamesInstance.create(game);

        const retrievedGame = gamesInstance.get(game.id);

        expect(retrievedGame).toBe(game);
    });

    it('should throw an error when trying to create more games than the specified maximum', () => {
        const createMaxGames = () => {
            for (let i = 0; i < MAX_GAMES + 1; i++) {
                const game = new Game([]);
                gamesInstance.create(game);
            }
        };

        expect(createMaxGames).toThrow();
    });

    it('should remove a game based on its ID', () => {
        const game1 = new Game([]);
        const game2 = new Game([]);
        gamesInstance.create(game1);
        gamesInstance.create(game2);

        gamesInstance.remove(game1.id);

        expect(gamesInstance.get(game1.id)).toBeUndefined();
        expect(gamesInstance.get(game2.id)).toBe(game2);
    });

    it('should return an array of active games using getActive method', () => {
        const game1 = new Game([]);
        const game2 = new Game([]);
        gamesInstance.create(game1);
        gamesInstance.create(game2);

        const activeGames = gamesInstance.getActive();

        expect(activeGames).toContain(game1);
        expect(activeGames).toContain(game2);
    });
});
