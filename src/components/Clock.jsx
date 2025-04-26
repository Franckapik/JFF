import React, { useEffect, useState } from "react";
import useGameStore from "../stores/useGameStore"; // Import game store

const Clock = () => {
  const isClockRunning = useGameStore((state) => state.isClockRunning); // Access global clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Update the current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    let timerInterval;

    if (isClockRunning) {
      // Start the stopwatch
      timerInterval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      // Reset the stopwatch when the timer stops
      setElapsedTime(0);
    }

    return () => clearInterval(timerInterval);
  }, [isClockRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="clock-container">
      <div className="current-time">Current Time: {currentTime.toLocaleTimeString()}</div>
      <div className="elapsed-time">Elapsed Time: {formatTime(elapsedTime)}</div>
    </div>
  );
};

export default Clock;
