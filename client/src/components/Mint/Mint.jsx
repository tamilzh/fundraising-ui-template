/* eslint-disable no-extend-native */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import NftPreview from "./NftPreview";
import MintFooter from "./MintFooter";
import Catalogue from "./Catalogue";
import Name from "./Name";
import Distribution from "./Distribution";
import PieDist from "./PieDist";
import FinalCheck from "./FinalCheck";
import { fundRaisin } from "../../contracts/fundraisin";
import Spinner from "../Spinner";
import { useNavigate, useOutletContext } from "react-router-dom";
import error from "../../config/error.json";
import { logError, logInfo } from "../../utils/log";
import Modal from "../Modal/Modal";
import Popup from "../Modal/Popup";
import Error from "../Modal/Error";
import Warning from "../Modal/Warning";
import {
  getBackgrounds,
  getPatterns,
  getLayers,
  getLayerChoices,
  getApprovedNames,
  getPresetDistribution,
  getRarityList,
  isApproved,
  getPreviewImage,
} from "../../utils/services";
import constant from "../../utils/constant";
import { v4 as uuidv4 } from "uuid";
import { addLayerChoiceDynamically } from "../../utils/common";

const Mint = () => {
  const [
    siteDetails,
    walletAddress,
    connectWallet,
    isWalletConnected,
    ,
    ,
    ,
    ,
    ,
    ,
    forceUpdate,
  ] = useOutletContext();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [layers, setLayers] = useState([]);
  const [sliders, setDefaultSlider] = useState([]);
  const [presetDistribution, setPresetDistribution] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [pieData, setPieData] = useState([]);
  const [preset, setPreset] = useState("");
  const [showPreset, setShowPreset] = useState(true);
  const [names, setNames] = useState([]);
  const [data, setData] = useState([]);
  const [identifier, setIdentifier] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [stepState, setStep] = useState(0);
  const [previewLink, setPreviewLink] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [warnShow, setWarnShow] = useState(false);
  const [errMessage, setErrorMessage] = useState();
  const [rarityList, setRarityList] = useState();
  const [removedSteps, setRemovedSteps] = useState({});
  const [layerWiseChoice, setLayerWiseChoice] = useState({});
  const [previewQuery, setPreviewQuery] = useState();
  const [rarityData, setRarityData] = useState({
    background: {},
    pattern: {},
    layer: {},
    layerchoice: {},
    layerclass: {},
    layerstylecolor: {},
    name: {},
  });
  const [layerChoicesAreSingle, setLayerChoicesAreSingle] = useState(0);
  const [autoPreview, setAutoPreview] = useState([]);
  const [delayedName, setDelayName] = useState("");

  const checkSiteActive = async () => {
    let siteActive = await isApproved();
    if (!siteActive[0]) {
      let errorMsg = "";
      const { startsOn } = siteDetails;
      if (siteActive[1] === "SNA") {
        // giving 30 sec time to allow mint immedialtely the countdown reaches 00
        if (Math.floor(Date.now() / 1000) - startsOn >= 30) {
          errorMsg = error[siteActive[1]];
        } else if (Math.floor(Date.now() / 1000) - startsOn <= 0) {
          errorMsg = `Minting begins ${new Date(startsOn * 1000)}`;
        }
      } else {
        errorMsg = error[siteActive[1]];
      }
      openErrorModal(errorMsg);
    }
  };

  const validatePatternAndLayers = () => {
    const alllayers = layers.filter(
      (layer) => layer.patternId === selectedItems?.pattern?.patternId
    );
    return alllayers.length === layers.length;
  };

  const artOptionstemp = [
    {
      title: constant.BACKGROUND_COLOR,
      identifier: "background",
      category: "background",
      widget: "catalogue",
      preview: true,
      navButton: constant.BACKGROUND_COLOR,
      getData: async function () {
        try {
          if (backgroundColor.length === 0) {
            let bg = await getBackgrounds(siteDetails.artCreationPackId);
            setBackgroundColor(bg);
            setData([...bg]);
          } else {
            setData([...backgroundColor]);
          }
          setLoading(false);
        } catch (err) {
          logError(err);
          setLoading(false);
        }
      },
    },
    {
      title: constant.PATTERN,
      identifier: "pattern",
      category: "pattern",
      widget: "catalogue",
      preview: true,
      navButton: constant.PATTERN,
      getData: async function () {
        if (patterns.length === 0) {
          let pattern = await getPatterns(siteDetails.artCreationPackId);
          setPatterns(pattern);
          setData([...pattern]);
        } else {
          setData([...patterns]);
        }
        setLoading(false);
      },
    },
    {
      title: constant.NAME,
      identifier: "name",
      category: "name",
      widget: "name",
      preview: false,
      navButton: undefined,
      getData: async function () {
        if (names.length === 0) {
          const names = await getApprovedNames(siteDetails.artCreationPackId);
          setNames(names);
        }
        setLoading(false);
      },
    },
    {
      title: constant.PICK_DISTRO,
      identifier: "distribution",
      category: "distribution",
      widget: "distribution",
      preview: false,
      navButton: constant.ALTER_EGO,
      getData: async function () {
        if (sliders.length === 0) {
          setDefaultSlider(siteDetails.sliders);
          setPresetDistribution(await getPresetDistribution());
        }
        setLoading(false);
      },
    },
    {
      title: constant.FINAL_TEXT,
      identifier: "confirmation",
      category: "confirmation",
      navButton: constant.FINAL_CHECK,
      widget: "final",
      preview: false,
      getData: function () {
        setLoading(false);
      },
    },
  ];

  const [artOptions, setArtOptions] = useState(artOptionstemp);

  useEffect(() => {
    const constructLayerChoices = async () => {
      let start = stepState + 1;
      let layerChoiceCount = 0;
      for (let count = 0; count < layers.length; count++) {
        let layerChList = layerWiseChoice[layers[count].layerId];
        if (!layerChList) {
          layerChList = await getLayerChoices(
            siteDetails.artCreationPackId,
            selectedItems.pattern.patternId,
            layers[count].layerId
          );
          setLayerWiseChoice((previous) => ({
            ...previous,
            [layers[count].layerId]: layerChList,
          }));
        }
        if (layerChList.length === 1) {
          setLayerChoicesAreSingle(++layerChoiceCount);
          if (layerChList[0])
            // eslint-disable-next-line no-loop-func
            setRemovedSteps((removedSteps) => ({
              ...removedSteps,
              [`layerchoice${count}`]: {
                ...layerChList[0],
                category: "layerchoice",
                step: start,
              },
            }));
        } else {
          const dynamicLayerChoice = await addLayerChoiceDynamically(
            count,
            layers,
            setData,
            setLoading,
            layerChList
          );
          artOptionstemp.insert(start++, dynamicLayerChoice);
          setArtOptions(artOptionstemp);
          setRarityData((obj) => ({
            ...obj,
            [dynamicLayerChoice.identifier]: {},
          }));
        }
      }
      if (layerChoiceCount > 0 && layerChoiceCount === layers.length)
        setDelayName(constant.NAME);
      setLoading(false);
    };
    constructLayerChoices();
  }, [layers]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    checkSiteActive();
  }, []);

  useEffect(() => {
    artOptions[stepState].getData();
    setTitle(artOptions[stepState].title);
    setIdentifier(artOptions[stepState].identifier);
    setCategory(artOptions[stepState].category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepState]);

  useEffect(() => {
    const previewData = async () => {
      if (artOptions[stepState].preview || autoPreview.length ) await preview();
      else setLoading(false);
    };
    if (Object.keys(selectedItems).length > 0) previewData();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedItems)]);

  useMemo(() => {
    const getRarity = async () => {
      let rarity = await getRarityList(siteDetails.siteId);
      setRarityList(rarity);      
      logInfo("get rarity info", rarity);
    };
    getRarity();
  }, []);

  useMemo(() => {
    const getPresetDistributions = async () => {
      if (Object.keys(siteDetails).length > 0 && sliders.length === 0) {
        setDefaultSlider(siteDetails.sliders);
        const presetExists = await getPresetDistribution();
        if (!presetExists.length) {
          setShowPreset(false);
        }
        setPresetDistribution(presetExists);
      }
      setLoading(false);
    };
    getPresetDistributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDetails.sliders, sliders.length]);

  useEffect(() => {
    const updateLayer = async () => {
      const layers = await getLayers(
        siteDetails.artCreationPackId,
        selectedItems.pattern.patternId
      );
      setLayers(layers);
    };
    if (selectedItems?.pattern?.patternId) {
      setLoading(true);
      updateLayer();
      setArtOptions(artOptionstemp);
    }
  }, [selectedItems?.pattern?.patternId]);

  const openErrorModal = (err) => {
    setErrorMessage(err);
    setErrShow(!errShow);
  };

  const closeErrorModal = () => {
    setErrShow(!errShow);
  };

  const openWarnModal = () => {
    setWarnShow(!warnShow);
  };

  const closeWarnModal = () => {
    setWarnShow(!warnShow);
  };

  const prevStep = () => {
    if (
      artOptions[stepState - 1].category === "pattern" &&
      layerChoicesAreSingle !== layers.length
    )
      setDelayName();
    if (stepState !== 0) {
      setData([]);
      setLoading(true);
      setStep(stepState - 1);
    }
  };

  const nextStep = () => {
    let errorMsg = "";
    if (artOptions[stepState + 1].category === "layerchoice")
      setDelayName(constant.NAME);
    if (validateSelection()) {
      if (stepState < artOptions.length - 1) {
        setData([]);
        setLoading(true);
        const autoPreview = Object.keys(removedSteps).filter(
          (k) => removedSteps[k].step === stepState + 1
        );     
        setAutoPreview(autoPreview);
        for (const selection of autoPreview) {
          setSelectedItems((selectedItems) => ({
            ...selectedItems,
            [selection]: removedSteps[selection],
          }));
        }
        setStep(stepState + 1);
        window.scrollTo(0, 0);
      }
    } else {
      errorMsg = error.MINT_MANDATORY_OPTION_SELECT;
      openErrorModal(errorMsg);
    }
  };

  const validateSelection = () => {
    if (artOptions[stepState].category === "pattern") {
      if (artOptions[stepState + 1].category === "layerchoice") {
        if (!validatePatternAndLayers()) {
          return false;
        }
        return true;
      } else {
        if (
          layerChoicesAreSingle > 0 &&
          layerChoicesAreSingle === layers.length
        )
          return true;
        return false;
      }
    } else if (selectedItems[artOptions[stepState].identifier]) {
      return true;
    }
    return false;
  };

  const preview = async () => {
    setLoader(true);
    setLoading(true);
    previewQuery?.cancel();
    const body = { data: getPreviewData(), file: uuidv4() };
    const q = getPreviewImage(body);
    setPreviewQuery(q);
    q.then((base64) => {
      setLoader(false);
      setLoading(false);
      setPreviewLink(base64);
    }).catch((err) => {
      setLoader(false);
      setLoading(false);
    });
  };

  const mint = async (e) => {
    setWarnShow(!warnShow);
    let status = isWalletConnected;
    if (!isWalletConnected) {
      status = await connectWallet();
    }
    if (status) {
      setLoading(true);
      const _metadata = constructMintData();
      e.target.disabled = true;
      fetch(`/upload`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(_metadata),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            setLoading(false);
            e.target.disabled = false;
            alert("interenal server error");
          }
        })
        .then(function (res) {
          let mintRequest = constructMintRequestData(
            _metadata.nftMetadata,
            res
          );
          logInfo(mintRequest);
          mintToken(mintRequest, selectedItems.background.price.toString());
          e.target.disabled = false;
        });
    } else {
      setLoading(false);
    }
  };

  const constructMintRequestData = (metadata, res) => {
    return {
      siteId: siteDetails.siteId,
      name: {
        id: selectedItems.name.approvedNameId,
        name: `${selectedItems.name.approvedName} #${selectedItems.name.nextNameNumber}`,
        number: selectedItems.name.nextNameNumber,
      },
      description: metadata.description,
      presetDistribution: metadata.presetDistribution,
      attributes: metadata.attributes,
      distribution: [
        {
          value: selectedItems.distribution.fundraiserDistro,
          distCategory: "fundraiser",
        },
        {
          value: selectedItems.distribution.beneficiaryDistro,
          distCategory: "beneficiary",
        },
        {
          value: selectedItems.distribution.artistDistro,
          distCategory: "artist",
        },
      ],
      tokenUri: res.tokenUri,
    };
  };

  const constructMintData = () => {
    let nftMetadata = {};
    let attributes = [];
    nftMetadata.name = `${selectedItems.name.approvedName} #${selectedItems.name.nextNameNumber}`;
    nftMetadata.description = process.env.REACT_APP_WEBSITE_DESCRIPTION;
    nftMetadata.presetDistribution = selectedItems.distribution;
    nftMetadata.price = selectedItems.background.price.toString();
    nftMetadata.mintedAt = Number((new Date().getTime() / 1000).toFixed(0));
    nftMetadata.mintedBy = walletAddress;
    for (const choice in selectedItems) {
      const { category } = selectedItems[choice];
      if (category === "background") {
        attributes.push({
          rarityType: category,
          value: selectedItems[choice].colorHexCode,
          id: selectedItems[choice].backgroundId,
          trait_type: category,
        });
      } else if (category === "pattern") {
        attributes.push({
          rarityType: category,
          value: selectedItems[choice].patternName,
          id: selectedItems[choice].patternId,
          trait_type: category,
        });
      } else if (category === "layerchoice") {
        attributes.push({
          rarityType: category,
          value: selectedItems[choice].layerURL,
          id: selectedItems[choice].layerChoiceId,
          trait_type: category,
        });
      } else if (category === "approvedname") {
        attributes.push({
          rarityType: category,
          value: nftMetadata.name,
          id: selectedItems[choice].approvedNameId,
          trait_type: category,
        });
      } else if (category === "distribution") {
        attributes.push({
          rarityType: category,
          value: selectedItems[choice].presetName,
          id: 0,
          trait_type: category,
        });
      }
    }
    nftMetadata.attributes = attributes;
    return {
      finalNFTimage: { data: getPreviewData(), file: uuidv4() },
      nftMetadata,
    };
  };

  const mintToken = async (mintRequest, price) => {
    await fundRaisin
      .mint(mintRequest, price)
      .then((message) => {
        forceUpdate();
        logInfo(message);
        if (message === false) {
          setTimeout(() => {
            setLoading(false);
            setStep(0);
            //setSelectedItems({});
            navigate("/my");
          }, 5000);
        } else if (message.status > 0) {
          setLoading(false);
          setStep(0);
          navigate("/my");
        } else {
          openErrorModal(error.UNKNOWN_ERROR);
        }
      })
      .catch(async (err) => {
        logError(err);
        let errorMsg = "";
        if (err) {
          setLoading(false);
          if (err.error) {
            err.data = err.error;
          }
          if (err.data && err.data.message) {
            let customMessage = err.data.message.split(":");
            if (
              customMessage.length > 1 &&
              error[customMessage[1].trim()] !== undefined
            ) {
              errorMsg = `${error[customMessage[1].trim()]
                .replace("%1", "Catdrop")
                .replace("%2", "mint")
                .replace("%3", mintRequest.name.name)}`;
              if (customMessage[1].trim() === "ANE") setNames([]);
            } else {
              if ([32000].includes(Math.abs(err.data.code))) {
                errorMsg = error[Math.abs(err.code)]
                  .replace("%1", "Catdrop")
                  .replace("%2", "mint")
                  .replace("%3", mintRequest.name.name);
              } else {
                errorMsg = err.data.message;
              }
            }
          } else if ([4001, 4100].includes(err.code)) {
            errorMsg = error[Math.abs(err.code)]
              .replace("%1", "Catdrop")
              .replace("%2", "mint")
              .replace("%3", mintRequest.name.name);
          } else {
            errorMsg = error.UNKNOWN_ERROR;
          }
          openErrorModal(errorMsg);
        }
      });
  };

  const setUserSelection = async (selected) => {
    let _update = Object.assign(selectedItems, selected);
    setSelectedItems({ ..._update });
    logInfo(_update);
  };

  const getPreviewData = () => {
    let data = [];
    for (const choice in selectedItems) {
      const { category } = selectedItems[choice];
      if (category === "background") {
        data.push({
          value: selectedItems[choice].colorHexCode,
          type: "color",
          class: "background",
        });
      } else if (category === "pattern") {
        data.push({
          value: selectedItems[choice].patternURL,
          type: "layer",
          class: "patterns",
          name: `pattern-${selectedItems[choice].patternId}`,
        });
      } else if (category === "layerchoice") {
        data.push({
          value: selectedItems[choice].layerURL,
          type: "layer",
          class: "patterns",
          name: `layer-${selectedItems[choice].layerChoiceId}`,
        });
      }
    }
    return data;
  };

  const renderWarnPopup = () => {
    let sellerDistribution = 100;
    if (selectedItems.distribution !== undefined) {
      let dist = selectedItems.distribution;
      sellerDistribution -=
        (dist.fundraiserDistro + dist.beneficiaryDistro + dist.artistDistro) /
        100;
    }
    return (
      <Modal show={warnShow} type={"warn"}>
        <Popup type={"warn"}>
          <Warning
            confirmAction={mint}
            onClose={closeWarnModal}
            sellerDistribution={sellerDistribution}
          />
        </Popup>
      </Modal>
    );
  };

  const renderErrorPopup = () => {
    return (
      <Modal show={errShow}>
        <Popup>
          <Error err={errMessage} onClose={closeErrorModal} />
        </Popup>
      </Modal>
    );
  };

  const renderStep = () => {
    if (artOptions[stepState].widget === "catalogue") {
      return (
        <Catalogue
          category={category}
          identifier={identifier}
          data={data}
          setUserSelection={setUserSelection}
          selectedItems={selectedItems}
          title={title}
          rarityList={rarityList}
          rarityData={rarityData}
          setRarityData={setRarityData}
        />
      );
    } else if (artOptions[stepState].widget === "name") {
      return (
        <Name
          nameList={names}
          setUserSelection={setUserSelection}
          selectedItems={selectedItems}
          title={title}
          rarityList={rarityList.filter((i) => {
            return i.rarityType === "approvedname";
          })}
        />
      );
    } else if (artOptions[stepState].widget === "distribution") {
      return (
        <Distribution
          setUserSelection={setUserSelection}
          distribution={presetDistribution}
          sliders={sliders}
          pieData={pieData}
          setPieData={setPieData}
          preset={preset}
          setPreset={setPreset}
          showPreset={showPreset}
          setShowPreset={setShowPreset}
          setDefaultSlider={setDefaultSlider}
          title={title}
          selectedItems={selectedItems}
        />
      );
    } else if (artOptions[stepState].widget === "final") {
      return (
        <FinalCheck
          selectedItems={selectedItems}
          setUserSelection={setUserSelection}
          artOptions={artOptions}
          sliders={sliders}
          preset={preset}
          title={title}
          rarityData={rarityData}
          previewLink={previewLink}
        />
      );
    }
  };

  const renderStepPreview = () => {
    if (["catalogue", "name", "final"].includes(artOptions[stepState].widget)) {
      return (
        <NftPreview
          loader={loader}
          input={selectedItems}
          previewLink={previewLink}
          pieData={pieData}
          preset={preset}
          widget={artOptions[stepState].widget}
        />
      );
    } else if (["distribution"].includes(artOptions[stepState].widget)) {
      return (
        <PieDist
          pieData={pieData}
          preset={preset}
          sliders={sliders}
          previewLink={previewLink}
          widget={artOptions[stepState].widget}
        />
      );
    }
  };

  const renderContent = () => {
    return (
      <section id="mint" className="page-settings">
        <Spinner spinner={isLoading} />
        {renderErrorPopup()}
        {renderWarnPopup()}

        <h1 className="mint__title title-styles-nocaptial">
          {constant.MINT_TITLE}
        </h1>
        <div className="mint__box">
          <div className="mint__box-wrapper">
            <div className="mint__steps">
              <div className="mint__steps-left">
                {/* <h3 className="mint__step-title">{title}</h3> */}
                {renderStep()}
              </div>
              <div className="mint__steps-right">{renderStepPreview()}</div>
            </div>
            <MintFooter
              nextHover={`Please select a ${title} first`}
              nextButton={artOptions[stepState + 1]?.navButton || delayedName}
              backButton={artOptions[stepState - 1]?.navButton || delayedName}
              stepTotal={artOptions.length - 1}
              stepState={stepState}
              validateSelection={validateSelection}
              input={selectedItems}
              Previous={prevStep}
              Continue={nextStep}
              MintNft={openWarnModal}
            />
          </div>
        </div>
        <div className="mint__box-mobile">
          <div className="mint__steps-mobile">
            <div className="mint__steps-top">{renderStepPreview()}</div>
            <div className="mint__steps-bottom">{renderStep()}</div>
          </div>
          <MintFooter
            nextHover={`Please select a ${title} first`}
            nextButton={artOptions[stepState + 1]?.navButton || delayedName}
            backButton={artOptions[stepState - 1]?.navButton || delayedName}
            stepTotal={artOptions.length - 1}
            stepState={stepState}
            validateSelection={validateSelection}
            input={selectedItems}
            Previous={prevStep}
            Continue={nextStep}
            MintNft={openWarnModal}
          />
        </div>
      </section>
    );
  };

  return <React.Fragment>{renderContent()}</React.Fragment>;
};

Array.prototype.insert = function (index, ...items) {
  this.splice(index, 0, ...items);
};

export default Mint;
