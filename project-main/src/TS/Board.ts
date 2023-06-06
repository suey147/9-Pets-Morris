import { Position } from './Position.js';
import { Team } from './Team.js';
import { Player } from './enums/Player.js';
import { Direction } from "./enums/Direction.js";


/**
 * This class represents the 9MM game board displayed at any specific turn/state of the game.
 */
export class Board {
    /**
     * The list of teams in the game.
     */
    private teams: Team[];

    /**
     * The current player's index in teams.
     */
    private currentPlayer: Player;

    /**
     * An array of positions on the 9MM game board.
     */
    private positions: Position[];

    /**
     * The current phase of the game.
     */
    private gamePhase: number;

    /**
     * The position index of where the last token was picked up.
     */
    private pickUpPositionIndex?: number;

    /**
     * Constructs a new board.
     * @param teams The teams playing in the game.
     * @param currentPlayer The current player index.
     * @param gamePhase The current phase of the game.
     * @param positions The positions on the board.
     * 
     */
    constructor(teams?: Team[], currentPlayer?: Player, positions?: Position[], gamePhase?: number) {
        if (teams) {
            this.teams = [new Team(Player.Cat, teams[0].getNumUnplacedTokens(), teams[0].getNumAliveTokens()),
            new Team(Player.Dog, teams[1].getNumUnplacedTokens(), teams[1].getNumAliveTokens())];
        } else {
            this.teams = [new Team(Player.Cat), new Team(Player.Dog)];
        }
        this.currentPlayer = currentPlayer ?? Player.Cat;
        if (positions) {
            this.positions = this.setPositions(positions);
        } else {
            this.positions = this.setUpPositions();
        }
        this.joinPositions();
        this.gamePhase = gamePhase ?? 1;
    }

    /**
     * Pushes new Position objects to the positions array.
     * @param positions An array of positions to be pushed into the positions array.
     * @returns Position array with new instances of positions so that one update does not affect all instances of the same position.
     */
    private setPositions(positions: Position[]): Position[] {
        const positionBoard: Position[] = [];
        for (let i = 0; i < 24; i++) {
            let currentPosition = positions[i];
            positionBoard.push(new Position(currentPosition.getPlayer(), i));
        }
        return positionBoard;
    }

    /**
     * Sets up an empty board with 24 positions with corresponding neighbours.
     * @returns An array of positions in a game board.
     */
    private setUpPositions(): Position[] {
        const emptyBoard: Position[] = [];
        for (let i = 0; i < 24; i++) {
            emptyBoard.push(new Position(undefined, i));
        }
        return emptyBoard;
    }

    /**
     * Joins all the positions to create a network.
     */
    private joinPositions(): void {
        this.positions[0].setNeighbour(Direction.Right, this.positions[1]);
        this.positions[0].setNeighbour(Direction.Down, this.positions[9]);

        this.positions[1].setNeighbour(Direction.Left, this.positions[0]);
        this.positions[1].setNeighbour(Direction.Right, this.positions[2]);
        this.positions[1].setNeighbour(Direction.Down, this.positions[4]);

        this.positions[2].setNeighbour(Direction.Left, this.positions[1]);
        this.positions[2].setNeighbour(Direction.Down, this.positions[14]);

        this.positions[3].setNeighbour(Direction.Right, this.positions[4]);
        this.positions[3].setNeighbour(Direction.Down, this.positions[10]);

        this.positions[4].setNeighbour(Direction.Left, this.positions[3]);
        this.positions[4].setNeighbour(Direction.Right, this.positions[5]);
        this.positions[4].setNeighbour(Direction.Up, this.positions[1]);
        this.positions[4].setNeighbour(Direction.Down, this.positions[7]);

        this.positions[5].setNeighbour(Direction.Left, this.positions[4]);
        this.positions[5].setNeighbour(Direction.Down, this.positions[13]);

        this.positions[6].setNeighbour(Direction.Right, this.positions[7]);
        this.positions[6].setNeighbour(Direction.Down, this.positions[11]);

        this.positions[7].setNeighbour(Direction.Left, this.positions[6]);
        this.positions[7].setNeighbour(Direction.Right, this.positions[8]);
        this.positions[7].setNeighbour(Direction.Up, this.positions[4]);

        this.positions[8].setNeighbour(Direction.Left, this.positions[7]);
        this.positions[8].setNeighbour(Direction.Down, this.positions[12]);

        this.positions[9].setNeighbour(Direction.Up, this.positions[0]);
        this.positions[9].setNeighbour(Direction.Right, this.positions[10]);
        this.positions[9].setNeighbour(Direction.Down, this.positions[21]);

        this.positions[10].setNeighbour(Direction.Left, this.positions[9]);
        this.positions[10].setNeighbour(Direction.Right, this.positions[11]);
        this.positions[10].setNeighbour(Direction.Up, this.positions[3]);
        this.positions[10].setNeighbour(Direction.Down, this.positions[18]);

        this.positions[11].setNeighbour(Direction.Left, this.positions[10]);
        this.positions[11].setNeighbour(Direction.Up, this.positions[6]);
        this.positions[11].setNeighbour(Direction.Down, this.positions[15]);

        this.positions[12].setNeighbour(Direction.Up, this.positions[8]);
        this.positions[12].setNeighbour(Direction.Right, this.positions[13]);
        this.positions[12].setNeighbour(Direction.Down, this.positions[17]);

        this.positions[13].setNeighbour(Direction.Left, this.positions[12]);
        this.positions[13].setNeighbour(Direction.Right, this.positions[14]);
        this.positions[13].setNeighbour(Direction.Up, this.positions[5]);
        this.positions[13].setNeighbour(Direction.Down, this.positions[20]);

        this.positions[14].setNeighbour(Direction.Left, this.positions[13]);
        this.positions[14].setNeighbour(Direction.Up, this.positions[2]);
        this.positions[14].setNeighbour(Direction.Down, this.positions[23]);

        this.positions[15].setNeighbour(Direction.Up, this.positions[11]);
        this.positions[15].setNeighbour(Direction.Right, this.positions[16]);

        this.positions[16].setNeighbour(Direction.Left, this.positions[15]);
        this.positions[16].setNeighbour(Direction.Right, this.positions[17]);
        this.positions[16].setNeighbour(Direction.Down, this.positions[19]);

        this.positions[17].setNeighbour(Direction.Left, this.positions[16]);
        this.positions[17].setNeighbour(Direction.Up, this.positions[12]);

        this.positions[18].setNeighbour(Direction.Up, this.positions[10]);
        this.positions[18].setNeighbour(Direction.Right, this.positions[19]);

        this.positions[19].setNeighbour(Direction.Left, this.positions[18]);
        this.positions[19].setNeighbour(Direction.Right, this.positions[20]);
        this.positions[19].setNeighbour(Direction.Up, this.positions[16]);
        this.positions[19].setNeighbour(Direction.Down, this.positions[22]);

        this.positions[20].setNeighbour(Direction.Left, this.positions[19]);
        this.positions[20].setNeighbour(Direction.Up, this.positions[13]);

        this.positions[21].setNeighbour(Direction.Up, this.positions[9]);
        this.positions[21].setNeighbour(Direction.Right, this.positions[22]);

        this.positions[22].setNeighbour(Direction.Left, this.positions[21]);
        this.positions[22].setNeighbour(Direction.Right, this.positions[23]);
        this.positions[22].setNeighbour(Direction.Up, this.positions[19]);

        this.positions[23].setNeighbour(Direction.Left, this.positions[22]);
        this.positions[23].setNeighbour(Direction.Up, this.positions[14]);
    }

    /**
     * Gets the team that is playing this current turn.
     * @returns The currently playing team.
     */
    getPlayingTeam(): Team {
        return this.teams[this.currentPlayer];
    }

    /**
     * Gets the team that is not playing this current turn..
     * @returns The non-playing team.
     */
    getNonPlayingTeam(): Team {
        return this.teams[(this.currentPlayer + 1) % 2];
    }

    /**
     * Gets the team at the specified index in teams.
     * @param index The index of the team to retrieve.
     * @returns The team at the specified index.
     */
    getTeam(index: number): Team {
        return this.teams[index];
    }

    /**
     * Gets the teams array.
     * @returns The list of teams in the game.
     */
    getTeams(): Team[] {
        return this.teams;
    }

    /**
     * Gets the current player enum.
     * @returns Current player enum
     */
    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    /**
     * Gets the player at the specified position index.
     * @param index The position index.
     * @returns The player at the specified position index, or undefined if no player is at the position.
     */
    getPositionTeam(index: number): Player {
        return this.positions[index].getPlayer();
    }

    /**
     * Gets the positions array.
     * @returns The positions array of this board.
     */
    getPositions(): Position[] {
        return this.positions;
    }

    /**
     * Gets the current game phase.
     * @returns The game phase of this board.
     */
    getGamePhase(): number {
        return this.gamePhase;
    }

    /**
     * Gets the position index of where the last token was picked up.
     * @returns The position where the last token was picked up.
     */
    getPickUpPositionIndex(): number {
        return this.pickUpPositionIndex;
    }

    /**
     * Increments the game phase by 1.
     */
    incrementGamePhase(): void {
        this.gamePhase++;
    }

    /**
     * Sets the last pick up position index of the board.
     * @param index The position index where the last token was picked up.
     */
    setPickUpPosition(index: number): void {
        this.pickUpPositionIndex = index;
    }

    /**
     * Switches the currently playing team and updates the game phase accordingly.
     */
    switchPlayingTeam(): void {
        this.currentPlayer = (this.currentPlayer + 1) % 2;

        if (this.getPlayingTeam().getNumUnplacedTokens() > 0) {
            this.gamePhase = 1;
        } else {
            this.gamePhase = 0;
        }

        this.pickUpPositionIndex = undefined;
    }

    /**
     * Checks whether the position specified by index is part of a mill.
     * @param index Position index to be checked.
     * @param tokenAdded Indicates whether the mill check is performed after a token has been placed/moved.
     * @returns true if one or more mills are formed, false otherwise.
     */
    checkMill(index: number, tokenAdded: boolean): boolean {
        let millOrientation = this.positions[index].checkMill();
        this.positions[index].updateMillCounterOrientation(millOrientation, tokenAdded);
        return (millOrientation != undefined);
    }

    /**
     * Turns the current Board object into JSON.
     * @returns JSON object of this Board object.
     */
    toJSON(): any {
        return {
            teams: this.getTeams(),
            currentPlayer: this.getCurrentPlayer(),
            positions: this.getPositions().map((position) => position.toJSON()),
            gamePhase: this.getGamePhase(),
            pickUpPositionIndex: this.getPickUpPositionIndex(),
        };
    }
}
