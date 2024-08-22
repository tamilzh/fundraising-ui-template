export const getWebsiteConfig = async () => {
  const res = await fetch(
    `https://sitebuilder-develop.de.r.appspot.com/api/info/${process.env.APP_SITE_ID || 0}`,
    {
      method: "GET",
    }
  );

  const data = await res.json();
  return data;
};
