import { Player } from './enums/Player.js';
import { Direction } from './enums/Direction.js';
import { Orientation } from './enums/Orientation.js';


/**
 * This class represents a position on the board.
 */
export class Position {
    /**
     * The player that occupies this position.
     */
    private player?: Player;

    /**
     * The neighbour position above this position.
     */
    private upNode?: Position;

    /**
     * The neighbour position below this position.
     */
    private downNode?: Position;

    /**
     * The neighbour position to the left of this position.
     */
    private leftNode?: Position;

    /**
     * The neighbour position to the right of this position.
     */
    private rightNode?: Position;

    /**
     * The index of this position, ranges from 0-23 inclusive.
     */
    private index: number;

    /**
     * The number of mills that this position is part of.
     */
    private millCounter: number;

    /**
     * Constructs a position.
     * @param player The player that occupies this position.
     * @param index The index of this position.
     */
    constructor(player: Player, index: number) {
        this.player = player;
        this.index = index;
        this.millCounter = 0;
    }

    /**
     * Sets the neighbour position at the specified direction.
     * @param direction The direction of the neighbour position.
     * @param neighbour The neighbour position.
     */
    setNeighbour(direction: Direction, neighbour: Position): void {
        switch (direction) {
            case Direction.Up:
                this.upNode = neighbour;
                break;
            case Direction.Down:
                this.downNode = neighbour;
                break;
            case Direction.Left:
                this.leftNode = neighbour;
                break;
            case Direction.Right:
                this.rightNode = neighbour;
                break;
        }
    }

    /**
     * Gets the player that occupies this position.
     * @returns The player that occupies this position, or undefined if position not occupied.
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * Gets this position's neighbour at the specified direction.
     * @returns The specified neighbour position, or undefined if no neighbour.
    */
    getNeighbour(direction: Direction): Position {
        switch (direction) {
            case Direction.Up:
                return this.upNode;
            case Direction.Down:
                return this.downNode;
            case Direction.Left:
                return this.leftNode;
            case Direction.Right:
                return this.rightNode;
        }
    }

    /**
     * Determines whether the token at this position is stuck (all adjacent positions are occupied).
     * @returns true if the token at this position is stuck, false otherwise.
     */
    isStuck(): boolean {
        if (this.getNeighbour(Direction.Up)) {
            if (this.getNeighbour(Direction.Up).getPlayer() == undefined) {
                return false;
            }
        }
        if (this.getNeighbour(Direction.Down)) {
            if (this.getNeighbour(Direction.Down).getPlayer() == undefined) {
                return false;
            }
        }
        if (this.getNeighbour(Direction.Left)) {
            if (this.getNeighbour(Direction.Left).getPlayer() == undefined) {
                return false;
            }
        }
        if (this.getNeighbour(Direction.Right)) {
            if (this.getNeighbour(Direction.Right).getPlayer() == undefined) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determines whether the position at the specified index is a neighbour of this position.
     * @param index The index of the position to check for.
     * @returns true if the specified position index is a neighbour, false otherwise.
     */
    isNeighbour(index: number): boolean {
        if (this.getNeighbour(Direction.Up)) {
            if (this.getNeighbour(Direction.Up).getIndex() == index) {
                return true;
            }
        }
        if (this.getNeighbour(Direction.Down)) {
            if (this.getNeighbour(Direction.Down).getIndex() == index) {
                return true;
            }
        }
        if (this.getNeighbour(Direction.Left)) {
            if (this.getNeighbour(Direction.Left).getIndex() == index) {
                return true;
            }
        }
        if (this.getNeighbour(Direction.Right)) {
            if (this.getNeighbour(Direction.Right).getIndex() == index) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the index of this position.
     * @returns The index of this position.
     */
    getIndex(): number {
        return this.index;
    }

    /**
     * Gets the number of mills this position is part of.
     * @returns The number of mills this position is part of.
     */
    getMillCounter(): number {
        return this.millCounter;
    }

    /**
     * Places a player's token onto this position.
     * @param player The player that occupies this position.
     */
    placeToken(player: Player): void {
        this.player = player;
    }

    /**
     * Removes a player's token from this position.
     */
    removeToken(): void {
        this.player = undefined;
    }

    /**
     * Checks whether this position is part of a mill.
     * @returns The orientation of the mill this position is part of, otherwise undefined if not part of a mill.
     */
    checkMill(): Orientation {
        let verticalMillFormed = (this.getConsecutiveTokenCount(Direction.Up) + this.getConsecutiveTokenCount(Direction.Down) == 2);
        let horizontalMillFormed = (this.getConsecutiveTokenCount(Direction.Left) + this.getConsecutiveTokenCount(Direction.Right) == 2);

        if (verticalMillFormed && horizontalMillFormed) {
            return Orientation.Both;
        }
        else if (verticalMillFormed) {
            return Orientation.Vertical;
        }
        else if (horizontalMillFormed) {
            return Orientation.Horizontal;
        }
        else {
            return undefined;
        }
    }

    /**
     * Gets the number of consecutive neighbouring tokens that belong to the same player in the specified direction.
     * @param direction The direction in which to check for consecutive tokens.
     * @returns The number of consecutive tokens in the specified direction.
     */
    private getConsecutiveTokenCount(direction: Direction): number {
        let neighbour = this.getNeighbour(direction);
        if (neighbour && neighbour.getPlayer() == this.getPlayer()) {
            let counter = neighbour.getConsecutiveTokenCount(direction);
            return counter += 1;
        }
        return 0;
    }

    /**
     * Updates the mill counter of neighbour positions in the specified orientation.
     * @param orientation The orientation of neighbour positions to update the mill counter in.
     * @param millAdded Indicates whether a mill is added in this position.
     */
    updateMillCounterOrientation(orientation: Orientation, millAdded: boolean): void {
        this.updateMillCounter(millAdded);
        switch (orientation) {
            case Orientation.Vertical:
                this.updateMillCounterDirection(Direction.Up, millAdded);
                this.updateMillCounterDirection(Direction.Down, millAdded);
                break;
            case Orientation.Horizontal:
                this.updateMillCounterDirection(Direction.Left, millAdded);
                this.updateMillCounterDirection(Direction.Right, millAdded);
                break;
            case Orientation.Both:
                this.updateMillCounterDirection(Direction.Up, millAdded);
                this.updateMillCounterDirection(Direction.Down, millAdded);
                this.updateMillCounterDirection(Direction.Left, millAdded);
                this.updateMillCounterDirection(Direction.Right, millAdded);
                break;
            default:
                break;
        }
    }

    /**
     * Updates the mill counter of neighbour positions in the specified direction.
     * @param direction The direction of neighbour positions to update the mill counter in.
     * @param millAdded Indicates whether a mill is added in this position.
     */
    private updateMillCounterDirection(direction: Direction, millAdded: boolean): void {
        let neighbour = this.getNeighbour(direction);
        if (neighbour) {
            neighbour.updateMillCounter(millAdded);
            neighbour.updateMillCounterDirection(direction, millAdded);
        }

    }

    /**
     * Updates the mill counter of this position.
     * @param millAdded Indicates whether a mill is added in this position.
     */
    private updateMillCounter(millAdded: boolean): void {
        if (millAdded) {
            this.millCounter += 1;
        } else {
            this.millCounter -= 1;
        }
    }

    /**
     * Turns the current Position object into JSON.
     * @returns JSON object of this Position object.
     */
    toJSON(): any {
        return {
            player: this.getPlayer(),
        };
    }
}
