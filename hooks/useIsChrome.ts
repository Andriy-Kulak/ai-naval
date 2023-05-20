import { useEffect, useState } from "react";

const useIsChrome = (): boolean => {
  const [isChrome, setIsChrome] = useState(false);

  const isBrave = async (): Promise<boolean> => {
    try {
      const isBrave = await (window.navigator as any).brave?.isBrave();
      return !!isBrave;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const checkBrowser = async () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isBraveBrowser = await isBrave();
      const isChrome =
        userAgent.indexOf("chrome") > -1 &&
        userAgent.indexOf("edge") === -1 &&
        userAgent.indexOf("opr") === -1 &&
        !isBraveBrowser;

      setIsChrome(isChrome);
    };

    checkBrowser();
  }, []);

  return isChrome;
};

export default useIsChrome;
