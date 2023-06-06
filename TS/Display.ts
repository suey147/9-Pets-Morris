import { Game } from "./Game.js";
import { Board } from "./Board.js";
import { Application } from "./Application.js";
import { Player } from "./enums/Player.js";


/**
 * This class represents the application display.
 */
export class Display {
    /**
     * Variables associated with the display canvas and game board dimensions.
     */
    private static readonly CANVAS_WIDTH = window.innerWidth * 0.8;
    private static readonly CANVAS_HEIGHT = window.innerHeight * 0.8;
    private static readonly BOARD_FRAME = Math.min(Display.CANVAS_WIDTH, Display.CANVAS_HEIGHT);

    /**
     * Variables for the game board radius and token size.
     */
    private static readonly NODE_RADIUS = Display.BOARD_FRAME * 0.01;
    private static readonly TOKEN_SIZE = Display.NODE_RADIUS * 10;

    /**
     * Variables for storing the x and y coordinates of all 24 nodes on the game board.
     */
    private static readonly NODE_1 = [Display.BOARD_FRAME * 0.1, Display.BOARD_FRAME * 0.1];
    private static readonly NODE_2 = [Display.BOARD_FRAME * 0.5, Display.BOARD_FRAME * 0.1];
    private static readonly NODE_3 = [Display.BOARD_FRAME * 0.9, Display.BOARD_FRAME * 0.1];

    private static readonly NODE_4 = [Display.BOARD_FRAME * 0.2, Display.BOARD_FRAME * 0.2];
    private static readonly NODE_5 = [Display.BOARD_FRAME * 0.5, Display.BOARD_FRAME * 0.2];
    private static readonly NODE_6 = [Display.BOARD_FRAME * 0.8, Display.BOARD_FRAME * 0.2];

    private static readonly NODE_7 = [Display.BOARD_FRAME * 0.3, Display.BOARD_FRAME * 0.3];
    private static readonly NODE_8 = [Display.BOARD_FRAME * 0.5, Display.BOARD_FRAME * 0.3];
    private static readonly NODE_9 = [Display.BOARD_FRAME * 0.7, Display.BOARD_FRAME * 0.3];

    private static readonly NODE_10 = [Display.BOARD_FRAME * 0.1, Display.BOARD_FRAME * 0.5];
    private static readonly NODE_11 = [Display.BOARD_FRAME * 0.2, Display.BOARD_FRAME * 0.5];
    private static readonly NODE_12 = [Display.BOARD_FRAME * 0.3, Display.BOARD_FRAME * 0.5];
    private static readonly NODE_13 = [Display.BOARD_FRAME * 0.7, Display.BOARD_FRAME * 0.5];
    private static readonly NODE_14 = [Display.BOARD_FRAME * 0.8, Display.BOARD_FRAME * 0.5];
    private static readonly NODE_15 = [Display.BOARD_FRAME * 0.9, Display.BOARD_FRAME * 0.5];

    private static readonly NODE_16 = [Display.BOARD_FRAME * 0.3, Display.BOARD_FRAME * 0.7];
    private static readonly NODE_17 = [Display.BOARD_FRAME * 0.5, Display.BOARD_FRAME * 0.7];
    private static readonly NODE_18 = [Display.BOARD_FRAME * 0.7, Display.BOARD_FRAME * 0.7];

    private static readonly NODE_19 = [Display.BOARD_FRAME * 0.2, Display.BOARD_FRAME * 0.8];
    private static readonly NODE_20 = [Display.BOARD_FRAME * 0.5, Display.BOARD_FRAME * 0.8];
    private static readonly NODE_21 = [Display.BOARD_FRAME * 0.8, Display.BOARD_FRAME * 0.8];

    private static readonly NODE_22 = [Display.BOARD_FRAME * 0.1, Display.BOARD_FRAME * 0.9];
    private static readonly NODE_23 = [Display.BOARD_FRAME * 0.5, Display.BOARD_FRAME * 0.9];
    private static readonly NODE_24 = [Display.BOARD_FRAME * 0.9, Display.BOARD_FRAME * 0.9];

    /**
     * An array of all 24 game board nodes' coordinates.
     */
    private static readonly NODES = [
        Display.NODE_1, Display.NODE_2, Display.NODE_3, Display.NODE_4, Display.NODE_5, Display.NODE_6,
        Display.NODE_7, Display.NODE_8, Display.NODE_9, Display.NODE_10, Display.NODE_11, Display.NODE_12,
        Display.NODE_13, Display.NODE_14, Display.NODE_15, Display.NODE_16, Display.NODE_17, Display.NODE_18,
        Display.NODE_19, Display.NODE_20, Display.NODE_21, Display.NODE_22, Display.NODE_23, Display.NODE_24
    ];

    /**
     * The singleton instance of the Display class.
     */
    private static displayInstance: Display;

    /**
     * Constructs a new display.
     */
    private constructor() { }

    /**
     * Gets the instance of the display.
     * @returns The instance of the display.
     */
    static getInstance(): Display {
        if (Display.displayInstance == null) {
            Display.displayInstance = new Display();
        }
        return Display.displayInstance;
    }

    /**
     * Shows the list of all previous games.
     * @param gameList The list of games to display.
     */
    showGameList(gameList: Game[]): void {
        const gameListElement = document.getElementById('gameList');
        gameListElement.innerHTML = "";

        if (gameList.length == 0) {
            gameListElement.innerHTML = "No previous games available, please start a new game.";
        }

        // display each saved game in a list
        gameList.forEach((game, index) => {
            gameListElement.innerHTML += `<li id="${index}">` + game.getName() + `</li>`;
        });

        // set up listener for each game list item
        for (let index = 0; index < gameList.length; index++) {
            document.getElementById(`${index}`).addEventListener("click", function () {
                Application.getInstance().loadGame(index);
            });
        }

        // set up start new game button listener
        const startNewGameButton = document.getElementById("startNewGame");
        startNewGameButton.removeEventListener('click', function () { Application.getInstance().startNewGame(); });
        startNewGameButton.addEventListener('click', function () { Application.getInstance().startNewGame(); });

        // set up download data.txt button listener
        const downloadGSButton = document.getElementById("download");
        downloadGSButton.removeEventListener('click', function () { Application.getInstance().downloadGS(); });
        downloadGSButton.addEventListener('click', function () { Application.getInstance().downloadGS(); });
    }

    /**
     * Shows the game board.
     * @param game The game currently being displayed.
     * @param board The game board to display.
     * @param lastBoard Whether the board to be displayed is the last board/turn of the game.
     */
    showBoard(game: Game, board: Board, lastBoard?: boolean): void {
        const context = this.setUpCanvas();
        this.drawNodes(context);
        this.drawHorizontalLines(context);
        this.drawVerticalLines(context);
        this.displayGameInfo(board);
        this.detectNodeClick(lastBoard ?? false);
        this.setUpButtonListeners(game);

        // add tokens at the correct positions
        for (let i = 0; i < Display.NODES.length; i++) {
            const node = Display.NODES[i];
            switch (board.getPositionTeam(i)) {
                case Player.Cat:
                    this.addTokenImage(context, node[0], node[1], Player.Cat);
                    break;
                case Player.Dog:
                    this.addTokenImage(context, node[0], node[1], Player.Dog);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Sets up the canvas to display the game board.
     * @returns The canvas context.
     */
    private setUpCanvas(): CanvasRenderingContext2D {
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        const context = canvas.getContext('2d');

        context.canvas.width = Display.BOARD_FRAME;
        context.canvas.height = Display.BOARD_FRAME;
        context.fillStyle = 'black';
        context.strokeStyle = 'black';
        context.lineWidth = 3;

        return context;
    }

    /**
     * Draws all nodes of the game board.
     * @param context The canvas context to draw on.
     * @param board The game board to display.
     */
    private drawNodes(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < Display.NODES.length; i++) {
            const node = Display.NODES[i];
            context.beginPath();
            context.arc(node[0], node[1], Display.NODE_RADIUS, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
        }
    }

    /**
     * Draws all horizontal lines of the game board.
     * @param context The canvas context to draw on.
     */
    private drawHorizontalLines(context: CanvasRenderingContext2D): void {
        for (let i = 0; i < Display.NODES.length - 1; i++) {
            const startNode = Display.NODES[i];
            const endNode = Display.NODES[i + 1];

            context.beginPath();
            context.moveTo(startNode[0], startNode[1]);
            context.lineTo(endNode[0], endNode[1]);
            context.stroke();

            if (i % 3 == 1) {
                i += 1;
            }
        }
    }

    /**
     * Draws all vertical lines of the game board.
     * @param context The canvas context to draw on.
     */
    private drawVerticalLines(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.moveTo(Display.NODE_1[0], Display.NODE_1[1]);
        context.lineTo(Display.NODE_22[0], Display.NODE_22[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_4[0], Display.NODE_4[1]);
        context.lineTo(Display.NODE_19[0], Display.NODE_19[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_7[0], Display.NODE_7[1]);
        context.lineTo(Display.NODE_16[0], Display.NODE_16[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_9[0], Display.NODE_9[1]);
        context.lineTo(Display.NODE_18[0], Display.NODE_18[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_6[0], Display.NODE_6[1]);
        context.lineTo(Display.NODE_21[0], Display.NODE_21[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_3[0], Display.NODE_3[1]);
        context.lineTo(Display.NODE_24[0], Display.NODE_24[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_2[0], Display.NODE_2[1]);
        context.lineTo(Display.NODE_8[0], Display.NODE_8[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_2[0], Display.NODE_2[1]);
        context.lineTo(Display.NODE_8[0], Display.NODE_8[1]);
        context.stroke();

        context.beginPath();
        context.moveTo(Display.NODE_17[0], Display.NODE_17[1]);
        context.lineTo(Display.NODE_23[0], Display.NODE_23[1]);
        context.stroke();
    }

    /**
     * Displays the current game state information.
     * @param board The board representing the current game state/turn to display.
     */
    private displayGameInfo(board: Board): void {
        let catTeam = board.getTeam(Player.Cat);
        let catAliveTokenCount = catTeam.getNumAliveTokens();
        let catUnplacedTokenCount = catTeam.getNumUnplacedTokens();

        let dogTeam = board.getTeam(Player.Dog);
        let dogAliveTokenCount = dogTeam.getNumAliveTokens();
        let dogUnplacedTokenCount = dogTeam.getNumUnplacedTokens();

        // update the HTML elements with the game state information
        switch (board.getGamePhase()) {
            case 0:
                document.getElementById("moveMessage").innerHTML = `Pick up one of your tokens.`;
                break;
            case 1:
                document.getElementById("moveMessage").innerHTML = `Place your token.`;
                break;
            case 2:
                document.getElementById("moveMessage").innerHTML = `Remove an opponent's token!`;
                break;
            default:
                document.getElementById("moveMessage").innerHTML = ``;
                break;
        }
        document.getElementById("currentTurnImage").innerHTML = `<img class="currentTurnImage" src="assets/${Player[board.getPlayingTeam().getPlayer()].toLowerCase()}.png">`;

        document.getElementById("catAliveTokens").innerHTML = `Alive Tokens: ${catAliveTokenCount}`;
        document.getElementById("catUnplacedTokens").innerHTML = `Unplaced Tokens: ${catUnplacedTokenCount}`;
        document.getElementById("dogAliveTokens").innerHTML = `Alive Tokens: ${dogAliveTokenCount}`;
        document.getElementById("dogUnplacedTokens").innerHTML = `Unplaced Tokens: ${dogUnplacedTokenCount}`;
    }

    /**
     * Detects whether a game board node is clicked and triggers an action.
     * @param lastBoard Whether the board to be displayed is the last board/turn of the game.
     */
    private detectNodeClick(lastBoard: boolean): void {
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        const context = canvas.getContext('2d');

        // set onclick function for the canvas
        canvas.onclick = function (e) {
            var rect = canvas.getBoundingClientRect(),  // get absolute position of canvas
                x = e.clientX - rect.left,              // adjust mouse-position
                y = e.clientY - rect.top;

            // iterate through all nodes and check if the clicked point is within a node
            for (let i = 0; i < Display.NODES.length; i++) {
                const node = Display.NODES[i];
                getArc(context, node[0], node[1], Display.NODE_RADIUS * 2);

                // trigger an action on the current game if it is not displaying the last board/turn of the game
                if (context.isPointInPath(x, y) && !lastBoard) {
                    Application.getInstance().getCurrentGame().action(Display.getInstance(), i, false);
                }
            }
        }

        /**
         * Draws an arc on the canvas context at the given x and y coordinates with the specified radius.
         * @param context The canvas contex to draw the arc on.
         * @param x The x-coordinate of the center of the arc.
         * @param y The y-coordinate of the center of the arc.
         * @param r The radius of the arc.
         */
        function getArc(context: CanvasRenderingContext2D, x: number, y: number, r: number) {
            context.beginPath();
            context.arc(x, y, r, 0, Math.PI * 2);
            context.closePath();
        }
    }

    /**
     * Sets up event listeners for the exit and undo buttons.
     * @param game The game currently being displayed. 
     */
    private setUpButtonListeners(game: Game): void {
        const exitButton = document.getElementById('exit') as HTMLButtonElement;
        const saveButton = document.getElementById('save') as HTMLButtonElement;
        const undoButton = document.getElementById('undo') as HTMLButtonElement;

        // disable the undo button if no previous moves available
        if (game.getBoardHistory().length > 1) {
            undoButton.disabled = false;
        } else {
            undoButton.disabled = true;
        }

        exitButton.removeEventListener('click', this.exitButtonClickHandler);
        this.exitButtonClickHandler = () => {
            game.exit();
        };
        exitButton.addEventListener('click', this.exitButtonClickHandler);

        saveButton.removeEventListener('click', this.saveButtonClickHandler);
        this.saveButtonClickHandler = () => {
            game.save();
        };
        saveButton.addEventListener('click', this.saveButtonClickHandler);

        undoButton.removeEventListener('click', this.undoButtonClickHandler);
        this.undoButtonClickHandler = () => {
            game.undo(this);
        };
        undoButton.addEventListener('click', this.undoButtonClickHandler);
    }

    private exitButtonClickHandler: () => void = () => { };
    private saveButtonClickHandler: () => void = () => { };
    private undoButtonClickHandler: () => void = () => { };

    /**
     * Adds a token image to the specified canvas context at the given (x, y) position for the given player.
     * @param context The canvas rendering context to draw the image onto.
     * @param x The x-coordinate to add the token image at.
     * @param y The y-coordinate to add of the token image at.
     * @param player The player whose token image should be drawn.
     */
    private addTokenImage(context: CanvasRenderingContext2D, x: number, y: number, player: Player): void {
        const image = new Image();
        switch (player) {
            case (Player.Cat):
                image.src = "./assets/cat.png";
                break;
            case (Player.Dog):
                image.src = "./assets/dog.png";
                break;
            default:
                break;
        }

        image.onload = function () {
            context.drawImage(image, x - Display.TOKEN_SIZE * 0.5, y - Display.TOKEN_SIZE * 0.5, Display.TOKEN_SIZE, Display.TOKEN_SIZE);
        }
    }

    /**
     * Updates the UI to display the victory of the specific player.
     * @param player The winning player.
     */
    showVictory(player: Player): void {
        document.getElementById("moveMessage").innerHTML = `${Player[player]} Wins!`;
    }
}
