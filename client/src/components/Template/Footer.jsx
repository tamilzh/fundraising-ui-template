import React, { useState, useEffect } from "react";
import pwa from "../../assets/images/pwa.svg";
import pwr from "../../assets/images/pwr.png";
import constant from "../../utils/constant";
import { createSvgUrl } from "../../utils/svgUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faDiscord,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { getThemeConfig } from "../../utils/common";

const Footer = ({ webPrimaryColor, webSecondaryColor }) => {
  const date = new Date();
  const year = date.getFullYear();
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fillColor1 = webSecondaryColor;
    const fillColor2 = webPrimaryColor;
    const fetchSvg = async () => {
      const svg1Content =
        '<svg xmlns="http://www.w3.org/2000/svg" width="1927.493" height="427.067" viewBox="0 0 1927.493 427.067"><path id="Bottom_1" data-name="Bottom 1" d="M6328,3687.655l2-388.015s1526.8-23.511,1920.992,227.675c7.318,323.32,3.511,155.024,3.511,155.024Z" transform="translate(-6328 -3299.055)" fill="__FILL_COLOR__"/></svg>';
      const svg2Content =
        '<svg xmlns="http://www.w3.org/2000/svg" width="1927.029" height="861.554" viewBox="0 0 1927.029 861.554"><path id="Bottom_2" data-name="Bottom 2" d="M8252.611,2184.933c-1.19-747.663,0,638.237,0,638.237l-1927.028,1.941,3.487-272.219S8253.8,2932.6,8252.611,2184.933Z" transform="translate(-6325.583 -1963.557)" fill="__FILL_COLOR__"/></svg>';

      const svgUrl1 = createSvgUrl(svg1Content, fillColor1);
      const svgUrl2 = createSvgUrl(svg2Content, fillColor2);

      setBackgroundImage(`url(${svgUrl2}), url(${svgUrl1})`);
    };

    fetchSvg();
  }, [webPrimaryColor, webSecondaryColor]);

  return (
    <footer id="footer" style={{ backgroundImage: backgroundImage }}>
      <div className="desktop-footer">
        <div className="footer__social-icons">
          {/* <a href='https://www.facebook.com/reddevinc/' target='_blank'><img className="footer__social-icon social-icon1" src={fb} alt="fb"></img></a> */}

          <a
            href={getThemeConfig().APP_INSTA_LINK}
            target="_blank"
            rel="noreferrer"
            className="tooltip"
          >
            <span
              className="tooltiptext"
              // style={{ width: "70px", transform: "translate(-50%, -60%)" }}
            >
              {constant.INSTAGRAM_LINK_TOOLTIP}
            </span>
            <FontAwesomeIcon
              icon={faInstagram}
              style={{ height: "2.7rem", color: webPrimaryColor }}
            />
          </a>
          <a
            href={getThemeConfig().APP_TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
            className="tooltip"
          >
            <span
              className="tooltiptext"
              // style={{ width: "60px", transform: "translate(-50%, -60%)" }}
            >
              {constant.TWITTER_LINK_TOOLTIP}
            </span>
            <FontAwesomeIcon
              icon={faXTwitter}
              style={{ height: "2.7rem", color: webPrimaryColor }}
            />
          </a>
          <a
            href={getThemeConfig().APP_DISCORD_LINK}
            target="_blank"
            rel="noreferrer"
            className="tooltip"
          >
            <span
              className="tooltiptext"
              // style={{ width: "80px", transform: "translate(-50%, -60%)" }}
            >
              {constant.INSTAGRAM_LINK_2_TOOLTIP}
            </span>
            <FontAwesomeIcon
              icon={faDiscord}
              style={{ height: "2.7rem", color: webPrimaryColor }}
            />
          </a>
        </div>
        <div className="footer__copyright">
          <span className="footer__copyright-text">
            © {year} RED.DEV INC. All Rights Reserved.
          </span>
          <div className="footer__pwb">
            <div className="footer__pwb-inner">
              <div className="footer__pwb-avalanche">
                <img className="front" src={pwa} alt="pwa" />
              </div>
              <div className="footer__pwb-reddev">
                <img className="back" src={pwr} alt="pwr" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-footer">
        <div className="footer-group1">
          <div className="mobile-footer__social-icons">
            {/* <a href='https://www.facebook.com/reddevinc/' target='_blank'><img className="footer__social-icon social-icon1" src={fb} alt="fb"></img></a> */}

            <a
              href={constant.INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="tooltip"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                style={{ height: "2.7rem", color: webPrimaryColor }}
              />
            </a>
            <a
              href={constant.TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
              className="tooltip"
            >
              <FontAwesomeIcon
                icon={faXTwitter}
                style={{ height: "2.7rem", color: webPrimaryColor }}
              />
            </a>

            <a
              href={constant.INSTAGRAM_LINK_2}
              target="_blank"
              rel="noreferrer"
              className="tooltip"
            >
              <FontAwesomeIcon
                icon={faDiscord}
                style={{ height: "2.7rem", color: webPrimaryColor }}
              />
            </a>
          </div>
          <div className="footer__pwb">
            <div className="footer__pwb-inner">
              <div className="footer__pwb-avalanche">
                <img className="front" src={pwa} alt="pwa" />
              </div>
              <div className="footer__pwb-reddev">
                <img className="back" src={pwr} alt="pwr" />
              </div>
            </div>
          </div>
        </div>
        <span className="footer__copyright-text">
          © {year} RED.DEV INC. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
