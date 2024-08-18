import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import constant from "../../utils/constant";

const PieDist = ({ pieData, preset, sliders, previewLink }) => {
  const color = constant.color;
  const renderContent = () => {
    if (preset.length > 0) {
      return (
        <div className="mint__dist">
          <h3 className="mint-preview__title" style={{color: "var(--web-primary-color)"}}>{preset}</h3>
          {/* <div className="small-cards"> */}
            <div className="pie-wrapper">
              <PieChart
                className="pie"
                data={
                  pieData.length > 0
                    ? [
                        { value: Math.round(pieData[0]), color: color[0] },
                        { value: Math.round(pieData[1]), color: color[1] },
                        { value: Math.round(pieData[2]), color: color[2] },
                        { value: Math.round(pieData[3]), color: color[3] },
                      ]
                    : []
                }
                label={({ dataEntry }) => dataEntry.value < 2 ? "" : dataEntry.value >=2 && dataEntry.value <= 3 ? dataEntry.value : dataEntry.value+"%"}
                labelStyle={{ fontSize: "4px" }}
                startAngle={-90}
                labelPosition={87}
                radius={40}
                animate
              />
              <img src={`${previewLink}`} className="pie-nft" alt="pie-nft" />
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
        // </div>
      );
    }
  };
  return <React.Fragment>{renderContent()}</React.Fragment>;
};

export default PieDist;
