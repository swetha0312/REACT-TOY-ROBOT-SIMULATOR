import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RobotSimulator.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
const RobotSimulator = () => {
  const [command, setCommand] = useState("");
  const [showRobotDisplay, setShowRobotDisplay] = useState(false);
  const [commandsHistory, setCommandsHistory] = useState([]);
  const [robotState, setRobotState] = useState({
    x: null,
    y: null,
    direction: null,
  });
  const handleClose = () => {
    setShowRobotDisplay(false);
  };
  console.log("data", robotState);
  const DIRECTIONS = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    EAST: "EAST",
    WEST: "WEST",
  };
  const COMMANDS = {
    PLACE: "PLACE",
    MOVE: "MOVE",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    REPORT: "REPORT",
  };
  const ERROR_MESSAGES = {
    INVALID_PLACE_COORDINATES:
      "Invalid PLACE command. Coordinates must be between 0 and 4.",
    INVALID_PLACE_COMMAND:
      "Invalid PLACE command. Please provide valid coordinates and direction.",
    CANNOT_MOVE_FORWARD:
      "The robot can't move forward in that direction. It may fall off the table.",
    INVALID_COMMAND:
      "Invalid command. Valid commands are PLACE, MOVE, LEFT, RIGHT, REPORT.",
    ROBOT_NOT_PLACED:
      "Robot is not placed on the table yet. Place the robot first.",
  };
  const canMoveForward = (x, y, direction) => {
    switch (direction) {
      case DIRECTIONS.NORTH:
        return y < 4;
      case DIRECTIONS.SOUTH:
        return y > 0;
      case DIRECTIONS.EAST:
        return x < 4;
      case DIRECTIONS.WEST:
        return x > 0;
      default:
        return false;
    }
  };
  const isRobotPlaced = () => {
    const { x, y, direction } = robotState;
    return x !== null && y !== null && direction !== null;
  };
  const isPlaceOrReportCommand = (command) => {
    const upperCaseCommand = command.toUpperCase();
    return (
      upperCaseCommand.startsWith(COMMANDS.PLACE) ||
      upperCaseCommand === COMMANDS.REPORT
    );
  };
  const moveRobot = () => {
    const { x, y, direction } = robotState;
    let newX = x;
    let newY = y;
    switch (direction) {
      case DIRECTIONS.NORTH:
        newY = Math.min(y + 1, 4);
        break;
      case DIRECTIONS.SOUTH:
        newY = Math.max(y - 1, 0);
        break;
      case DIRECTIONS.EAST:
        newX = Math.min(x + 1, 4);
        break;
      case DIRECTIONS.WEST:
        newX = Math.max(x - 1, 0);
        break;
      default:
        break;
    }
    setRobotState((prevRobotState) => ({
      ...prevRobotState,
      x: newX,
      y: newY,
    }));
  };
  const rotateRobot = (direction) => {
    const { direction: currentDirection } = robotState;
    let newDirection;
    if (direction === "LEFT") {
      switch (currentDirection) {
        case DIRECTIONS.NORTH:
          newDirection = DIRECTIONS.WEST;
          break;
        case DIRECTIONS.WEST:
          newDirection = DIRECTIONS.SOUTH;
          break;
        case DIRECTIONS.SOUTH:
          newDirection = DIRECTIONS.EAST;
          break;
        case DIRECTIONS.EAST:
          newDirection = DIRECTIONS.NORTH;
          break;
        default:
          newDirection = currentDirection;
          break;
      }
    } else if (direction === "RIGHT") {
      switch (currentDirection) {
        case DIRECTIONS.NORTH:
          newDirection = DIRECTIONS.EAST;
          break;
        case DIRECTIONS.EAST:
          newDirection = DIRECTIONS.SOUTH;
          break;
        case DIRECTIONS.SOUTH:
          newDirection = DIRECTIONS.WEST;
          break;
        case DIRECTIONS.WEST:
          newDirection = DIRECTIONS.NORTH;
          break;
        default:
          newDirection = currentDirection;
          break;
      }
    }

    setRobotState({ ...robotState, direction: newDirection });
  };
  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };
  const handleRunCommand = () => {
    try {
      if (!isRobotPlaced() && !isPlaceOrReportCommand(command)) {
        throw new Error(ERROR_MESSAGES.ROBOT_NOT_PLACED);
      }
      if (command.toUpperCase().startsWith(COMMANDS.PLACE)) {
        const [, x, y, direction] =
          command
            .toUpperCase()
            .match(/PLACE (\d+),(\d+),(NORTH|SOUTH|EAST|WEST)/) || [];
        if (x !== undefined && y !== undefined && direction !== undefined) {
          const parsedX = parseInt(x);
          const parsedY = parseInt(y);

          if (parsedX >= 0 && parsedX <= 4 && parsedY >= 0 && parsedY <= 4) {
            setRobotState({ x: parsedX, y: parsedY, direction });
          } else {
            throw new Error(ERROR_MESSAGES.INVALID_PLACE_COORDINATES);
          }
        } else {
          throw new Error(ERROR_MESSAGES.INVALID_PLACE_COMMAND);
        }
      } else if (command.toUpperCase() === COMMANDS.MOVE) {
        const { x, y, direction } = robotState;
        if (!canMoveForward(x, y, direction)) {
          throw new Error(ERROR_MESSAGES.CANNOT_MOVE_FORWARD);
        }
        moveRobot();
      } else if (command.toUpperCase() === COMMANDS.LEFT) {
        rotateRobot("LEFT");
      } else if (command.toUpperCase() === COMMANDS.RIGHT) {
        rotateRobot("RIGHT");
      } else if (command.toUpperCase() === COMMANDS.REPORT) {
        // toast.info(
        //   `X: ${robotState.x}, Y: ${robotState.y}, Direction: ${robotState.direction}`,
        //   {
        //     position: "top-left",
        //     autoClose: 3000,
        //   }
        // );
        setShowRobotDisplay(true);
      } else {
        throw new Error(ERROR_MESSAGES.INVALID_COMMAND);
      }
      setCommandsHistory((prevCommands) => [...prevCommands, command]);

    } catch (error) {
      toast.error(error.message, { position: "top-left", autoClose: 3000 });
    }
  };
  const handleReset = () => {
    setRobotState({
      x: null,
      y: null,
      direction: null,
    });
    setCommand("");
    setCommandsHistory([])
  };
  return (
    <div className="robot-simulator">
      <div className="runcommand">
        <input
          className="command-input"
          type="text"
          value={command.toUpperCase()}
          onChange={handleCommandChange}
          placeholder="Tell the robot what to do..."
        />
        <div className="command-buttons">
          <button className="command-button" onClick={handleRunCommand}>
            RUN
          </button>
          <button className="command-button-reset" onClick={handleReset}>
            RESET
          </button>
        </div>
        <div className="output-area">
          {commandsHistory.map((cmd, index) => (
            <div key={index} className="command-history">
              &gt; {cmd.toUpperCase()}
            </div>
          ))}
        </div>      </div>
      <div className="grid-container">
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {Array.from({ length: 5 }, (_, colIndex) => (
              <div
                key={colIndex}
                className={`grid-cell ${
                  robotState.x === colIndex && robotState.y === rowIndex
                    ? "robot"
                    : ""
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      {showRobotDisplay && (
        <div className="robot-display-container">
          <Dialog open={true} onClose={handleClose}>
            <DialogTitle>Robot Position</DialogTitle>
            <DialogContent>
              {robotState.x !== undefined &&
              robotState.y !== undefined &&
              robotState.direction !== undefined ? ( // Adjusted the check
                <p className="robot-state">
                  X: {robotState.x}, Y: {robotState.y}, Direction:{" "}
                  {robotState.direction}
                </p>
              ) : (
                <p className="robot-not-placed">
                  Robot is not placed on the table yet.
                </p>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
export default RobotSimulator;
