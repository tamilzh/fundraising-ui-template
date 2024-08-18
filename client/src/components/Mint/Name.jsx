import React, { useState, useEffect, useRef } from "react";
import chevron_down_dark from "../../assets/images/chevron_down_dark.svg";

const Name = ({
  nameList,
  setUserSelection,
  selectedItems,
  title,
  rarityList,
}) => {
  const [isListOpen, setList] = useState(false);
  const [name, setName] = useState(
    selectedItems.name ? selectedItems.name.approvedName : "Pick a name"
  );
  const [tooltipText, setTooltipText] = useState("");
  const [showRarityBox, setShowRarityBox] = useState(false);
  const toggleList = () => {
    setList(!isListOpen);
  };

  const changeName = (item) => {
    setUserSelection({ name: { ...item, category: "approvedname" } });
    setName(item.approvedName);
    updateTooltip(item);
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

  const calculateDate = (item, index) => {
    let startDate = item.startsOn ? new Date(item.startsOn * 1000) : null;
    let endDate = item.endsOn ? new Date(item.endsOn * 1000) : null;
    let startDay = startDate ? formatDate(startDate) : null;
    let endDay = endDate ? formatDate(endDate) : null;
    return { startDay, endDay };
  };

  const updateTooltip = (item) => {
    let nameRarity = rarityList.filter((i) => {
      return i.idOfType === item?.approvedNameId;
    });
    if (nameRarity.length) {
      nameRarity.forEach((element) => {
        let availableNfts = element.maxCount - element.currentCount;
        let totalAllowed = element.maxCount;
        let type = "Name";
        let tooltipMsg = `Rarity of this ${type}:`;

        let dates = calculateDate(element);
        if (dates.startDay && dates.endDay)
          tooltipMsg += `<br>- Mint from ${dates.startDay} to ${dates.endDay}. `;
        else if (dates.endDay)
          tooltipMsg += `<br>- Minting ends on ${dates.endDay}. `;

        if (availableNfts > 0) {
          tooltipMsg += `<br>- Only ${availableNfts} of ${totalAllowed} left.`;
        }
        setTooltipText(tooltipMsg);
        setShowRarityBox(true);
      });
    } else {
      setTooltipText("");
      setShowRarityBox(false);
    }
  };

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setList(false);
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }, [ref]);
  };

  const box = useRef(null);
  useOutsideAlerter(box);

  const getRare = (item) => {
    let hasRarity = rarityList.filter((i) => {
      return i.idOfType === item?.approvedNameId;
    }).length;
    if (hasRarity) {
      return <span className="rare-name">RARE</span>;
    }
  };

  return (
    <>
      <h3 className="mint__step-title">{title}</h3>
      <div
        className="nft-name__dropdown-wrapper"
        onClick={toggleList}
        ref={box}
      >
        <div
          className="nft-name__dropdown-top"
          onMouseEnter={() => updateTooltip(selectedItems.name)}
          onMouseLeave={() => setShowRarityBox(false)}
        >
          <div className="nft-name__dropdown-header">
            <span className="nft-name">
              {name}
              {/* {getRare(selectedItems.name)} */}
            </span>
          </div>
          <img
            src={chevron_down_dark}
            alt="down"
            className="chevron-down"
          ></img>
        </div>
        <div
          className={`nft-name__dropdown-bottom ${
            isListOpen ? "d-block" : "d-none"
          }`}
        >
          <ul className="nft-name__lists">
            {nameList.map((item, index) => (
              <li
                key={index}
                className="nft-name__list"
                onClick={() => changeName(item)}
              >
                {item.approvedName}
                {/* {getRare(item)} */}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* {showRarityBox && (
        <div className="rarity-box">
          <span
            className="rarity-text"
            dangerouslySetInnerHTML={{ __html: tooltipText }}
          ></span>
        </div>
      )} */}      
    </>
  );
};

export default Name;
