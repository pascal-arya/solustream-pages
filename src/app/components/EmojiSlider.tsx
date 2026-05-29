"use client";

import React, { useState } from "react";
import Image from "next/image";
interface EmojiSliderProps {
  id: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  sublabel?: string;
  isAdjusted?: boolean; // Prop to specify if the user has adjusted this slider
}

export default function EmojiSlider({
  id,
  min = 0,
  max = 100,
  defaultValue = 50,
  value: controlledValue,
  onChange,
  label,
  sublabel,
  isAdjusted = false, // Controlled by parent
}: EmojiSliderProps) {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;



  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  // Determine which emoji path to show based on percentage
  const getEmojiPath = (val: number): string => {
    if (val < 16) return "/Assets/emojis/1f614.png"; // 😔
    if (val < 41) return "/Assets/emojis/1f641.png"; // 🙁
    if (val < 66) return "/Assets/emojis/1f604.png"; // 😄
    if (val < 90) return "/Assets/emojis/1f606.png"; // 😆
    return "/Assets/emojis/1f929.png"; // 🤩
  };

  // Determine pill position: right of emoji for < 15%, left of emoji otherwise
  const isPillOnRight = currentValue < 15;

  return (
    <div className="slider-wrapper">
      {label && (
        <div className="slider-header-info">
          <label htmlFor={id} className="slider-title-label">
            {label}
          </label>
          {sublabel && <span className="slider-subtext-label">{sublabel}</span>}
        </div>
      )}
      
      <div className={`slider-container ${isDragging ? "dragging" : ""} ${isFocused ? "focused" : ""} ${!isAdjusted ? "unadjusted" : "adjusted"}`}>
        <div className="slider-track-container">
          {/* Transparent Native Range Input for Keyboard & Event support */}
          <input
            type="range"
            id={id}
            min={min}
            max={max}
            value={currentValue}
            onChange={handleSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setIsDragging(false);
            }}
            className="slider-input-range"
            aria-label={label || "Satisfaction slider"}
          />

          {/* Styled Base Track */}
          <div className="slider-base-track">
            {/* Filled Track Gradient */}
            <div
              className="slider-fill-track"
              style={{ width: `${currentValue}%` }}
            />
            
            {/* Custom Interactive Thumb Wrapper */}
            <div
              className="slider-thumb-wrapper"
              style={{
                left: `${currentValue}%`,
                flexDirection: isPillOnRight ? "row" : "row-reverse",
                gap: "6px",
                transform: `translate(-50%, -50%) ${isDragging ? "scale(1.15) rotate(4deg)" : "scale(1)"}`,
              }}
            >
              {/* Apple Emoji Thumb */}
              <span className="slider-emoji" role="img" aria-label="satisfaction emoji">
                <Image
                  src={getEmojiPath(currentValue)}
                  alt="Apple Emoji rating"
                  width={42}
                  height={42}
                  style={{
                    width: "42px",
                    height: "42px",
                    objectFit: "contain",
                    display: "block",
                    userSelect: "none",
                    pointerEvents: "none"
                  }}
                />
              </span>

              {/* White Percentage Bubble */}
              <div className="slider-pill">
                {currentValue}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
