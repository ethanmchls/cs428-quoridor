import { Game, GameId } from "./Game";

const MAX_GAMES = 50;

export class Games {
	private static instance: Games;

	games: (Game | null)[];

	private constructor(numgames: number) {
		this.games = new Array(numgames);
	}

	public static getInstance() {
		if (!Games.instance) {
            Games.instance = new Games(MAX_GAMES);
        }

        return Games.instance;
	}

	create(game: Game) {
		for (var i = 0; i < this.games.length; i++) {
			if (this.games[i] == null) {
				this.games[i] = game;
                return;
			}
		}
        throw new Error("Too many games created");
	}

	remove(gameId: GameId) {
		this.games = this.games.filter((game) => game == null || game.id != gameId);
	}

	get(gameId: GameId) {
		return this.games.find((game) => game?.id == gameId);
	}

	getActive() {
		return this.games.filter((game) => game != null);
	}
}