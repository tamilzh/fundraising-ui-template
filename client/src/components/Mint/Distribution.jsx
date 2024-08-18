import React, { useState, useEffect } from "react";
import constant from "../../utils/constant";
import Sliders from "../Slider/Sliders";

const Distribution = ({
  distribution,
  sliders,
  setPieData,
  pieData,
  setUserSelection,
  preset,
  setPreset,
  setDefaultSlider,
  showPreset,
  setShowPreset,
  selectedItems,
}) => {
  const [slider, setSlider] = useState([]);
  const sliderClass = !showPreset ? "d-block" : "d-none";
  const presetClass = showPreset ? "d-block" : "d-none";
  const presetBtm = showPreset ? "I will decide" : constant.BACK_TO_PRESET;
  const [distTitle, setDistTitle] = useState(constant.PICK_DISTRO);
  const togglePreset = () => {
    setShowPreset(!showPreset);
  };

  useEffect(() => {
    if (selectedItems?.distribution?.presetName === constant.MY_DISTRO)
      setShowPreset(false);
  }, []);

  useEffect(() => {
    setSlider(sliders.map((a) => a.defaultValue));
    setPieData(sliders.map((a) => a.defaultValue));
    if (showPreset) {
      setDistTitle(constant.PICK_DISTRO);
    } else {
      setDistTitle(constant.DISTRIBUTION);
      setPreset(constant.MY_DISTRO);
    }
  }, [showPreset, setPreset, sliders, setSlider, setPieData, setDistTitle]);

  const changePreset = (id) => {
    if (distribution.length) {
      let pd = [];
      //Please dont change the order this will impact
      pd[0] = distribution[id].beneficiaryDistro / 100;
      pd[1] = distribution[id].artistDistro / 100;
      pd[2] = distribution[id].fundraiserDistro / 100;
      pd[3] = 100 - (pd[0] + pd[1] + pd[2]);
      setPieData([...pd]);
      setPreset(distribution[id].shortPresetName);
      setUserSelection({
        distribution: {
          presetName: distribution[id].shortPresetName,
          beneficiaryDistro: pd[0] * 100,
          artistDistro: pd[1] * 100,
          fundraiserDistro: pd[2] * 100,
          sellerDistro: pd[3] * 100,
          category: "distribution",
          actualName: distribution[id].presetName,
        },
      });
      let setSliderDefaultToPreset = sliders.map((sl, i) => {
        sl.defaultValue = pd[i]; // > sl.min ? pd[i] : sl.min;
        return sl;
      });
      setDefaultSlider(setSliderDefaultToPreset);
    }
  };

  const handleChange = (newSlider) => {
    setSlider(newSlider);
    let pd = pieData;
    pd[0] = newSlider[0]; // Beneficiary
    pd[1] = newSlider[1]; // Artist
    pd[2] = newSlider[2]; // Fundraiser
    pd[3] = newSlider[3]; // Seller
    setPieData([...pd]);
    setPreset(constant.MY_DISTRO);
    setUserSelection({
      distribution: {
        presetName: constant.MY_DISTRO,
        beneficiaryDistro: pd[0] * 100,
        artistDistro: pd[1] * 100,
        fundraiserDistro: pd[2] * 100,
        sellerDistro: pd[3] * 100,
        category: "distribution",
      },
    });
    let setSliderDefaultToPreset = sliders.map((sl, i) => {
      sl.defaultValue = pd[i]; // > sl.min ? pd[i] : sl.min;
      return sl;
    });
    setDefaultSlider(setSliderDefaultToPreset);
  };

  useEffect(() => {
    if (preset.length === 0) changePreset(0);
  }, [distribution.length]);

  const renderContent = () => {
    return (
      <>
        <h3 className="mint__step-title">{distTitle}</h3>
        <div className="mint__dist">
          <span className="mint__dist-desc">
            Pick your Alter-Ego for funds distribution when this NFT is minted
            and each time it is sold:
          </span>
          <div className="mint__dist-presets">
            <div className="preset-wrapper">
              <div className={presetClass}>
                <div className="mint__dist-presets--predefined">
                  {distribution.map((dist, index) => (
                    <div
                      key={index}
                      className={`dist-preset__box ${
                        dist.presetName ===
                        selectedItems?.distribution?.actualName
                          ? "dist-preset__box--selected"
                          : ""
                      }`}
                      onClick={() => changePreset(index)}
                    >
                      <span className="dist-preset__text">
                        {dist.presetName === "I Only Love Octopi"
                          ? "I Only ❤️ Octopi"
                          : dist.presetName === "Art Lover"
                          ? "🎨 Lover"
                          : dist.presetName === "Cat Lover"
                          ? "🐱 Lover"
                          : dist.presetName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={sliderClass}>
                <div className="slider-box">
                  <Sliders
                    sliders={sliders}
                    slider={slider}
                    handleChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="mint__dist-presets--custom">
              <div
                className={`dist-preset__box large-box ${
                  constant.MY_DISTRO === preset
                    ? "dist-preset__box--selected"
                    : ""
                }`}
                onClick={togglePreset}
              >
                <span className="dist-preset__text">{presetBtm}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return <React.Fragment>{renderContent()}</React.Fragment>;
};

export default Distribution;
