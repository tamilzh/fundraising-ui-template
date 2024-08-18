import React from "react";
import Catalogue from "./Catalogue";

const MintOptions = ({
  bgColors,
  patterns,
  name,
  distribution,
  sliders,
  getItem,
  setBackgroundColor,
  pieData,
  setPieData,
  setPatterns,
}) => {
  return (
    <div className="mint__steps-left">
      <Catalogue
        bgColors={bgColors}
        patterns={patterns}
        getItem={getItem}
        setBackgroundColor={setBackgroundColor}
        setPatterns={setPatterns}
      />     
    </div>
  );
};

export default MintOptions;
