const chai = require("chai");
const assert = chai.assert;

const validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

const solution =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

const indexToRowCol = (index) => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  return { row, col };
};

const Solver = require("../controllers/sudoku-solver.js");
const solver = new Solver();

suite("Unit Tests", () => {
  test("valid puzzle string", (done) => {
    assert.equal(solver.validate(validPuzzle), true);
    done();
  });

  test("invalid characters", (done) => {
    const puzzle =
      "!.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.validate(puzzle), false);
    done();
  });

  test("incorrect length", (done) => {
    const puzzle = "1.5..2.84..";
    assert.equal(solver.validate(puzzle), false);
    done();
  });

  test("valid row placement", (done) => {
    const index = validPuzzle.indexOf(".");
    const { row, col } = indexToRowCol(index);
    const value = solution[index];
    assert.equal(solver.checkRowPlacement(validPuzzle, row, col, value), true);
    done();
  });

  test("invalid row placement", (done) => {
    const index = 2;
    const { row, col } = indexToRowCol(index);
    const value = "8";
    assert.equal(solver.checkRowPlacement(validPuzzle, row, col, value), false);
    done();
  });

  test("valid column placement", (done) => {
    const index = validPuzzle.indexOf(".");
    const { row, col } = indexToRowCol(index);
    const value = solution[index];
    assert.equal(solver.checkColPlacement(validPuzzle, row, col, value), true);
    done();
  });

  test("invalid column placement", (done) => {
    const index = 2;
    const { row, col } = indexToRowCol(index);
    const value = "9";
    assert.equal(solver.checkColPlacement(validPuzzle, row, col, value), false);
    done();
  });

  test("valid region placement", (done) => {
    const index = validPuzzle.indexOf(".");
    const { row, col } = indexToRowCol(index);
    const value = solution[index];
    assert.equal(
      solver.checkRegionPlacement(validPuzzle, row, col, value),
      true
    );
    done();
  });

  test("invalid region placement", (done) => {
    const index = 9;
    const { row, col } = indexToRowCol(index);
    const value = "5";
    assert.equal(
      solver.checkRegionPlacement(validPuzzle, row, col, value),
      false
    );
    done();
  });

  test("solvable puzzle", (done) => {
    assert.equal(solver.solve(validPuzzle), solution);
    done();
  });

  test("unsolvable puzzle", (done) => {
    const unsolvablePuzzle = validPuzzle.replace("5", "6");
    assert.equal(solver.solve(unsolvablePuzzle), null);
    done();
  });

  test("complete puzzle", (done) => {
    const completePuzzle = solution;
    assert.equal(solver.solve(completePuzzle), completePuzzle);
    done();
  });
});
