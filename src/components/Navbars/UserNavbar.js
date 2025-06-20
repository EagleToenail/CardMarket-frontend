import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Nav } from "reactstrap";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import formatPrice from "../../utils/formatPrice";
import { setAuthToken } from "../../utils/setHeader";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom, logoAtom } from "../../store/theme";

import ChangeLanguage from "../Others/ChangeLanguage";
import "../../assets/css/index.css";

const UserNavbar = ({ isOpenToggleMenu, setIsOpenToggleMenu }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);
  const [logo] = useAtom(logoAtom);
  const [text, setText] = useState("copyCode");

  useEffect(() => {
    updateUserData();
  }, [location]);

  const updateUserData = async () => {
    setAuthToken();

    try {
      if (user) {
        const res = await api.get(`/user/get_user/${user._id}`);
        if (res.data.status === 1) {
          setUser(res.data.user);
        } else {
          showToast(t("tryLogin"), "error");
          navigate("user/index");
        }
      }
    } catch (error) {
      showToast(t("tryLogin"), "error");
      navigate("user/index");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    navigate("/auth/login");
  };

  const nav_login = () => {
    navigate("/auth/login");
  };

  const handleCopy = () => {
    const tempInput = document.createElement("input");
    tempInput.value = user.inviteCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    setText("copied");
    document.body.removeChild(tempInput);

    setTimeout(() => {
      setText("copyCode");
    }, 3000);
  };


  return (
    <div
      className={`w-full py-2 fixed max-h-[100px] z-20`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full navbar-dark">
        <div className="px-2 w-full lg:w-3/4 mx-auto flex flex-wrap justify-between items-center content-end md:content-between py-[8px] xsm:px-[28px]">
          <Link className="h4 mb-0 text-white text-uppercase xxsm:block" to="/">
            <div className="flex flex-wrap justify-between">
              {location.pathname === "/user/gachaDetail" ? (
                <button
                  className="flex xsm:ruby px-2 py-[4px] rounded-lg border-[1px] text-center text-white text-sm hover:opacity-50"
                  onClick={() => navigate("/user/index")}
                  style={{ backgroundColor: bgColor }}
                >
                  <i className="fa fa-chevron-left mt-1"></i>
                  <span className="ml-1 hidden xsm:block">
                    {" " + t("return")}
                  </span>
                </button>
              ) : (
                <img
                  alt="..."
                  src={logo}
                  width="50"
                  height="50"
                  className="px-1"
                />
              )}
            </div>
          </Link>
          <div className="flex flex-wrap justify-between ">
            <Nav navbar>
              {user ? (
                <div className="flex items-center">
                  {user.role !== "admin" && (
                    <>
                      <button className="flex items-center">
                        <div
                          className="flex flex-wrap text-base text-white font-extrabold items-center"
                          onClick={() => navigate("/user/purchasePoint")}
                        >
                          <img
                            alt=""
                            src={require("../../assets/img/icons/coin.png")}
                            width="30px"
                            height="30px"
                            className="-translate-x-[-50%]"
                          />
                          <span
                            className="border-[1px] rounded-full px-4 py-1"
                            style={{ backgroundColor: bgColor }}
                          >
                            {user.point_remain
                              ? formatPrice(user.point_remain)
                              : 0}{" "}
                            pt
                          </span>
                          <i className="fa-solid fa-plus font-extrabold text-base text-white -translate-x-[70%]"></i>
                        </div>
                      </button>
                      <div className="relative">
                        <button
                          className="flex items-center"
                          onClick={() => setIsOpenToggleMenu(!isOpenToggleMenu)}
                        >
                          <span className="avatar avatar-sm rounded-circle">
                            <img
                              alt="..."
                              src={require("../../assets/img/icons/login.png")}
                              className="w-8 h-8 rounded-full"
                            />
                          </span>
                        </button>
                        <div
                          className={`flex flex-wrap  justify-end fixed top-0 right-0 h-full w-full duration-500 pb-24 ${
                            isOpenToggleMenu
                              ? "translate-x-0"
                              : "translate-x-full"
                          }`}
                        >
                          <div className="pb-10 z-50 w-80 h-[100vh] shadow-md shadow-gray-400 overflow-y-auto ease-in-out bg-gray-100 text-gray-800 transform transition-transform ">
                            <div className="my-status sticky top-0 bg-gray-100 z-40">
                              <h2 className="py-3 text-xl font-bold text-center">
                                {user.name}
                              </h2>
                              <button
                                onClick={() =>
                                  setIsOpenToggleMenu(!isOpenToggleMenu)
                                }
                                className="hover:opacity-50 font-bold absolute top-2 right-2 text-white py-1 px-3 bg-gray-200 rounded-md"
                                style={{ backgroundColor: bgColor }}
                              >
                                X
                              </button>
                              <hr></hr>
                            </div>
                            <div className="p-2 flex-wrap ">
                              <ul>
                                <li
                                  className="relative mt-4 text-center shadow-md shadow-gray-300 cursor-pointer flex flex-col justify-center mx-2 my-2 p-3 border-solid border-4 border-gray-400 rounded-lg"
                                >
                                  {user.rankData.rank ? (
                                    <img
                                      src={
                                        process.env.REACT_APP_SERVER_ADDRESS +
                                        user.rankData.rank.img_url
                                      }
                                      alt="Background"
                                      className="absolute top-0 right-4 w-full h-full object-cover opacity-50"
                                      style={{
                                        maxHeight: "150px",
                                        maxWidth: "130px",
                                      }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  <div className="relative">
                                    <span className="text-gray-800 text-lg font-bold">
                                      {t("rank")}
                                    </span>
                                    <hr className="h-1 w-full my-2 border-3 border-gray-400"></hr>
                                    <span
                                      className="text-gray-800 text-5xl font-bold uppercase"
                                      style={{ fontFamily: "serif" }}
                                    >
                                      {t(
                                        user.rankData.rank
                                          ? user.rankData.rank.name
                                          : "Normal"
                                      )}
                                    </span>
                                    <span className="flex flex-wrap text-gray-800 text-lg justify-center">
                                      {formatPrice(
                                        t(user.rankData.totalPointsAmount)
                                      )}
                                      {user.rankData.rank.last
                                        ? ""
                                        : " / " +
                                          formatPrice(
                                            user.rankData.rank
                                              ? user.rankData.rank.end_amount
                                              : "300000"
                                          )}
                                      pt
                                    </span>
                                  </div>
                                </li>
                                <li className="mx-2 mt-4 mb-4 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg">
                                  <span className="font-bold text-lg">
                                    {t("point")}
                                  </span>
                                  <div className="flex flex-wrap justify-start items-center">
                                    <img
                                      alt=""
                                      src={require("../../assets/img/icons/coin.png")}
                                      width="30px"
                                      height="30px"
                                      className="py-2"
                                    />
                                    <span className="px-2 text-lg font-bold">
                                      {user.point_remain
                                        ? formatPrice(user.point_remain)
                                        : 0}{" "}
                                      pt
                                    </span>
                                  </div>

                                  <hr className="w-full border-solid border-1 border-gray-800 mb-2"></hr>
                                  <button
                                    id="purchaseBtn"
                                    className="rounded-md hover:opacity-50 text-center hover:bg-opacity-50 text-white outline-none w-full py-2"
                                    onClick={() => {
                                      setIsOpenToggleMenu(!isOpenToggleMenu);
                                      navigate("/user/purchasePoint");
                                    }}
                                    style={{ backgroundColor: bgColor }}
                                  >
                                    {t("purchasePoints")}
                                  </button>
                                </li>
                                <li
                                  className="pt-2 relative text-center shadow-md shadow-gray-300 cursor-pointer flex flex-col justify-center mx-2 my-2 p-3 border-solid border-4 border-gray-400 rounded-lg"
                                >
                                  <div className="relative">
                                    <div>
                                      <span className="text-gray-800 text-lg font-bold">
                                        {t("inviteFriend")}
                                      </span>
                                    </div>
                                    <div className="pb-2">
                                      <span
                                        className="text-gray-800 text-4xl font-bold"
                                        style={{ fontFamily: "serif" }}
                                      >
                                        {user.inviteCode.toString()}
                                      </span>
                                    </div>
                                    <button
                                      id="purchaseBtn"
                                      className="rounded-md hover:opacity-50 text-center hover:bg-opacity-50 text-white outline-none w-[70%] py-2"
                                      onClick={handleCopy}
                                      style={{ backgroundColor: bgColor }}
                                    > {t(text)} </button>
                                    <hr className="h-1 w-full my-2 border-3 border-gray-400"></hr>
                                    <span className="flex flex-wrap text-gray-800 text-lg justify-center">
                                      {user.inviteCount}
                                    </span>
                                  </div>
                                </li>
                                {/* <li
                                  className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                                  onClick={() => {
                                    setIsOpenToggleMenu(!isOpenToggleMenu);
                                    navigate("/user/pointsHistory");
                                  }}
                                >
                                  <span>{t("pointsHistory")}</span>
                                  <i className="fa fa-chevron-right"></i>
                                </li> */}
                                <li
                                  className="cursor-pointer flex flex-wrap justify-between items-center mx-2 mb-2 mt-4 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                                  onClick={() => {
                                    setIsOpenToggleMenu(!isOpenToggleMenu);
                                    navigate("/user/profile");
                                  }}
                                >
                                  <span>{t("profile")}</span>
                                  <i className="fa fa-chevron-right"></i>
                                </li>
                                <li
                                  className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                                  onClick={() => {
                                    setIsOpenToggleMenu(!isOpenToggleMenu);
                                    navigate("/user/changeShippingAddress");
                                  }}
                                >
                                  <span>{t("shipAddress")}</span>
                                  <i className="fa fa-chevron-right"></i>
                                </li>
                                <li
                                  className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                                  onClick={() => {
                                    setIsOpenToggleMenu(!isOpenToggleMenu);
                                    navigate("/user/acquisitionHistory");
                                  }}
                                >
                                  <span>{t("acquisitionHistory")}</span>
                                  <i className="fa fa-chevron-right"></i>
                                </li>
                                <li
                                  className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                                  onClick={() => {
                                    setIsOpenToggleMenu(!isOpenToggleMenu);
                                    navigate("/user/entercode");
                                  }}
                                >
                                  <span>{t("Enter Code")}</span>
                                  <i className="fa fa-chevron-right"></i>
                                </li>
                                <li className="p-2 my-3 flex flex-wrap justify-start">
                                  <ChangeLanguage type="menu" />
                                </li>
                                <li
                                  className="px-3 flex flex-wrap justify-start items-center"
                                  onClick={() => logout()}
                                >
                                  <button className="underline underline-offset-4 font-bold text-lg cursor-pointer pb-10">
                                    {t("logout")}
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap justify-between items-center">
                  <ChangeLanguage />
                  <button
                    className="flex items-center px-2 py-1 border rounded-lg text-white ml-2"
                    onClick={nav_login}
                  >
                    {t("sign_up_btn")} / {t("sign_in")}
                  </button>
                </div>
              )}
            </Nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
