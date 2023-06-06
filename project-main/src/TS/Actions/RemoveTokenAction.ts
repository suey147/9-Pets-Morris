import { Action } from "./Action.js";
import { Board } from "../Board.js";


/**
 * This class implements the remove token action that can be performed on a game board.
 */
export class RemoveTokenAction extends Action {
    /**
     * The position index on the board to remove the token from.
     */
    private positionIndex: number;

    /**
     * Indicates whether it is moving the palyer's own token (true) or removing oponent's token (false).
     */
    private movingOwnToken: boolean;

    /**
     * Constructs a remove token action.
     * @param board The board to perform this place token action on.
     * @param positionIndex The position index to remove the token from.
     * @param movingOwnToken Indicates whether it is moving the palyer's own token.
     */
    constructor(board: Board, positionIndex: number, movingOwnToken: boolean) {
        super(board);
        this.positionIndex = positionIndex;
        this.movingOwnToken = movingOwnToken;
    }

    /**
     * Performs operations related to token removal.
     * @returns The updated board after token removal.
     */
    execute(): Board {
        if (this.removeToken()) {
            this.getBoard().incrementGamePhase();
            this.getBoard().setPickUpPosition(this.positionIndex);
            return this.getBoard();
        }
        return undefined;
    }

    /**
     * Removes the token at position index from the board.
     * @returns true if the token removal was successful, false otherwise.
     */
    private removeToken(): boolean {
        let position = this.getBoard().getPositions()[this.positionIndex];
        let positionPlayer = position.getPlayer();
        let playingTeamPlayer = this.getBoard().getPlayingTeam().getPlayer();
        let nonPlayingTeamPlayer = this.getBoard().getNonPlayingTeam().getPlayer();

        // if player is moving their own token from the specified position
        if (this.movingOwnToken) {
            // prohibit the token removal if the specified token does not belong to the player
            if (positionPlayer != playingTeamPlayer) {
                return false;
            }

            // prohibit the token removal if the specified token is stuck
            if (position.isStuck() && (this.getBoard().getPlayingTeam().getNumAliveTokens() > 3)) {
                return false;
            }

            // remove the specified token if it belongs to the player and is not stuck
            position.removeToken();
        }
        // if player is removing an opponent's token after forming a mill
        else {
            // prohibit the token removal if the specified token does not belong to the opponent
            if (positionPlayer != nonPlayingTeamPlayer) {
                return false;
            }

            // if the specified token is part of a mill
            if (this.getBoard().checkMill(this.positionIndex, false)) {
                // check if all of the opponent's tokens are part of a mill
                let allTokenInMill = true;

                for (let i = 0; i < this.getBoard().getPositions().length; i++) {
                    let currentPosition = this.getBoard().getPositions()[i];

                    // check if it is an opponent's token
                    if (currentPosition.getPlayer() == nonPlayingTeamPlayer) {
                        allTokenInMill = this.getBoard().checkMill(i, false);

                        // return false if at least one of the opponent's tokens is not in a mill
                        if (!allTokenInMill) {
                            console.log("Cannot remove this token - it is part of a mill!");
                            return false;
                        }
                    }
                }

                // if all of the opponent's tokens are part of a mill
                if (allTokenInMill) {
                    // remove the opponent's token & decrement the opponent's number of alive tokens
                    position.removeToken();
                    this.getBoard().getNonPlayingTeam().removeToken();
                }
            }
            // if the specified token to remove is not part of a mill
            else {
                // remove the opponent's token & decrement the opponent's number of alive tokens
                position.removeToken();
                this.getBoard().getNonPlayingTeam().removeToken();
            }
        }

        return true;
    }
}
