import React from 'react';
import '../styles/Button.css';

export default function({ children }) {
  return (
    <button className="radiusButton">
      <span> {children} </span>
    </button>
  );
}