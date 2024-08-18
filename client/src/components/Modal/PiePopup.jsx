import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import constant from "../../utils/constant";

const PiePopup = ({ card, sliders, onClose }) => {
  return (
    <div className="pie-popup">
      <div className="close-btn__wrapper" onClick={onClose}>
        <div className="close-btn__bar bar1"></div>
        <div className="close-btn__bar bar2"></div>
      </div>
      <h1 className="pie-popup-title">{card.distPresetName}</h1>
      <div className="pie-popup-content">
        <div className="pie-wrapper">
          <PieChart
            className="pie"
            data={card.pieData}
            label={({ dataEntry }) => dataEntry.value < 2 ? "" : dataEntry.value >=2 && dataEntry.value <= 3 ? dataEntry.value : dataEntry.value+"%"}
            labelStyle={{
              fontSize: "4px",
            }}
            startAngle={-90}
            labelPosition={87}
            radius={40}
          />
          <img src={card.image} className="pie-nft" alt="pie-nft" />
        </div>
        <div className="pie-labels__wrapper">
          {sliders && sliders.map((slider, index) => {
            return (
              <div key={slider.name} className="pie-label__wrapper">
                <div
                  className="pie-label__color-box"
                  style={{ backgroundColor: slider.color }}
                ></div>
                <span className="pie-label">{slider.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PiePopup;
