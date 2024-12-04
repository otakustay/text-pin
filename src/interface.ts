export interface TextPosition {
    line: number;
    character: number;
}

export interface TextRange {
    start: TextPosition;
    end: TextPosition;
}
