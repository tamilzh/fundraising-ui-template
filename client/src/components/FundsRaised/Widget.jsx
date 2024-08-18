/* eslint-disable no-extend-native */
import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import WidgetCard from "./WidgetCard";
import { useParams } from "react-router-dom";
import Spinner from "../Spinner";
import logo from "../../assets/images/logo.svg";
import "./index.css";
import { BASE_API } from "../../utils/services";

function Widget(props) {
  const { type } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [nftData, setNftData] = useState([]);
  const [totalFunded, setTotalFunded] = useState(0);
  const [usdPrice, setUSD] = useState(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState("")
  const link = process.env.REACT_APP_WEBSITE_LINK;
  const fundraisin_link = process.env.REACT_APP_FUNDRAISIN_WEBSITE_LINK;
  const getNetwork = async () => {
    const response = await fetch(`${BASE_API}/network`);
    const network = await response.json();
    return network;
  };

  const formatCurreny = (currency) => {
    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(currency);
  };

  useEffect(() => {
    const loadWidget = async () => {
      const network = await getNetwork();
      setMode(network.mode)
      const queryUSD = await fetch(`${BASE_API}/avax-to-usd`);
      const getUSD = await queryUSD.json();
      setUSD(getUSD?.usd || 0);
      const res = await fetch(`${BASE_API}/fundraisin/funds-raised/${type}`);
      const data = await res.json();
      setNftData(data.nft);
      setTotalFunded(data.totalValueFunded);
      setName(data.name);
      setLoading(false);
    };
    loadWidget();
  }, [link, type]);

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner spinner={isLoading} />
      ) : (
        <div className="widget-body">
          <div className="widget-box">
            <div>
              <div className="logo-wrapper">
                <img
                  src={logo}
                  className="logo"
                  alt="logo"
                  onClick={() => window.open(`${fundraisin_link}`, "_blank")}
                ></img>
              </div>
              <div className="desktop">
                <h1
                  className="title"
                  onClick={() => window.open(`${link}/`, "_blank")}
                >
                  Fund Raisin sponsor: The Catdrops Collection
                </h1>
                <h2 className="sub-title">
                  For the{" "}
                  <span style={{ textTransform: "capitalize" }}>{type}</span>:{" "}
                  {name}
                </h2>
              </div>
              <div className="mobile">
                <h1
                  className="title"
                  onClick={() => window.open(`${link}/`, "_blank")}
                >
                  Fund Raisin sponsor: <br></br> The Catdrops Collection
                </h1>
                <h2 className="sub-title">
                  For the{" "}
                  <span style={{ textTransform: "capitalize" }}>{type}</span>:{" "}
                  <br></br> {name}
                </h2>
              </div>
              <div className="raised-group-wrapper">
                <div className="raised-group">
                  <div className="label">Funds Raised So Far </div>
                  <div className="value">{totalFunded} {mode === "production" ? "AVAX" : "Fuji AVAX"} </div>
                </div>
                <span className="equal">=</span>
                <div className="raised-group">
                  <div className="label">Today's market prices</div>
                  <div className="value">
                    <span>{formatCurreny(usdPrice * totalFunded)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="widget widget-footer widget-desktop">
              <Swiper
                slidesPerView={3}
                spaceBetween={40}
                navigation={true}
                modules={[Navigation]}
                className="widget-swiper"
              >
                {" "}
                {}
                <div className="swiper-wrapper swiper-wrap">
                  {nftData.map((widgetCard) => (
                    <SwiperSlide key={widgetCard.id} className="swiper-slide">
                      <WidgetCard
                        key={widgetCard.id}
                        widgetCard={widgetCard}
                        overlayText={widgetCard.forSale}
                        link={
                          widgetCard.forSale
                            ? `${link}/buy/${widgetCard.tokenId}`
                            : `${link}/`
                        }
                        type={type}
                      />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            </div>
            <div className="widget widget-footer widget-mobile">
              <Swiper
                slidesPerView={1}
                navigation={true}
                modules={[Navigation]}
                className="widget-swiper"
              >
                {" "}
                {}
                <div className="swiper-wrapper swiper-wrap">
                  {nftData.map((widgetCard) => (
                    <SwiperSlide key={widgetCard.id} className="swiper-slide">
                      <WidgetCard
                        key={widgetCard.id}
                        widgetCard={widgetCard}
                        overlayText={widgetCard.forSale}
                        link={
                          widgetCard.forSale
                            ? `${link}/buy/${widgetCard.tokenId}`
                            : `${link}/`
                        }
                        type={type}
                      />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Widget;
