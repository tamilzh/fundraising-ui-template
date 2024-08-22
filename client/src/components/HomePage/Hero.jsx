/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Fade } from "react-slideshow-image";
import { HashLink as Link } from "react-router-hash-link";
import Image1 from "../../assets/images/hero_nfts/Catdrop1.svg";
import Image2 from "../../assets/images/hero_nfts/Catdrop2.svg";
import Image3 from "../../assets/images/hero_nfts/Catdrop3.svg";
import { useState } from "react";
import { getTokenOwner } from "../../utils/services";
import { getThemeConfig }from "../../utils/common";

const Hero = (props) => {
  //const { nftData } = props; for listing top fundraiser
  const [nftData, setNftData] = useState([
    {
      name: "Jennifurr #1",
      image: Image2,
      currentOwner: "",
      tokenId: 1,
    },
    {
      name: "Sylvester #1",
      image: Image3,
      currentOwner: "",
      tokenId: 2,
    },
    {
      name: "Pawtato #1",
      image: Image1,
      currentOwner: "",
      tokenId: 3,
    },
  ]);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [campaignStatus, setCampaignStatus] = useState("");
  const owner = async () => {
    let newData = nftData;
    for (let index = 0; index < newData.length; index++) {
      let nft = newData[index];
      newData[index].currentOwner = await getTokenOwner(nft.tokenId);
    }
    setNftData([...newData]);
  };

  const getCampaignDates = () => {
    const countdownEnddate = new Date(
      props.siteDetails.endsOn * 1000
    ).getTime();
    const countdownStartdate = new Date(
      props.siteDetails.startsOn * 1000
    ).getTime();
    const now = new Date().getTime();
    let diff = 0;
    if (countdownStartdate > now) {
      diff = countdownStartdate - now;
      setCampaignStatus("Campaign starts in");
      calculateTimer(diff);
      setShowTimer(true)
    } else if (countdownStartdate < now && countdownEnddate > now) {
      diff = countdownEnddate - now;
      setCampaignStatus("ends in");
      calculateTimer(diff);
      setShowTimer(true)
    } else if (countdownEnddate !== 0 && countdownEnddate < now) {
      setCampaignStatus("Campaign minting has ended");
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      setShowTimer(false)
    } else if (countdownEnddate === 0 && (countdownStartdate === 0 || countdownStartdate < now)) {
      setCampaignStatus("Campaign is ongoing");
      setShowTimer(false);
    }

    //const numberOfDays = Math.floor(diff/(24*3600*1000))
  };

  const calculateTimer = (diff) => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const remainingMonth = Math.floor(diff / month);
    const remainingDays = Math.floor((diff % month) / day);
    const remainingHours = Math.floor((diff % day) / hour);
    const remainingMinutes = Math.floor((diff % hour) / minute);
    const remainingSecond = Math.floor((diff % minute) / second);
    setMonths(remainingMonth);
    setDays(remainingDays);
    setHours(remainingHours);
    setMinutes(remainingMinutes);
    setSeconds(remainingSecond);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getCampaignDates();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [text, setText] = useState();

  useEffect(() => {
    if (sessionStorage.getItem("beta") === null) {
      setBeta();
    } else {
      setText(JSON.parse(sessionStorage.getItem("beta")));
    }
    owner();
  }, []);

  const setBeta = () => {
    setText({
      name: "The project is in BETA. Use at your own risk.",
      style: "beta-alert-text-pre",
    });
    setTimeout(() => {
      var beta = {
        name: "BETA",
        style: "beta-alert-text-post",
      };
      setText(beta);
      sessionStorage.setItem("beta", JSON.stringify(beta));
    }, 10000);
  };

  const reset = () => {
    setBeta();
  };

  const getContent = () => {
    if (nftData && nftData.length) {
      return nftData.map((card, index) => {
        return (
          <div className="hero__nft-wrapper" key={index}>
            <div className="hero__nft-img-box">
              {/* <img 
                className="hero__nft-bg"
                src={box_orange}
                /> */}
              <img
                className="hero__nft-img"
                src={card.image}
                alt="Catdrop"
              ></img>
            </div>
            <div>
              <p className="hero__nft-name">{card.name}</p>
              <p className="hero__nft-owner">
                {card.currentOwner.length > 0
                  ? `Owned by ${card.currentOwner.slice(
                      0,
                      6
                    )}...${card.currentOwner.slice(
                      card.currentOwner.length - 4
                    )}`
                  : ""}
              </p>
            </div>
          </div>
        );
      });
    }
    return <></>;
  };
  return (
    <>
      <span className="link_wrapper" id="home"></span>
      <div className="snackbar">
        <div className="snackbar-countdown-container">
          <span className="snackbar-text">{campaignStatus}</span>
          <div
            className="snack-box"
            style={{
              display: `${months === 0 ? "none" : "inline-block"}`,
            }}
          >
            <span className="snack-box-text">
              {months < 10 ? "0" + months : months}
            </span>
          </div>
          <span
            className="snackbar-text"
            style={
              months === 0 ? { display: "none" } : { display: "inline-block" }
            }
          >
            M
          </span>
          <div
            className="snack-box"
            style={
              days === 0 ? { display: "none" } : { display: "inline-block" }
            }
          >
            <span className="snack-box-text">
              {days < 10 ? "0" + days : days}
            </span>
          </div>
          <span
            className="snackbar-text"
            style={
              days === 0 ? { display: "none" } : { display: "inline-block" }
            }
          >
            D
          </span>
          <div
            className="snack-box"
            style={
              !showTimer
                ? { display: "none" }
                : { display: "inline-block" }
            }
          >
            <span className="snack-box-text">
              {hours < 10 ? "0" + hours : hours}
            </span>
          </div>
          <span
            className="snackbar-text"
            style={
              !showTimer
                ? { display: "none" }
                : { display: "inline-block" }
            }
          >
            :
          </span>
          <div
            className="snack-box"
            style={
              !showTimer
                ? { display: "none" }
                : { display: "inline-block" }
            }
          >
            <span
              className="snack-box-text"
              style={
                !showTimer
                  ? { display: "none" }
                  : { display: "inline-block" }
              }
            >
              {minutes < 10 ? "0" + minutes : minutes}
            </span>
          </div>
          <span
            className="snackbar-text"
            style={
              !showTimer
                ? { display: "none" }
                : { display: "inline-block" }
            }
          >
            :
          </span>
          <div
            className="snack-box"
            style={
              !showTimer
                ? { display: "none" }
                : { display: "inline-block" }
            }
          >
            <span
              className="snack-box-text"
              style={
                !showTimer
                  ? { display: "none" }
                  : { display: "inline-block" }
              }
            >
              {seconds < 10 ? "0" + seconds : seconds}
            </span>
          </div>
        </div>
        <div className="snackbar-countdown-container">
          {props?.siteDetails?.maxCount > 0 && (
            <>
              <div className="snack-box">
                <span className="snack-box-text">
                  {props?.siteDetails?.minted}
                </span>
              </div>
              <span className="snackbar-text">
                {" "}
                {campaignStatus.indexOf("minting has ended") === -1 ? "out of" : "of"}
              </span>
            </>
          )}
          <div className="snack-box">
            <span className="snack-box-text">
              {props?.siteDetails?.maxCount > 0 &&
              campaignStatus.indexOf("minting has ended") === -1
                ? props?.siteDetails?.maxCount
                : props?.siteDetails?.minted}
            </span>
          </div>
          <span className="snackbar-text">
            {" "}
            {campaignStatus.indexOf("minting has ended") === -1 ? "have been" : "were"}{" "}
            minted{" "}
          </span>
        </div>
      </div>

      <section className="hero">
        <div className="hero__desktop">
          <div className="hero__box">
            <div className="hero__box-left">
              <div className="beta-alert">
                <span className={text?.style} onMouseEnter={() => reset()}>
                  {text?.name}
                </span>
              </div>
              <h1 className="hero__title">
                The {getThemeConfig().APP_NFT_PLURAL} Collection
              </h1>
              <p className="hero__desc">Discover, collect, and trade extraordinary {getThemeConfig().APP_NFT_PLURAL} while [purpose] with [beneficiary].</p>
              <Link to="/#about" smooth offset={-70} duration={500}>
                <span className="hero__btn">Find out more</span>
              </Link>
            </div>
            <div className="hero__box-right">
              <Fade autoplay={true}>{getContent()}</Fade>
            </div>
          </div>
        </div>
        <div className="hero__mobile">
          <div className="hero__box">
            {/* <div className="hero__box-left"> */}
            {/* <div className="beta-alert">
                <span className={text?.style} onMouseEnter={() => reset()}>
                  {text?.name}
                </span>
              </div> */}
            <h1 className="hero__title">
              The {getThemeConfig().APP_NFT_PLURAL} Collection
            </h1>
            <div className="hero__nft-box">
              <Fade autoplay={true}>{getContent()}</Fade>
            </div>
            <p className="hero__desc">Discover, collect, and trade extraordinary {getThemeConfig().APP_NFT_PLURAL} while [purpose] with [beneficiary].</p>
            <Link to="/#about" smooth offset={-70} duration={500}>
              <span className="hero__btn">Find out more</span>
            </Link>
            {/* </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
