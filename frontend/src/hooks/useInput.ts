import { useState } from "react";
import { useHideAfterSeconds, useShakeLtoR } from "../anim";

// custom hook for setting all form fields variables for value, errors, animation, hiding errors ...
export const useInput = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [animateInput, setAnimateInput] = useState(false);
    const animated = useShakeLtoR(animateInput, setAnimateInput);
    const [visibleError, setVisibleError] = useState(false);
    const hideErrorAfterSeconds = useHideAfterSeconds(setVisibleError);
  
    return {
      value,
      setValue,
      error,
      setError,
      animateInput,
      setAnimateInput,
      animated,
      visibleError,
      setVisibleError,
      hideErrorAfterSeconds,
    };
  };