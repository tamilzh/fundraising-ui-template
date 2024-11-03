import React from "react";
import arrow_left from "../../assets/images/arrow_left.svg";
import arrow_right from "../../assets/images/arrow_right.svg";
import arrow_left_grey from "../../assets/images/arrow_left_grey.svg";
import arrow_right_grey from "../../assets/images/arrow_right_grey.svg";
import Arrow_Left from "../Arrow_Left"
import Arrow_Right from "../Arrow_Right"

const MintFooter = ({
  nextHover,
  nextButton,
  backButton,
  stepTotal,
  stepState,
  validateSelection,
  Previous,
  Continue,
  MintNft,
  webPrimaryColor
}) => {
  const showPrevious = () => {
    if (stepState) {
      return (
        <button
          className="mint__btn no-border mint__btn-prev"
          onClick={Previous}
        >
          <div className="arrow-group left">
            <Arrow_Left color={webPrimaryColor}/>
            {backButton}
          </div>
        </button>
      );
    }
  };

  const showNext = () => {
    if (stepState < stepTotal) {
      return (
        <>
          <button
            className="mint__btn no-border mint__btn-next tooltip"
            onClick={Continue}
            disabled={!validateSelection() ? true : false}
          >
            {!validateSelection() ? <span className="tooltiptext">{nextHover}</span> : <></>}            
            <div className="arrow-group right">
              {nextButton}
              {!validateSelection() ? (
                <Arrow_Right color="#cbcbcb" />
              ) : (
                <Arrow_Right color={webPrimaryColor} />
              )}
              
            </div>
          </button>
        </>
      );
    }
  };

  const showMint = () => {
    if (stepState === stepTotal) {
      return (
        <div className="mint__btn no-border mint__btn-next" onClick={MintNft}>
          <span></span>Mint!
        </div>
      );
    }
  };
  return (
    <div className="mint_btn_wrapper">
      {showPrevious()}
      {showNext()}
      {showMint()}
    </div>
  );
};

export default React.memo(MintFooter);
