import React, { useState } from 'react';
import RobotSimulator from './components/RobotSimulator';
//  import RobotDisplay from "./components/RobotDisplay.js"
 import "./styles.css";
const App = () => {
  const [showRobotDisplay, setShowRobotDisplay] = useState(false);

  const handleReportClick = (show) => {
    setShowRobotDisplay(show);
  };

  return (
    <div className="app-container">
      <h2 className="title">TOY ROBOT </h2>
     
      <RobotSimulator onReportClick={handleReportClick} />
      {/* {showRobotDisplay && <RobotDisplay setShowRobotDisplay={setShowRobotDisplay} />} */}
    </div>
  );
};

export default App;
