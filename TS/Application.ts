import { Game } from "./Game.js"
import { Display } from "./Display.js";
import { Board } from "./Board.js";
import { Team } from "./Team.js";
import { Position } from "./Position.js";


/**
 * This class represents an Application that manages and load previously played games and starts new games.
 */
export class Application {
    /**
     * An array of Game objects that have been previously played/created.
     */
    private gameList: Game[];

    /**
     * The Game object that is currently being played.
     */
    private currentGame?: Game;

    /**
     * The Display object used to handle the user interface.
     */
    private display: Display;

    /**
     * The singleton instance of the Application class.
     */
    private static applicationInstance: Application;

    /**
     * A boolean indicating whether the application is currently showing the menu page or the game page.
     */
    showingMenu: Boolean = true;

    /**
     * Constructs a new application with an empty game list and a Display object.
     */
    private constructor() {
        this.gameList = [];
        this.display = Display.getInstance();
    }

    /**
     * Returns the singleton instance of the Application class, creating it if necessary.
     * @returns The singleton instance of the Application class.
     */
    static getInstance(): Application {
        if (Application.applicationInstance == null) {
            Application.applicationInstance = new Application();
        }
        return Application.applicationInstance;
    }

    /**
     * Gets the Game object that is currently being played.
     * @returns The current Game object, or undefined if no game is currently being played.
     */
    getCurrentGame(): Game {
        return this.currentGame;
    }

    /**
     * Starts a new game.
     */
    startNewGame(): void {
        const newGameIndex = this.gameList.length;
        this.loadGame(newGameIndex);
    }

    /**
     * Loads the game specified by gameIndex from the gameList.
     * @param gameIndex The index of the game to be loaded from the gameList.
     */
    loadGame(gameIndex: number): void {
        localStorage.setItem("currentGameIndex", gameIndex.toString());
        window.location.href = '/game';
    }

    /**
     * Loads games from the TXT data file.
     */
    loadFromFile(): void {
        fetch('/load')
            .then(response => response.json())
            .then(data => {
                var gameIndexCounter = 0;
                data.forEach(game => {
                    const gameName = game.name;
                    const boards = game.data.split('\r');
                    const boardHist: Board[] = [];

                    boards.forEach(board => {
                        if (board.trim() === '') return;
                        const gameData = JSON.parse(board);

                        const loadedTeams: Team[] = gameData.teams ? gameData.teams.map((teamData) => {
                            if (teamData) {
                                return new Team(teamData.player, teamData.numUnplacedTokens, teamData.numAliveTokens);
                            } else {
                                return new Team(0, 9, 9);
                            }
                        }) : [];
                        const loadedCurrentPlayer = gameData.currentPlayer;
                        const loadedgamePhase = gameData.gamePhase;
                        const loadedPosition: Position[] = gameData.positions ? gameData.positions.map((positionData, index) => {
                            const player = positionData.player !== undefined && positionData.player !== '' ? positionData.player : undefined;
                            return new Position(player, index);
                        }
                        ) : [];

                        const loadedBoard = new Board(loadedTeams, loadedCurrentPlayer, loadedPosition, loadedgamePhase);
                        boardHist.push(loadedBoard);
                    });

                    const loadedGame = new Game(boardHist, gameIndexCounter, boardHist[-1], gameName);
                    this.gameList.push(loadedGame);
                    gameIndexCounter++;
                });

                console.log("Loaded game list from file");
                console.log(this.gameList);

                this.loadApplication();
            })
            .catch(error => {
                console.error('Error loading game data:', error);
            });
    }

    /**
     * Loads the application to show either the menu page or the game page.
     */
    private loadApplication(): void {
        if (this.showingMenu) {
            this.display.showGameList(this.gameList);
        } else {
            const currentGameIndex = localStorage.getItem("currentGameIndex");
            if (Number(currentGameIndex) >= this.gameList.length) {
                this.createNewGame(Number(currentGameIndex));
            }
            this.currentGame = this.gameList[currentGameIndex];
            this.currentGame.run(this.display);
            console.log(`Loaded Game\n  Index: ${currentGameIndex}\n  Name: ${this.currentGame.getName()}`);
        }
    }

    /**
     * Creates a new with an empty board and two teams (Cat and Dog by default).
     */
    private createNewGame(currentGameIndex?: number): void {
        const boardHistory: Board[] = [];
        boardHistory.push(new Board());
        var newGame = new Game(boardHistory);
        if (currentGameIndex) {
            newGame = new Game(boardHistory, currentGameIndex);
        }

        this.gameList.push(newGame);
    }

    downloadGS():void {
        const fileName = "data.txt"
        fetch('/download')
          .then(response => {
            if (!response.ok) {
                throw new Error('Error while downloading the file');
              }
              return response.blob();
            })
          .then(content => {
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
      
            document.body.appendChild(link);
            link.click();
      
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
          })
          .catch(error => {
            console.error('Error while downloading the file:', error);
          });
    }
}


// get the application instance
const application = Application.getInstance();

// get the current URL
const currentURL = window.location.href;

// load the application with either the menu page or the game page
if (currentURL.includes("/game")) {
    application.showingMenu = false;
} else if (currentURL.includes("/")) {
    application.showingMenu = true;
}
application.loadFromFile();
console.log("Current game index: " + localStorage.getItem("currentGameIndex"));
