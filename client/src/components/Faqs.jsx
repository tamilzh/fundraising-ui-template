import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Faq from "../md/Faqs.md";
import { BASE_API } from "../utils/services";
import { getThemeConfig }from "../utils/common";

const Faqs = () => {
  const [build, setBuild] = useState({});
  const [md, setMD] = useState(undefined);
  const [isLoading, setLoading] = useState(true);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    fetch(Faq)
      .then((response) => response.text())
      .then((text) => {
        text = text.replace(
          new RegExp("{__beneficiary__}", "g"),
          getThemeConfig().APP_BENEFICIARY
        );
        text = text.replace(
          new RegExp("{__artist__}", "g"),
          getThemeConfig().APP_ARTIST
        );
        text = text.replace(
          new RegExp("{__fundraiser__}", "g"),
          getThemeConfig().APP_SPONSOR
        );
        setMD(text);
      });
    const getBuildInfo = async () => {
      let response = await fetch(`${BASE_API}/build`);
      let buildInfo = await response.json();
      setBuild(buildInfo);
    };
    getBuildInfo();
  }, []);

  useEffect(() => {
    if (md !== undefined) {
      setLoading(false);
    }
  }, [md]);

  const renderFaqContent = () => {
    return (
      <>
        <ReactMarkdown>
          {"## What versions of the software are running?"}
        </ReactMarkdown>
        <p>
          The website version is {`v${build.version}#${build.number}`}. The
          smart contract version is v{build.contractVersion}.
        </p>
      </>
    );
  };

  return (
    <section id="faqs" className="page-settings">
      <h1 className="faqs__title title-styles-nocaptial">
        Questions and Answers about {getThemeConfig().APP_SPONSOR}
      </h1>
      <div className="faqs__qas-box">
        <div className="faqs__md">
          <ReactMarkdown>{md}</ReactMarkdown>
          {!isLoading && renderFaqContent()}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
