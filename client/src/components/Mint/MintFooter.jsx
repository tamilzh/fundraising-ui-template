import React from "react";
import arrow_left from "../../assets/images/arrow_left.svg";
import arrow_right from "../../assets/images/arrow_right.svg";
import arrow_left_grey from "../../assets/images/arrow_left_grey.svg";
import arrow_right_grey from "../../assets/images/arrow_right_grey.svg";

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
}) => {
  const showPrevious = () => {
    if (stepState) {
      return (
        <button
          className="mint__btn no-border mint__btn-prev"
          onClick={Previous}
        >
          <div className="arrow-group left">
            <img src={arrow_left} alt="down" className="arrow-left"></img>
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
                <img
                  src={arrow_right_grey}
                  alt="down"
                  className="arrow-right"
                ></img>
              ) : (
                <img src={arrow_right} alt="down" className="arrow-right"></img>
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
