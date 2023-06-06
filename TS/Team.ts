import { Player } from "./enums/Player.js";


/**
 * This class represents a team in the game, which corresponds to a player.
 */
export class Team {
    /**
     * The player associated with this team.
     */
    private player: Player;

    /**
     * The number of unplaced tokens.
     */
    private numUnplacedTokens: number;

    /**
     * The number of alive tokens in the game.
     */
    private numAliveTokens: number;

    /**
     * Constructs a Team object.
     * @param player The player associated with this team.
     */
    constructor(player: Player, numUnplacedTokens?: number, numAliveTokens?: number) {
        this.player = player;
        this.numUnplacedTokens = numUnplacedTokens ?? 9;
        this.numAliveTokens = numAliveTokens ?? 9;
    }

    /**
     * Gets the player associated with this team.
     * @returns The player of this team.
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * Gets the number of unplaced tokens for the team.
     * @returns The number of unplaced tokens.
     */
    getNumUnplacedTokens(): number {
        return this.numUnplacedTokens;
    }

    /**
     * Gets the number of alive tokens for the team.
     * @returns The number of alive tokens.
     */
    getNumAliveTokens(): number {
        return this.numAliveTokens;
    }

    /**
     * Decrements the number of unplaced tokens by one.
     */
    placeToken(): void {
        if (this.numUnplacedTokens > 0) {
            this.numUnplacedTokens--;
        }
    }

    /**
     * Decrements the number of alive tokens by one.
     */
    removeToken(): void {
        this.numAliveTokens--;
    }
}
