import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase/firebaseConfig";
import { getDocumentByName } from "@/utils/firebase/firebaseServices";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    localStorage.clear();
    navigate("/auth/login");
  };

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        navigate("/profile");
      },
    },
    {
      label: "Settings",
      icon: "heroicons-outline:cog",
      action: () => {
        navigate("/settings");
      },
    },
    {
      label: "Faq",
      icon: "heroicons-outline:information-circle",
      action: () => {
        navigate("/faq");
      },
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        dispatch(handleLogout);
      },
    },
  ];

  const ProfileLabel = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // L'utilisateur est authentifié
          fetchProfile();
        } else {
          // L'utilisateur n'est pas authentifié, redirection
          navigate("/auth/login");
        }
      });
      return () => unsubscribe();
    }, []);
    const fetchProfile = async () => {
      const response = await getDocumentByName(
        "Users",
        localStorage.getItem("userConnect")
      );
      setData(response);
    };
    return (
      <div className="flex items-center">
        <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
          <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
            <img
              src={data?.photoURL || "/logo.png"}
              alt=""
              className="block w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-left w-[85px] block">
            {data?.nom} {data?.prenom}
          </span>
          <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
            <Icon icon="heroicons-outline:chevron-down"></Icon>
          </span>
        </div>
      </div>
    );
  };

  return (
    <Dropdown label={<ProfileLabel />} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
