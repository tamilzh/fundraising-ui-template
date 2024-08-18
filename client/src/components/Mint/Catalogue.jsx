import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper";
import constant from "../../utils/constant";

const Catalogue = ({
  category,
  identifier,
  data,
  setUserSelection,
  selectedItems,
  title,
  rarityList,
  setFinalTooltipText,
  rarityData,
  setRarityData,
}) => {
  const [bgRarity, setBgRarity] = useState([]);
  const [ptRarity, setPtRarity] = useState([]);
  const [lcRarity, setLcRarity] = useState([]);
  const [tooltipText, setTooltipText] = useState("");
  const [showRarityBox, setShowRarityBox] = useState(false);

  let backgroundRarity = [];
  let patternRarity = [];
  let layerChoiceRarity = [];
  useEffect(() => {
    if (rarityList !== undefined) {
      rarityList.forEach((rarity) => {
        if (rarity.rarityType === "background") {
          backgroundRarity.push({
            type: constant.BACKGROUND_COLOR,
            id: rarity.idOfType,
            start: rarity.startsOn,
            end: rarity.endsOn,
            remainingCounter: Math.max(
              rarity.maxCount - rarity.currentCount,
              0
            ),
            totalAllowed: rarity.maxCount,
          });
        } else if (rarity.rarityType === "pattern") {
          patternRarity.push({
            type: constant.PATTERN,
            id: rarity.idOfType,
            start: rarity.startsOn,
            end: rarity.endsOn,
            remainingCounter: Math.max(
              rarity.maxCount - rarity.currentCount,
              0
            ),
            totalAllowed: rarity.maxCount,
          });
        } else if (rarity.rarityType === "layerchoice") {
          layerChoiceRarity.push({
            type: constant.LAYER_CHOICE,
            id: rarity.idOfType,
            start: rarity.startsOn,
            end: rarity.endsOn,
            remainingCounter: Math.max(
              rarity.maxCount - rarity.currentCount,
              0
            ),
            totalAllowed: rarity.maxCount,
          });
        }
      });
      setBgRarity(backgroundRarity);
      setPtRarity(patternRarity);
      setLcRarity(layerChoiceRarity);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rarityList]);

  const getConditionalStyle = (item, index) => {
    if (category === "background") {
      return {
        backgroundColor: item.colorHexCode,
      };
    } else if (category === "pattern") {
      return {
        backgroundImage: `url(${item.thumbnailURL})`,
        // backgroundSize: "180px",
        backgroundPosition: "center",
      };
    } else if (category === "layerchoice") {
      // if (index === 0) {
      //   updateSelection(item);
      // }
      return {
        backgroundImage: `url(${item.layerPreviewURL})`,
        //backgroundSize: "180px",
        backgroundPosition: "center",
      };
    }
  };

  const getRarityStyle = (item) => {
    if (category === "background") {
      return bgRarity.some((br) => br.id === item.backgroundId);
    } else if (category === "pattern") {
      return ptRarity.some((pr) => pr.id === item.patternId);
    } else if (category === "layerchoice") {
      return lcRarity.some((lcr) => lcr.id === item.layerChoiceId);
    }
  };

  const formatDate = (date) => {
    return (
      date.getFullYear().toString().slice(-2) +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2) +
      " " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2)
    );
  };

  const calculateDate = (itemRarity, index) => {
    let startDate = itemRarity[index].start
      ? new Date(itemRarity[index].start * 1000)
      : null;
    let endDate = itemRarity[index].end
      ? new Date(itemRarity[index].end * 1000)
      : null;
    let startDay = startDate ? formatDate(startDate) : null;
    let endDay = endDate ? formatDate(endDate) : null;
    return { startDay, endDay };
  };

  const updateTooltip = (itemRarity, id) => {
    if (itemRarity.some((ir) => ir.id === id)) {
      let index = itemRarity.findIndex((ir) => ir.id === id);
      if (itemRarity[index] !== undefined) {
        let availableNfts = itemRarity[index].remainingCounter;
        let totalAllowed = itemRarity[index].totalAllowed;
        let type = itemRarity[index].type;
        let tooltipMsg = `Rarity of this ${type}:`;

        let dates = calculateDate(itemRarity, index);
        if (dates.startDay && dates.endDay)
          tooltipMsg += `<br>- Mint from ${dates.startDay} to ${dates.endDay}. `;
        else if (dates.endDay)
          tooltipMsg += `<br>- Minting ends on ${dates.endDay}. `;

        if (availableNfts > 0) {
          tooltipMsg += `<br>- Only ${availableNfts} of ${totalAllowed} left.`;
        }
        setTooltipText(tooltipMsg);
        setShowRarityBox(true);
      }
    } else {
      setTooltipText("");
      setShowRarityBox(false);
    }
  };

  const hideRarityDetails = () => {
    setTooltipText("");
    setShowRarityBox(false);
  };

  const getRarityTooltip = (item) => {
    if (category === "background") {
      updateTooltip(bgRarity, item.backgroundId);
    } else if (category === "pattern") {
      updateTooltip(ptRarity, item.patternId);
    } else if (category === "layerchoice") {
      updateTooltip(lcRarity, item.layerChoiceId);
    }
  };

  const getRarityThreshold = (item) => {
    if (category === "background") {
      updateMintingThreshold(bgRarity, item.backgroundId);
    } else if (category === "pattern") {
      updateMintingThreshold(ptRarity, item.patternId);
    } else if (category === "layerchoice") {
      updateMintingThreshold(lcRarity, item.layerChoiceId);
    }
  };

  const updateMintingThreshold = (itemRarity, id) => {
    if (itemRarity.some((ir) => ir.id === id)) {
      let index = itemRarity.findIndex((ir) => ir.id === id);
      if (itemRarity[index] !== undefined) {
        let rarityDataObj = rarityData;
        rarityDataObj[identifier].start = itemRarity[index].start;
        rarityDataObj[identifier].end = itemRarity[index].end;
        rarityDataObj[identifier].remainingCounter =
          itemRarity[index].remainingCounter;
        rarityDataObj[identifier].totalAllowed = itemRarity[index].totalAllowed;
        rarityDataObj[identifier].type = title || itemRarity[index].type;
        setRarityData(rarityDataObj);
      }
    } else {
      let rarityDataObj = rarityData;
      rarityDataObj[identifier].start = 0;
      rarityDataObj[identifier].end = 0;
      rarityDataObj[identifier].remainingCounter = 0;
      rarityDataObj[identifier].totalAllowed = 0;
      rarityDataObj[identifier].type = "";
      setRarityData(rarityDataObj);
    }
  };

  const showPrice = (item) => {
    if (category === "background") {
      if (item.price)
        return <h4 className="bg-price">{`${item.price} AVAX`}</h4>;
    }
  };

  const isSelected = (item) => {
    if (category === "background") {
      return (
        selectedItems[identifier] &&
        item.backgroundId === selectedItems[identifier].backgroundId
      );
    } else if (category === "pattern") {
      return (
        selectedItems[identifier] &&
        item.patternId &&
        item.patternId === selectedItems[identifier].patternId
      );
    } else if (category === "layerchoice") {
      return (
        selectedItems[identifier] &&
        item.layerChoiceId &&
        item.layerChoiceId === selectedItems[identifier].layerChoiceId
      );
    }
  };

  const updateSelection = (item) => {
    const selectedItem = { ...item, category };
    if (category === "pattern") {
      for(const choice in selectedItems){
        if(selectedItems[choice].category === "layerchoice"){
          delete selectedItems[choice];
        }
      }
      selectedItems.pattern = selectedItem;
      setUserSelection(selectedItems);
    } else {
      setUserSelection({ [identifier]: selectedItem });
    }
    getRarityThreshold(selectedItem);
  };

  const renderContent = () => {
    if (data && data.length > 0) {
      return (
        <>
          <h3 className="mint__step-title">{title}</h3>
          <div className="mint__bg-box">
            <Swiper
              slidesPerView={5}
              spaceBetween={5}
              slidesPerGroup={4}
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
            >
              <div className="swiper-wrapper swiper-wrap">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="swiper-slide"
                    style={{ padding: "3rem" }}
                  >
                    <div className="bg-palette__info">
                      <div
                        className={`bg-box__wrapper ${
                          isSelected(item) ? "bg-box__wrapper--selected" : ""
                        }`}
                      >
                        <div
                          className="bg-box"
                          style={getConditionalStyle(item, index)}
                          onClick={() => updateSelection(item)}
                          onMouseEnter={() => getRarityTooltip(item)}
                          onMouseLeave={() => hideRarityDetails()}
                        >
                          {getRarityStyle(item) && (
                            <span className="rare-label">Rare</span>
                          )}
                        </div>
                      </div>
                      {showPrice(item)}
                    </div>
                  </div>
                ))}
              </div>
            </Swiper>
          </div>
          {showRarityBox && (
            <div className="rarity-box">
              <span
                className="rarity-text"
                dangerouslySetInnerHTML={{ __html: tooltipText }}
              ></span>
            </div>
          )}
        </>
      );
    }
  };

  return <React.Fragment>{renderContent()}</React.Fragment>;
};

export default React.memo(Catalogue);
