import React, { useEffect, useRef, useState } from "react";
import { RiWeightLine } from "react-icons/ri";

interface TextInLogoProps {
  textInMiddle: string;
  baseSize: number; // Minimum size of the logo
}

const TextInLogo: React.FC<TextInLogoProps> = ({ textInMiddle, baseSize }) => {
  const textRef = useRef<HTMLParagraphElement>(null); // Ref for measuring text width
  const [iconSize, setIconSize] = useState(baseSize);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const calculatedSize = Math.max(baseSize, textWidth * 1.5); // Adjust scaling factor as needed
      setIconSize(calculatedSize);
    }
  }, [textInMiddle, baseSize]);

  return (
    <div className="relative  w-fit h-fit flex items-center justify-center">
      {/* Text in the middle */}
      <p ref={textRef} className="absolute text-center font-bold mt-4">
        {textInMiddle}
      </p>
      {/* Icon */}
      <RiWeightLine size={iconSize} />
    </div>
  );
};

export default TextInLogo;
