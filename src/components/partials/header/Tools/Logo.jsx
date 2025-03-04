import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";

import MainLogo from "@/assets/images/logo/logo.png";
import LogoWhite from "@/assets/images/logo/logo.png";
import MobileLogo from "@/assets/images/logo/icon.png";
import MobileLogoWhite from "@/assets/images/logo/icon.png";
const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/dashboard">
        {width >= breakpoints.xl ? (
          <img src={isDark ? LogoWhite : MainLogo} alt="" style={{width:"200px"}}/>
        ) : (
          <img src={isDark ? MobileLogoWhite : MobileLogo} alt="" style={{width:"30px"}} />
        )}
      </Link>
    </div>
  );
};

export default Logo;
