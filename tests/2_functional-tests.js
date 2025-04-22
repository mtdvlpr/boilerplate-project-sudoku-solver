const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

const solution =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

const indexToRowCol = (index) => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  return { row, col };
};

suite("Functional Tests", () => {
  test("solve a puzzle with valid puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "solution");
        assert.equal(res.body.solution, solution);
        done();
      });
  });

  test("solve missing puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  test("solve invalid characters in puzzle string", (done) => {
    const invalidPuzzle = validPuzzle.replace(/\./g, "a");
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("solve incorrect length of puzzle string", (done) => {
    const invalidPuzzle = validPuzzle.slice(0, 80);
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  test("solve puzzle that cannot be solved", (done) => {
    const unsolvablePuzzle = validPuzzle.replace(".", "7");
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: unsolvablePuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  test("check a puzzle placement with valid placement", (done) => {
    const value = solution[1];
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test("check single placement conflict", (done) => {
    const value = "4";
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ["row"]);
        done();
      });
  });

  test("check multiple placement conflicts", (done) => {
    const value = "6";
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ["column", "region"]);
        done();
      });
  });

  test("check all placement conflicts", (done) => {
    const value = "2";
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });

  test("check missing required fields", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("check invalid characters in puzzle string", (done) => {
    const invalidPuzzle = validPuzzle.replace(/\./g, "a");
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalidPuzzle, coordinate: "A2", value: "5" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("check incorrect length of puzzle string", (done) => {
    const invalidPuzzle = validPuzzle.slice(0, 80);
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalidPuzzle, coordinate: "A2", value: "5" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  test("check invalid coordinate", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "Z9", value: "5" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  test("check invalid value", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "a" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
