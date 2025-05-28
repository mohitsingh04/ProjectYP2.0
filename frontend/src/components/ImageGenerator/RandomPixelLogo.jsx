import React, { useState } from "react";

// Utility to pick one random color
const getRandomColor = () => {
  const colors = [
    "#d63384",
    "#6610f2",
    "#198754",
    "#fd7e14",
    "#20c997",
    "#0dcaf0",
    "#ffc107",
    "#dc3545",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generates a pixel map of booleans (1 = show pixel, 0 = transparent)
const generateRandomPixelMap = (rows, cols, density = 0.5) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < density)
  );
};

const RandomPixelLogo = ({ rows = 8, cols = 8, density = 0.5, size = 48 }) => {
  const [pixelMap] = useState(generateRandomPixelMap(rows, cols, density));
  const [color] = useState(getRandomColor()); // One random color per instance
  const pixelSize = size / cols;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
      }}
    >
      {pixelMap.flatMap((row, rowIndex) =>
        row.map((showPixel, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: showPixel ? color : "transparent",
            }}
          />
        ))
      )}
    </div>
  );
};

export default RandomPixelLogo;
