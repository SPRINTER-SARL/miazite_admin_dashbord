import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "./common/login-form";
import useDarkMode from "@/hooks/useDarkMode";
// image import
import LogoWhite from "@/assets/images/logo/logo.png";
import Logo from "@/assets/images/logo/logo.png";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "@/utils/firebase/firebaseConfig";

const Login = () => {
  const [isDark] = useDarkMode();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // if (user) {
      //   // L'utilisateur est authentifié
      // } else {
      //   // L'utilisateur n'est pas authentifié, redirection
      //   navigate("/");
      // }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="login-wrapper min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="lg-inner-column flex flex-col lg:flex-row bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
        <div className="left-column relative lg:w-1/2 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-700 p-4">
          <div className="max-w-[180px] mb-3">
            <Link to="/">
              <img
                src={isDark ? LogoWhite : Logo}
                alt="Logo"
                className="w-full"
              />
            </Link>
          </div>
        </div>
        <div className="right-column relative lg:w-1/2 flex flex-col justify-center items-center p-4">
          <div className="inner-content w-full max-w-lg flex flex-col bg-white dark:bg-slate-800 p-6 rounded-lg">
            <div className="auth-box flex flex-col justify-center">
              <div className="text-center mb-3">
                <h4 className="font-medium text-xl text-gray-800 dark:text-white">
                  Connectez-vous
                </h4>
              </div>
              <LoginForm />
              <div className="relative border-b border-gray-300 dark:border-gray-600 border-opacity-50 pt-4"></div>
              <div className="max-w-[242px] mx-auto  w-full"></div>
            </div>
            <div className="auth-footer text-center text-gray-600 dark:text-gray-400 mt-2">
              &copy; 2024, DanylPro. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
