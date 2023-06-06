import { Board } from "./Board.js"
import { Display } from "./Display.js";
import { PlaceTokenAction } from "./Actions/PlaceTokenAction.js"
import { RemoveTokenAction } from "./Actions/RemoveTokenAction.js"


/**
 * Implement a game and allows the game to be played.
 */
export class Game {
    /**
     * An array of boards representing previous turns/states of the game.
     */
    private boardHistory: Board[];

    /**
     * The board representing the current turn/state of the game.
     */
    private currentBoard: Board;

    /**
     * The name of the game.
     */
    private name: String;

    /**
     * The index of the game in the game list.
     * If it is a new game, it is undefined
     */
    private gameIndex?: number;

    /**
     * Contructs a game with the specified board history.
     * @param boardHistory An array of previous boards.
     * @param currentBoard The current board of the game.
     */
    constructor(boardHistory: Board[], gameIndex?: number, currentBoard?: Board, name?: String) {
        this.boardHistory = boardHistory;
        let topBoard = this.boardHistory[this.boardHistory.length - 1];
        topBoard = new Board(topBoard.getTeams(), topBoard.getCurrentPlayer(), topBoard.getPositions(), topBoard.getGamePhase())
        this.currentBoard = currentBoard ?? topBoard;
        this.name = name;
        this.gameIndex = gameIndex;
    }

    /**
     * Gets the board history of the game.
     * @returns The array of all previous boards of the game.
     */
    getBoardHistory(): Board[] {
        return this.boardHistory;
    }

    /**
     * Gets the name of the game.
     * @returns The game name.
     */
    getName(): String {
        return this.name
    }

    /**
     * Runs the game and updates the display continuosly until a victory condition is met.
     * @param display The Display object used to show the game.
     */
    run(display: Display): void {
        display.showBoard(this, this.currentBoard);
    }

    /**
     * Executes an action on the game board and adds the resulting board to the board history.
     * @param display The Display object used to show the game.
     * @param index The position index to execute the action on.
     * @param isUndoing Indicates whether this is an undoing action.
     */
    action(display: Display, index: number, isUndoing: boolean): void {
        if (isUndoing) {
            this.undo(display);
        } else {
            this.performAction(index);
        }

        if (this.checkVictory(this.currentBoard) && this.currentBoard.getGamePhase() != 1) {
            display.showBoard(this, this.currentBoard, true);
            display.showVictory(this.currentBoard.getNonPlayingTeam().getPlayer());
        } else {
            display.showBoard(this, this.currentBoard);
        }
    }

    /**
     * Performs the correct action at the specified index based on the game phase.
     * @param index The position index to perform the action on.
     */
    private performAction(index: number): void {
        let updatedBoard: Board;
        switch (this.currentBoard.getGamePhase()) {
            // pick up token
            case 0:
                let moveTokenAction = new RemoveTokenAction(this.currentBoard, index, true);
                updatedBoard = moveTokenAction.execute();
                if (updatedBoard) {
                    this.updateBoard();
                }
                break;
            // place token
            case 1:
                if (index != this.currentBoard.getPickUpPositionIndex()) {
                    let placeTokenAction = new PlaceTokenAction(this.currentBoard, index, this.currentBoard.getPickUpPositionIndex());
                    updatedBoard = placeTokenAction.execute();
                    if (updatedBoard) {
                        this.updateBoard();
                    }
                }
                break;
            // remove token
            case 2:
                let removeTokenAction = new RemoveTokenAction(this.currentBoard, index, false);
                updatedBoard = removeTokenAction.execute();
                if (updatedBoard) {
                    this.currentBoard.switchPlayingTeam();
                    this.updateBoard();
                }
                break;
            default:
                break;
        }
    }

    /**
     * Adds the latest board to the board history and updates the current board.
     */
    private updateBoard(): void {
        this.boardHistory.push(this.currentBoard);
        this.currentBoard = new Board(this.currentBoard.getTeams(), this.currentBoard.getCurrentPlayer(), this.currentBoard.getPositions(), this.currentBoard.getGamePhase());
    }

    /**
     * Undoes the previous move and updates the display to reflect the previous game state/turn.
     * @param display The Display object used to show the game board.
     * @param gameIndex The index of the currently playing game.
     */
    undo(display: Display): void {
        if (this.boardHistory.length > 1) {
            this.boardHistory.pop();
            let topBoard = this.boardHistory[this.boardHistory.length - 1];
            this.currentBoard = new Board(topBoard.getTeams(), topBoard.getCurrentPlayer(), topBoard.getPositions(), topBoard.getGamePhase());
        }
        display.showBoard(this, this.currentBoard);
    }

    /**
     * Exits the game.
     */
    exit(): void {
        const confirmExit = confirm('Are you sure you want to exit the game without saving it?');
        if (confirmExit) {
            window.location.href = '/';
        }
    }

    /**
     * Saves the game.
     */
    save(): void {
        console.log(`Saving Game\n  Index: ${this.gameIndex}\n  Name: ${this.name}`);

        // ask user for saving game as previous game or new game only if the game is not a new game
        if (this.name) {
            var isSaveAsNewGame = prompt('Do you want to save this game as a new game? (Y/N)');
            var validResponse = ['Y', 'y', 'Yes', 'yes', 'N', 'n', 'No', 'no'];
            while (!validResponse.includes(isSaveAsNewGame)) {
                if (isSaveAsNewGame == null) {
                    return;
                }
                isSaveAsNewGame = prompt('Do you want to save this game as a new game? (Y/N)');
            }

            if (isSaveAsNewGame == 'N' || isSaveAsNewGame == 'n' || isSaveAsNewGame == 'No' || isSaveAsNewGame == 'no') {
                this.saveToFile(this.name, this.gameIndex);
                window.location.href = '/';
                return;
            }
        }


        // ask user for the game name
        var gameName = prompt('Enter the game name:');

        // validate game name before saving
        while (gameName != null && gameName.length == 0) {
            alert("Please enter a game name.");
            gameName = prompt('Enter the game name:');
        }

        // if user did not cancel entering a name
        if (gameName) {
            this.saveToFile(gameName);
            window.location.href = '/';
        }
    }

    /**
     * Saves the game to the data file.
     * @param gameName The name of the game.
     */
    async saveToFile(gameName: String, gameIndex?: number): Promise<void> {
        const boardHistoryData = this.boardHistory.map((board) => board.toJSON());
        const boardStrings = boardHistoryData.map((boardData) => JSON.stringify(boardData));
        const requestBody = boardStrings.join('\n') + '\n';
        const newRequestBody = gameName + '\n' + requestBody;
        console.log(requestBody);

        let requestUrl = '/save';

        // If gameIndex is defined, it is sent through. If it is not, it is sent as -1 to indicate to push the game
        if (gameIndex !== undefined) {
            requestUrl += `?gameIndex=${gameIndex}`;
        } else {
            requestUrl += `?gameIndex=-1`;
        }

        console.log("Client executes request:\n" + requestUrl);

        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: newRequestBody,
        });

        if (response.ok) {
            console.log('Data saved successfully');
        } else {
            console.error('Error saving data:', response.status);
        }
    }


    /**
     * Checks if a victory condition of the game has been met.
     * @param currentBoard The board representing the current game state/turn.
     * @returns true if a victory condition has been met, false otherwise.
     */
    checkVictory(currentBoard: Board): boolean {
        let currentTeam = currentBoard.getPlayingTeam();

        // current team loses if it has less than 3 alive tokens
        if (currentTeam.getNumAliveTokens() < 3) {
            return true;
        }

        // current team is still in the game if it has not placed all its tokens
        if (currentTeam.getNumUnplacedTokens() > 0) {
            return false;
        }

        let unableToMove = true;
        for (let i = 0; i < this.currentBoard.getPositions().length; i++) {
            let currentPosition = this.currentBoard.getPositions()[i];
            // current team is still in the game if it has at least 1 position that is not stuck
            if (currentPosition.getPlayer() == this.currentBoard.getPlayingTeam().getPlayer() && !currentPosition.isStuck()) {
                unableToMove = false;
                break;
            }
        }

        return unableToMove;
    }
}
