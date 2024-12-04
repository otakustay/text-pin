import {TextPosition, TextRange} from './interface.js';

function isEmpty(range: TextRange) {
    return range.start.line === range.end.line && range.start.character === range.end.character;
}

/**
 * Pin at a certain line, any text modification will reflect to the pined line number
 */
export class LinePin {
    private line: number;

    private broken = false;

    private readonly column: number;

    /**
     * Create a pin from a text position
     *
     * @param line Line number to pin
     * @param lineLength The string length of line
     */
    constructor(line: number, lineLength: number) {
        this.line = line;
        this.column = lineLength;
    }

    /**
     * Indicate a range in the original text is replaced by another text content, try to move the pin
     *
     * @param range The replaced range of text
     * @param text The replacing text
     * @returns The result reflect to edit, either the pin is broken or the new position
     */
    edit(range: TextRange, text: string): void {
        if (this.broken) {
            return;
        }

        if (isEmpty(range)) {
            this.insert(range.start, text);
        }
        else {
            this.modify(range, text);
        }
    }

    /**
     * Whether the pin is broken, a broken pin is that the original line's content is changed
     *
     * @returns A boolean indicating the pin is broken
     */
    isBroken() {
        return this.broken;
    }

    /**
     * Get the current pin number, returns `-1` if broken
     *
     * @returns The line number of the pin, if broken return -1
     */
    getPinLineNumber(): number {
        return this.broken ? -1 : this.line;
    }

    private insert(position: TextPosition, text: string): void {
        // Before line
        if (position.line < this.line) {
            this.move(text.split('\n').length - 1);
            return;
        }

        // After line
        if (position.line > this.line) {
            this.keep();
            return;
        }

        const lines = text.split('\n');

        // At the start of line
        if (position.character === 0) {
            if (lines[lines.length - 1]) {
                this.break();
                return;
            }

            this.move(lines.length - 1);
            return;
        }

        // At the end of line
        if (position.character >= this.column) {
            if (lines[0]) {
                this.break();
                return;
            }

            this.keep();
            return;
        }

        this.break();
    }

    private modify({start, end}: TextRange, text: string): void {
        // Before line
        if (end.line < this.line) {
            const deleted = end.line - start.line;
            const inserted = text.split('\n').length - 1;
            this.move(inserted - deleted);
            return;
        }

        // After line
        if (start.line > this.line) {
            this.keep();
            return;
        }

        // Overlapped
        if (start.line < this.line && end.line > this.line) {
            this.break();
            return;
        }

        if (start.line === this.line) {
            // Intersected on start
            if (start.character < this.column) {
                this.break();
                return;
            }

            // Modified line content
            if (!text.startsWith('\n')) {
                this.break();
                return;
            }

            this.keep();
            return;
        }

        if (end.line === this.line) {
            // Intersected on end
            if (end.character > 0) {
                this.break();
                return;
            }

            /// Modified line content
            if (!text.endsWith('\n')) {
                this.break();
                return;
            }

            const lines = text.split('\n');
            this.move(lines.length - 1 - (end.line - start.line));
            return;
        }

        /* c8 ignore start */
        throw new Error('Unexpected line edit');
        /* c8 ignore stop */
    }

    private keep(): void {
    }

    private move(offset: number): void {
        this.line += offset;
    }

    private break(): void {
        this.broken = true;
    }
}
