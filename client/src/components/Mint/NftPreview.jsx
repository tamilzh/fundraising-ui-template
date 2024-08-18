import React from "react";
import Card from "../Card";
import preview from "../../assets/images/preview.svg";
import constant from "../../utils/constant";

const NftPreview = ({
  loader,
  input,
  previewLink,
  pieData,
  preset,
  widget,
}) => {
  const color = constant.color;
  const card = {
    id: 0,
    image: (previewLink)
      ? `${previewLink}`
      : preview,
    name: input.name
      ? `${input.name.approvedName} #${input.name.nextNameNumber}`
      : "",
    address: "",
    forsell: input.forsale ? input.forsale : false,
    buy: false,
    price: input.background ? input.background.price : "",
    distPresetName: preset ? preset : "",
    pieData:
      pieData.length > 0
        ? [
            { value: pieData[0], color: color[0] },
            { value: pieData[1], color: color[1] },
            { value: pieData[2], color: color[2] },
            { value: pieData[3], color: color[3] },
          ]
        : [],
  };

  const renderContent = () => {
    if (loader)
      return (
        <div className="card">
          <div className="card-loader card-loader--tabs"></div>
        </div>
      );
    return <Card card={card} enableZoom={true} />;
  };

  return (
    <React.Fragment>
      <h3
        className={widget === "final" ? "mint-preview__title final" : "mint-preview__title"}
        style={{ color: "var(--web-primary-color)"}}
      >
        {card.name ? card.name : constant.NEW_NAME}
      </h3>
      <div className={widget === "final" ? "mint-card final" : "mint-card"}>{renderContent()}</div>
    </React.Fragment>
  );
};

export default React.memo(NftPreview);
