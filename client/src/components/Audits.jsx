import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Audit from "../md/Audits.md";

const Audits = () => {
  const [md, setMD] = useState({});
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  useEffect(() => {
    fetch(Audit)
      .then((response) => response.text())
      .then((text) => {
        text = text.replace(
          new RegExp("{__beneficiary__}", "g"),
          process.env.REACT_APP_WEBSITE_BENEFICIARY
        );
        text = text.replace(
          new RegExp("{__artist__}", "g"),
          process.env.REACT_APP_WEBSITE_ARTIST
        );
        text = text.replace(
          new RegExp("{__fundraiser__}", "g"),
          process.env.REACT_APP_WEBSITE_FUNDRAISER
        );
        setMD(text);
      });
  }, []);

  return (
    <section id="audits" className="page-settings">
      <h1 className="audits__title title-styles-nocaptial">Audits</h1>
      <div className="faqs__qas-box">
        <div className="faqs__md">
          <ReactMarkdown>{md}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
};

export default Audits;
