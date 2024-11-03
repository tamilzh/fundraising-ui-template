import React from "react";

const Arrow_Right = ({color}) => {
  return (
    <div className="arrow-right">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44.1"
        height="13.325"
        viewBox="0 0 44.1 13.325"
      >
        <g id="arrow" transform="translate(53.513 1.414)">
          <line
            id="Línea_1"
            data-name="Línea 1"
            x2="42.1"
            transform="translate(-52.513 4.698)"
            fill="none"
            stroke={color}
            stroke-linecap="round"
            stroke-width="2"
          />
          <path
            id="Trazado_7679"
            data-name="Trazado 7679"
            d="M6904,3501.6l4.785,4.785L6904,3512.1"
            transform="translate(-6919.198 -3501.6)"
            fill="none"
            stroke={color}
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </g>
      </svg>
    </div>
  );
};

export default Arrow_Right;
