import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import MainLogo from "@/assets/images/logo/icon.png";
import LogoWhite from "@/assets/images/logo/icon.png";
const MobileLogo = () => {
  const [isDark] = useDarkMode();
  return (
    <Link to="/">
      <img src={isDark ? LogoWhite : MainLogo} alt="" style={{width:"200px"}}/>
    </Link>
  );
};

export default MobileLogo;
