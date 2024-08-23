import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getThemeConfig } from "../../utils/common";

const PieDist = ({ pieData, preset, sliders, previewLink }) => {
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
                        { value: Math.round(pieData[0]), color: getThemeConfig().DISTRO_COLOR.beneficiary },
                        { value: Math.round(pieData[1]), color: getThemeConfig().DISTRO_COLOR.artist },
                        { value: Math.round(pieData[2]), color: getThemeConfig().DISTRO_COLOR.sponsor },
                        { value: Math.round(pieData[3]), color: getThemeConfig().DISTRO_COLOR.seller },
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
                      style={{ backgroundColor: getThemeConfig().DISTRO_COLOR[slider.category.replace("fundraiser", "sponsor")] }}
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
