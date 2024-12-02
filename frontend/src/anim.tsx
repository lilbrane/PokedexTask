import { useRef } from "react";
import { useSpring } from "react-spring";
import { SpringValues } from "react-spring";

 // Animation for input error
 export const useShakeLtoR = (checker: Boolean, setter: React.Dispatch<React.SetStateAction<boolean>>): SpringValues<{ transform: string }> => useSpring({
    to: checker ?
     [
      {transform: "translateX(10px)" },
      {transform: "translateX(-10px)" },
      {transform: "translateX(0px)" },
    ] 
    :
    { transform: "translateX: 0px"},
    from: { transform: "translateX(0px)"},
    config: { tension: 170, friction: 26, duration: 100},
    reset: true,
    onRest: () => {
      if(checker) setter(false)
    }
  });

  export const useHideAfterSeconds = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    const hideAfterSeconds = (seconds: number) => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
  
      // Set a new timer
      timerRef.current = setTimeout(() => {
        setter(false); // Hide the error
        timerRef.current = null; // Reset the ref
      }, seconds * 1000);
    };
  
    return hideAfterSeconds;
  };
