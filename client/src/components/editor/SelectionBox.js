import React from 'react';

const SelectionBox = ({ x, y, width, height }) => {
  return (
    <div
      className="absolute border-2 border-primary-500 bg-primary-100 bg-opacity-20 pointer-events-none"
      style={{
        left: x,
        top: y,
        width,
        height
      }}
    />
  );
};

export default SelectionBox;
