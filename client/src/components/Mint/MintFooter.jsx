import React from "react";
import ArrowLeft from "../Arrow_Left"
import ArrowRight from "../Arrow_Right"

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
            <ArrowLeft color={webPrimaryColor} />
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
                <ArrowRight color="#cbcbcb" />
              ) : (
                <ArrowRight color={webPrimaryColor} />
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
