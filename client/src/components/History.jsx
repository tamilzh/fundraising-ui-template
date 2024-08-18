import React, { useEffect, useState } from "react";
import { fundRaisin } from "../contracts/fundraisin";

const History = ( {walletAddress}) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fundRaisin.salesHistory().then((h) => setHistory(h));
  }, [walletAddress]);

  return (
    <section id="history" className="page-settings">
      <h1 className="history__title title-styles">Sales History</h1>
      <div className="history__table">
        <div className="history__table-row row">
          <div className="history__table-column col-2">
            <h3 className="history__table-header">Number</h3>
          </div>
          <div className="history__table-column col-2">
            <h3 className="history__table-header">Name</h3>
          </div>
          <div className="history__table-column col-2">
            <h3 className="history__table-header">Price</h3>
          </div>
          <div className="history__table-column col-6">
            <h3 className="history__table-header">New Owner</h3>
          </div>
        </div>
        {history.map((item, index) => {
          return (
            <div className="history__table-row row">
              <div className="history__table-column col-2">
                <p className="history__table-data">{index+1}</p>
              </div>
              <div className="history__table-column col-2">
                <p className="history__table-data">{item.tokenName}</p>
              </div>
              <div className="history__table-column col-2">
                <p className="history__table-data">{item.price}AVAX</p>
              </div>
              <div className="history__table-column col-6">
                <p className="history__table-data">{item.buyer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default History;
