class SudokuSolver {
  validate(puzzleString) {
    const regex = /^[1-9.]{81}$/;
    return regex.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    const end = start + 9;
    const rowString = puzzleString.slice(start, end);
    return !rowString.includes(value) || rowString[column] === value;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colString = puzzleString
      .split("")
      .filter((_, index) => index % 9 === column)
      .join("");
    return !colString.includes(value) || colString[row] === value;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    let regionString = "";
    for (let r = regionRow; r < regionRow + 3; r++) {
      for (let c = regionCol; c < regionCol + 3; c++) {
        regionString += puzzleString[r * 9 + c];
      }
    }
    return (
      !regionString.includes(value) ||
      regionString[(row % 3) * 3 + (column % 3)] === value
    );
  }

  solve(puzzleString) {
    const solveSudoku = (puzzle) => {
      const emptyIndex = puzzle.indexOf(".");
      if (emptyIndex === -1) return puzzle;

      const row = Math.floor(emptyIndex / 9);
      const column = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle, row, column, value) &&
          this.checkColPlacement(puzzle, row, column, value) &&
          this.checkRegionPlacement(puzzle, row, column, value)
        ) {
          const newPuzzle =
            puzzle.slice(0, emptyIndex) + value + puzzle.slice(emptyIndex + 1);
          const result = solveSudoku(newPuzzle);
          if (result) return result;
        }
      }
      return null;
    };

    return solveSudoku(puzzleString);
  }
}

module.exports = SudokuSolver;
