import React, { useState, useEffect } from "react";
import constant from "../../utils/constant";
import Card from "../Card";

const SalePopup = ({
  sliders,
  card,
  show,
  saleStatus,
  onClose,
  onCancel,
  onSale,
  onChangePrice,
}) => {
  const [activePrice, setActivePrice] = useState(card.originalPrice);

  const handleChange = (aa) => {
    onChangePrice(aa);
    setActivePrice(aa);
  };

  useEffect(() => {
    setActivePrice(card.originalPrice);
  }, [card.originalPrice, show]);

  return (
    <div className="salepopup">
      <h1 className="salepopup__title">
        {saleStatus === "Sell"
          ? `Sell ${card.name}`
          : `Cancel ${card.name} Sale`}
      </h1>
      <div className="salepopup__info-box">
        <div className="salepopup__info-box-left">
          <table className="sale-division">
            <tbody>
              <tr>
                <th></th>
                <th className="table-text-header">{card.distPresetName}</th>
                <th className="table-text-header">{constant.DIST}</th>
              </tr>
              <tr>
                <td className="table-text-data">{sliders[0].name}</td>
                <td className="table-text-data">{card.pieData[0].value}%</td>
                <td className="table-text-data">
                  {((activePrice * card.pieData[0].value) / 100).toFixed(2)}{" "}
                  AVAX
                </td>
              </tr>
              <tr>
                <td className="table-text-data">{sliders[1].name}</td>
                <td className="table-text-data">{card.pieData[1].value}%</td>
                <td className="table-text-data">
                  {((activePrice * card.pieData[1].value) / 100).toFixed(2)}{" "}
                  AVAX
                </td>
              </tr>
              <tr>
                <td className="table-text-data">{sliders[2].name}</td>
                <td className="table-text-data">{card.pieData[2].value}%</td>
                <td className="table-text-data">
                  {((activePrice * card.pieData[2].value) / 100).toFixed(2)}{" "}
                  AVAX
                </td>
              </tr>
              <tr>
                <td className="table-text-data">{sliders[3].name}</td>
                <td className="table-text-data">{card.pieData[3].value}%</td>
                <td className="table-text-data">
                  {((activePrice * card.pieData[3].value) / 100).toFixed(2)}{" "}
                  AVAX
                </td>
              </tr>
            </tbody>
          </table>

          <table className="sale-price">
            <tbody>
              <tr>
                <td className="table-text-data">Last Price:</td>
                <td className="table-text-data">{card.originalPrice} AVAX</td>
              </tr>
              <tr>
                <td className="table-text-data">Sell Price (AVAX):</td>
                <td className="table-text-data">
                  {saleStatus === "Sell" ? (
                    <input
                      className="sale-price__input"
                      onInput={(e) => handleChange(e.target.value)}
                      type="number"
                      min="0"
                      step=".01"
                      placeholder={card.originalPrice}
                      value={activePrice}
                    ></input>
                  ) : (
                    `${card.price} AVAX`
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="salepopup__info-box-right">
          <div className="mint-card">
            <Card card={card} show={show} overlay={!(saleStatus === "Sell")} />
          </div>
        </div>
      </div>
      <div className="sale-btns row">
        <button className="cancel-btn" onClick={onClose}>
          Back
        </button>
        {saleStatus === "Sell" ? (
          <button
            className="sale-btn"
            onClick={onSale}
            disabled={
              activePrice === "" || activePrice === undefined ? true : false
            }
          >
            Place your Catdrop for Sale
          </button>
        ) : (
          <button className="sale-btn" onClick={onCancel}>
            Cancel Sale
          </button>
        )}
      </div>
    </div>
  );
};

export default SalePopup;
