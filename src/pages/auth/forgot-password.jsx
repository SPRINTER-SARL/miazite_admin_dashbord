import React from "react";
import { Link } from "react-router-dom";
import ForgotPass from "./common/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";

import LogoWhite from "@/assets/images/logo/logo.png";
import Logo from "@/assets/images/logo/logo.png";

const ForgotPassPage = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="flex h-screen">
      <div className="flex-1 border flex justify-center items-center">
          <img
            src={isDark ? LogoWhite : Logo}
            alt="Logo"
            className="mb-10"
            style={{
              width: "30%",
              height: "auto",
            }}
          />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-slate-800">
        <div className="inner-content w-full max-w-xl p-8">
          <div className="text-center mb-8">
            <h5 className="font-medium text-2xl">Mot de passe oublié ?</h5>
            <p className="text-slate-500 text-lg">
              Réinitialisez votre mot de passe avec TechService.
            </p>
          </div>
          <div className="font-normal text-base text-slate-500 dark:text-slate-400 text-center px-2 bg-slate-100 dark:bg-slate-600 rounded py-3 mb-4 mt-10">
            Entrez votre email et des instructions vous seront envoyées !
          </div>
          <ForgotPass />
          <div
            className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-lg"
            style={{ marginTop: "50px" }}
          >
            Oubliez ça,{" "}
            <Link
              to="/login"
              className="text-slate-900 dark:text-white font-medium hover:underline text-center"
            >
              renvoyez-moi à la connexion
            </Link>
          </div>
        </div>
        <div className="auth-footer text-center">
         
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
