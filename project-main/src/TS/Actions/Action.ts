import { Board } from "../Board.js";


/**
 * This is an abstract class for all actions that can be performed on a game board.
 */
export abstract class Action {
    /**
     * The board to perform the action on.
     */
    private board: Board;

    /**
     * Constructs an Action object.
     * @param board The board to perform the action on.
     */
    constructor(board: Board) {
        this.board = board;
    }

    /**
     * Gets the board this action is performing on.
     * @returns The board this action is performing on.
     */
    getBoard(): Board {
        return this.board
    }

    /**
     * Performs relevant operations of this action on board.
     */
    abstract execute(): Board;
}
