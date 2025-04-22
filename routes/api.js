"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (!coordinate.match(/^[A-I][1-9]$/)) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!value.match(/^[1-9]$/)) {
      return res.json({ error: "Invalid value" });
    }

    const row = coordinate.charCodeAt(0) - 65;
    const col = parseInt(coordinate[1]) - 1;
    const validRow = solver.checkRowPlacement(puzzle, row, col, value);
    const validCol = solver.checkColPlacement(puzzle, row, col, value);
    const validRegion = solver.checkRegionPlacement(puzzle, row, col, value);
    const conflicts = [
      validRow ? null : "row",
      validCol ? null : "column",
      validRegion ? null : "region",
    ].filter((conflict) => conflict !== null);
    const result = {
      valid: conflicts.length === 0,
    };
    if (conflicts.length > 0) {
      result.conflict = conflicts;
    }
    return res.json(result);
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    const solution = solver.solve(puzzle);
    if (!solution) {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    return res.json({ solution });
  });
};
