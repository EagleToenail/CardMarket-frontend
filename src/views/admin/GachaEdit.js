import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import formatPrice from "../../utils/formatPrice";
import usePersistedUser from "../../store/usePersistedUser";

import PrizeList from "../../components/Tables/PrizeList";
import PrizeCard from "../../components/Others/PrizeCard";
import Spinner from "../../components/Others/Spinner";
import RubbishList from "../../components/Tables/RubbishList";
import Rubbish from "./Rubbish";

const GachaEdit = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();
  const lang = i18n.language;
  const { gachaId } = location.state || {};

  const [gacha, setGacha] = useState();
  const [gachaNum, setGachaNum] = useState(0);
  const [gachaCat, setGachaCat] = useState(0);
  const [loadFlag, setLoadFlag] = useState(false);
  const [prizeType, setPrizeType] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [firstPrizes, setFirstprizes] = useState([]);
  const [secondPrizes, setSecondprizes] = useState([]);
  const [thirdPrizes, setThirdprizes] = useState([]);
  const [fourthPrizes, setFourthprizes] = useState([]);
  const [layerrubbish, setLayerrubbish] = useState([]);
  const [extraPrizes, setExtraprizes] = useState([]);
  const [lastPrizes, setLastprizes] = useState([]);
  const [roundPrizes, setRoundprizes] = useState([]);
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setAuthToken();
    getGacha();
  }, [lang]);

  //get Gacha by id
  const getGacha = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get(`/admin/gacha/${gachaId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        setGacha(res.data.gacha);
        devideRemainPrizes(res.data.gacha);
        setGachaNum(res.data.gacha.remain_prizes.filter((item) => item.order != 0).length);

        switch (lang) {
          case "ch1":
            setGachaCat(res.data.gacha.category.ch1Name);
            break;
          case "ch2":
            setGachaCat(res.data.gacha.category.ch2Name);
            break;
          case "vt":
            setGachaCat(res.data.gacha.category.vtName);
            break;
          case "en":
            setGachaCat(res.data.gacha.category.enName);
            break;

          default:
            setGachaCat(res.data.gacha.category.jpName);
            break;
        }
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  // divide remain prizes by grade
  const devideRemainPrizes = (gacha) => {
    let firstPrizes = [];
    let secondPrizes = [];
    let thirdPrizes = [];
    let fourthPrizes = [];
    let roundPrizes = [];
    let extraPrizes = [];
    let lastPrizes = [];
    let Rubbishs = [];

    if (gacha.remain_prizes.length > 0) {
      gacha.remain_prizes.forEach((prize) => {
        switch (prize.kind) {
          case "first":
            firstPrizes.push(prize);
            break;

          case "second":
            secondPrizes.push(prize);
            break;

          case "third":
            thirdPrizes.push(prize);
            break;

          case "fourth":
            fourthPrizes.push(prize);
            break;

          case "round_number_prize":
            roundPrizes.push(prize);
            break;

          case "extra_prize":
            extraPrizes.push(prize);
            break;

          case "last_prize":
            lastPrizes.push(prize);
            break;
          default:
            break;
        }
      });
    }
    if (gacha.remain_rubbishs.length > 0) gacha.remain_rubbishs.forEach((item) => Rubbishs.push(item));

    setFirstprizes(firstPrizes);
    setSecondprizes(secondPrizes);
    setThirdprizes(thirdPrizes);
    setFourthprizes(fourthPrizes);
    setRoundprizes(roundPrizes);
    setExtraprizes(extraPrizes);
    setLastprizes(lastPrizes);
    setLayerrubbish(Rubbishs);
  };

  // drawing prizes by kind
  const drawPrizesByKind = (prizes, kind) => {
    return (
      <div>
        <div className="my-2 text-3xl text-center font-bold">{t(kind)}</div>
        {kind === "round_number_prize" && (
          <div className="my-2 text-3xl text-center font-bold">
            1 / {gacha.award_rarity}
          </div>
        )}
        <div className="flex flex-wrap justify-center items-stretch">
          {prizes.map((prize, i) => (
            <div className="group relative" key={i}>
              <div className="m-1">
                <PrizeCard img_url={prize?.img_url} width={100} height={150} />
              </div>
              <button
                className="absolute top-1 right-1 rounded-bl-[100%] w-8 h-8 hidden group-hover:block text-center bg-red-500 z-10 opacity-80 hover:opacity-100"
                onClick={() => unsetPrize(prize._id)}
              >
                <i className="fa fa-close text-gray-200 middle"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // drawing rubbishs
  const drawRubbishs = (rubbishs) => {
    return (
      <div>
        <div className="my-2 text-3xl text-center font-bold">{t('rubbish')}</div>
        {/* {kind === "round_number_prize" && (
          <div className="my-2 text-3xl text-center font-bold">
            1 / {gacha.award_rarity}
          </div>
        )} */}
        <div className="flex flex-wrap justify-center items-stretch">
          {rubbishs.map((rubbish, i) => (
            <div className="group relative" key={i}>
              <div className="m-1">
                <small className="text-red-600"> {rubbish.count} </small>
                <PrizeCard img_url={rubbish?.img_url} width={100} height={150} />
              </div>
              <button
                className="absolute top-1 right-1 rounded-bl-[100%] w-8 h-8 hidden group-hover:block text-center bg-red-500 z-10 opacity-80 hover:opacity-100"
                onClick={() => unsetRubbish(rubbish._id)}
              >
                <i className="fa fa-close text-gray-200 middle"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // unset registered prizes from gacha
  const unsetPrize = async (prizeId) => {
    try {
      if (!user.authority["gacha"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setSpinFlag(true);
      const res = await api.post("/admin/gacha/unset_prize", {
        gachaId: gachaId,
        prizeId: prizeId,
      });
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successUnset"), "success");
        setTrigger(!trigger);
        getGacha();
      } else {
        showToast(t("failedUnset"), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  // unset registered rubbishs from gacha
  const unsetRubbish = async (rubbishId) => {
    try {
      if (!user.authority["gacha"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setSpinFlag(true);
      const res = await api.post("/admin/gacha/unset_rubbish", {
        gachaId: gachaId,
        rubbishId: rubbishId,
      });
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successUnset"), "success");
        setTrigger(!trigger);
        getGacha();
      } else {
        showToast(t("failedUnset"), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  return (
    <div className="px-3 pt-2 py-12 w-full h-full md:w-[70%] m-auto">
      {spinFlag && <Spinner />}

      <div className="text-center">
        <i
          className="fa fa-chevron-left float-left cursor-pointer mt-2"
          onClick={() => navigate("/admin/gacha")}
        />
        <span className="text-xl text-center text-slate-600">
          {t("gacha") + " " + t("detail")}
        </span>
      </div>
      <hr className="my-2" />

      <div className="overflow-auto">
        <table className="m-auto">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <tr>
              <td>{t("category")}</td>
              <td>{t("image")}</td>
              <td>{t("type")}</td>
              <td>{t("name")}</td>
              <td>{t("price")}</td>
              <td>{t("kind")}</td>
              <td>{t("number")}</td>
              <td>{t("order")}</td>
              <td>{t("time")}</td>
            </tr>
          </thead>
          <tbody>
            {gacha ? (
              <tr key={gacha._id}>
                <td>{gachaCat}</td>
                <td>
                  <img
                    src={process.env.REACT_APP_SERVER_ADDRESS + gacha.img_url}
                    alt="img"
                    className="m-auto h-[70px] w-auto"
                  />
                </td>
                <td>{t("gacha") + " " + gacha?.type}</td>
                <td>{gacha?.name}</td>
                <td>{formatPrice(gacha?.price)}pt</td>
                <td>
                  {gacha?.kind.map((item, i) => (
                    <p key={i}>{t(item.value)}</p>
                  ))}
                </td>
                <td>
                  {gachaNum} / {gacha.total_number}
                </td>
                <td>{gacha?.order}</td>
                <td>{gacha?.time}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="8">{t("nogacha")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <hr className="my-2" />

      <div className="py-2 bg-admin_theme_color text-gray-200 text-center w-full">
        {t("currentPrizeList")}
      </div>
      <div className="py-2 border-1 text-center w-full">
        {firstPrizes.length > 0 && drawPrizesByKind(firstPrizes, "first")}
        {secondPrizes.length > 0 && drawPrizesByKind(secondPrizes, "second")}
        {thirdPrizes.length > 0 && drawPrizesByKind(thirdPrizes, "third")}
        {fourthPrizes.length > 0 && drawPrizesByKind(fourthPrizes, "fourth")}
        {extraPrizes.length > 0 && drawPrizesByKind(extraPrizes, "extra_prize")}
        {roundPrizes.length > 0 &&
          drawPrizesByKind(roundPrizes, "round_number_prize")}
        {lastPrizes.length > 0 && drawPrizesByKind(lastPrizes, "last_prize")}
        {layerrubbish.length > 0 && drawRubbishs(layerrubbish)}

        {/* {gachaNum === 0 && (
          <div className="py-2 text-center">{t("noprize")}</div>
        )} */}
      </div>
      <hr className="my-2" />

      <div className="w-full mt-2">
        <div className="text-lg text-center font-bold">{t("load_prizes")}</div>
        <div className="flex justify-start my-2 overflow-auto">
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("");
            }}
          >
            {t("uploadAll")}
          </button>
          <button
            className="button-38 mx-2"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("grade");
            }}
          >
            {t("grade_prizes")}
          </button>
          <button
            className="button-38 mx-2"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("last");
            }}
          >
            {t("last_prize")}
          </button>
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("rubbish");
            }}
          >
            {t("rubbish")}
          </button>
        </div>
        {loadFlag ? (
          <div className="overflow-auto">
            {prizeType !== "rubbish" ?
              <PrizeList
                trigger={trigger}
                prizeType={prizeType}
                role="gacha"
                gachaId={gacha._id}
                getGacha={getGacha}
              /> : 
              <RubbishList
                trigger={trigger}
                // prizeType={prizeType}
                role="gacha"
                gachaId={gacha._id}
                getGacha={getGacha}
              />
            }
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GachaEdit;
