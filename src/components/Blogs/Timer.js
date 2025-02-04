import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import { bgColorAtom } from "../../store/theme";

const Timer = ({setTimeFlag, countdown}) => {
  const [bgColor] = useAtom(bgColorAtom);
  const [count, setCount] = useState(0);

  useEffect(() => setCount(countdown), []);

  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setTimeFlag(false);
            return 0;
          }
          return prevTime - 1; // Decrease count by 1 second
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [count, setTimeFlag]);

  // Function to format seconds into HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="text-[37px] text-blue-500">
      <h1>Time: {formatTime(count)} </h1> {/* Convert seconds to milliseconds */}
    </div>
  );
};

export default Timer;
