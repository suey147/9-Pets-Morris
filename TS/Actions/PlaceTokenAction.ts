import { Action } from "./Action.js";
import { Board } from "../Board.js";


/**
 * This class implements the place token action that can be performed on a game board.
 */
export class PlaceTokenAction extends Action {
    /**
     * The position index on the board to place the token.
     */
    private positionIndex: number;

    /**
     * The index of the position where the token was last picked up.
     */
    private pickUpPositionIndex: number;

    /**
     * Constructs a place token action.
     * @param board The board to perform this place token action on.
     * @param positionIndex The position index to place the token.
     * @param previousPositionIndex The position index of where the token was last picked up, undefined if not applicable.
     */
    constructor(board: Board, positionIndex: number, previousPositionIndex: number) {
        super(board);
        this.positionIndex = positionIndex;
        this.pickUpPositionIndex = previousPositionIndex;
    }

    /**
     * Performs operations related to token placement.
     * @returns The updated board after token placement.
     */
    execute(): Board {
        if (this.placeToken()) {
            if (this.getBoard().checkMill(this.positionIndex, true)) {
                this.getBoard().incrementGamePhase();
            } else {
                this.getBoard().switchPlayingTeam();
            }
            return this.getBoard();
        }
        return undefined;
    }

    /**
     * Places a token on the board at position index.
     * @returns true if the token placement was successful, false otherwise.
     */
    private placeToken(): boolean {
        let position = this.getBoard().getPositions()[this.positionIndex];
        let pickUpPosition = undefined;
        if (this.pickUpPositionIndex != undefined) {
            pickUpPosition = this.getBoard().getPositions()[this.pickUpPositionIndex];
        }
        let currentTeam = this.getBoard().getPlayingTeam();
        let currentPlayer = currentTeam.getPlayer();

        // if this place token action is a part of moving a token
        if (pickUpPosition) {
            // place the picked up token if the specified position is unoccupied and is a neighbour or if the playing team has 3 or less alive tokens left
            if (position.getPlayer() == undefined && (pickUpPosition.isNeighbour(this.positionIndex) || currentTeam.getNumAliveTokens() <= 3)) {
                position.placeToken(currentPlayer);
                currentTeam.placeToken();
                return true;
            }
        } else {
            // place the new token if the specified position is unoccupied
            if (position.getPlayer() == undefined) {
                position.placeToken(currentPlayer);
                currentTeam.placeToken();
                return true;
            }
        }

        return false;
    }
}
