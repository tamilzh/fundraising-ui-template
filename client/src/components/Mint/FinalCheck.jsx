import React from "react";
import constant from "../../utils/constant";

const FinalCheck = ({
  selectedItems,
  artOptions,
  sliders,
  preset,
  title,
  rarityData,
  previewLink
}) => {
  const getPercentage = (s) => {
    if (s.category === "beneficiary") {
      return selectedItems.distribution.beneficiaryDistro / 100;
    } else if (s.category === "fundraiser") {
      return selectedItems.distribution.fundraiserDistro / 100;
    } else if (s.category === "artist") {
      return selectedItems.distribution.artistDistro / 100;
    } else {
      return selectedItems.distribution.sellerDistro / 100;
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

  const calculateDate = (start, end) => {
    let startDate = start ? new Date(start * 1000) : null;
    let endDate = end ? new Date(end * 1000) : null;
    let startDay = startDate ? formatDate(startDate) : null;
    let endDay = endDate ? formatDate(endDate) : null;
    return { startDay, endDay };
  };

  const getRareInfo = (identifier) => {
    let start = rarityData[identifier]?.start;
    let end = rarityData[identifier]?.end;
    let remainingCounter = rarityData[identifier]?.remainingCounter;
    let totalAllowed = rarityData[identifier].totalAllowed;
    let type = rarityData[identifier].type;

    if (start || end || remainingCounter) {
      let tooltipMsg = `Rarity of this ${type}:`;
      let dates = calculateDate(start, end);
      if (dates.startDay && dates.endDay)
        tooltipMsg += `<br>- Mint from ${dates.startDay} to ${dates.endDay}. `;
      else if (dates.endDay) {
        tooltipMsg += `<br>- Minting ends on ${dates.endDay}. `;
      }
      if (remainingCounter > 0) {
        tooltipMsg += `<br>- Only ${remainingCounter} of ${totalAllowed} left.`;
      }
      return tooltipMsg;
    }
  };

  const getStyle = (item) => {
    if (item.widget === "catalogue") {
      if (item.category === "background") {
        return {
          backgroundColor: selectedItems[item.identifier].colorHexCode,
          backgroundSize: "2.5rem",
          backgroundRepeat: "no-repeat",
        };
      } else if (item.category === "pattern") {
        return {
          backgroundImage: `url(${
            selectedItems[item.identifier].thumbnailURL
          })`,
          backgroundPosition: "center",
          backgroundSize: "2.5rem",
          backgroundRepeat: "no-repeat",
          transform: "scale(1.6)",
        };
      } else if (item.category === "layerchoice") {
        return {
          backgroundImage: `url(${
            selectedItems[item.identifier].layerPreviewURL
          })`,
          backgroundPosition: "center",
          backgroundSize: "2.5rem",
          backgroundRepeat: "no-repeat",
          transform: "scale(1.6)",
        };
      }
    } else {
    }
  };

  const image = `${previewLink}`;

  const conditionalText = (option) => {
    if(option.category === "background"){
      return <span> {option.title} {" "}{" "}{" "} {`${selectedItems.background.price.toString()} AVAX`}</span>
    } 
    return <span> {option.title}</span>
  }
  return (
    <>
      <h3 className="mint__step-title final-step-title">{title}</h3>
      <div className="mint__final-list">
        <div className="final-data">
          <div className="final-nft-wrapper">
            <div className="final-nft-cont">
              <img src={image} className="final-nft" alt="" />
            </div>
            <h1 className="final-nft-name">
              {selectedItems.name.approvedName} #{selectedItems.name.nextNameNumber}
            </h1>
          </div>

          <div className="final-data-left">
            <table className="final-data__nft-styles nft-styles-ds">
              <tbody>
                {artOptions.map((option) => {
                  if (option.widget === "catalogue") {
                    return (
                      <React.Fragment key={option.title}>
                        <tr>
                          <td className="table-text-header">
                            <div className="grid-container">
                              <div
                                className="grid-item final-data__nft-box"
                                style={getStyle(option)}
                              ></div>
                              <div className="grid-item">
                                {conditionalText(option)}
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="table-rare-text">
                            <div className="grid-container">
                              <div className="grid-item"></div>
                              <div
                                className="grid-item"
                                dangerouslySetInnerHTML={{
                                  __html: getRareInfo(option.identifier),
                                }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
            <table className="final-data__nft-styles nft-styles-mb">
              <tbody>
                {artOptions.map((option) => {
                  if (option.widget === "catalogue") {
                    return (
                      <React.Fragment key={option.title}>
                        <tr>
                          <td className="table-text-header">
                            <div className="grid-container">
                              <div className="grid-item">
                              <span>{option.category === "background" ? `${option.title} ${selectedItems.background.price.toString()} AVAX` : option.title}</span>
                              </div>
                              <div
                                className="grid-item final-data__nft-box"
                                style={getStyle(option)}
                              ></div>
                            </div>
                          </td>
                        </tr>
                        <tr >
                          <td>
                            <div className={getRareInfo(option.identifier) === undefined ? "" : "table-rare-bg"}>
                              <span className="table-rare-text" dangerouslySetInnerHTML={{
                              __html: getRareInfo(option.identifier),
                            }}></span>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
          <div className="final-data-right">
            <table className="final-data__dist-division">
              <tbody>
                <tr>
                  <th
                    className="table-text-header"
                    style={{ textAlign: "left" }}
                  >
                    {constant.DISTRIBUTION}
                  </th>
                  <th className="table-text-header" style={{ width: "35%" }}>
                    {preset === "I Only Love Octopi"
                      ? "I Only ❤️ Octopi"
                      : preset === "Art Lover"
                      ? "🎨 Lover"
                      : preset === "Cat Lover"
                      ? "🐱 Lover"
                      : preset}
                  </th>
                </tr>
                {sliders.map((slider, index) => {
                  return (
                    <tr key={slider.name}>
                      <td className="table-text-data">{slider.name}</td>
                      <td className="table-text-data">{`${getPercentage(
                        slider
                      )} %`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(FinalCheck);
