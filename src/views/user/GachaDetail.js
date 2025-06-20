import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

import PrizeCard from "../../components/Others/PrizeCard";
import GachaPriceLabel from "../../components/Others/GachaPriceLabel";
import Progressbar from "../../components/Others/progressbar";
import NotEnoughPoints from "../../components/Modals/NotEnoughPoints";
import Spinner from "../../components/Others/Spinner";
import Timer from "../../components/Blogs/Timer";
import UserImageButton from "../../components/Blogs/UserImageButton";

function GachaDetail() {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const { gachaId } = location.state || {};

  const [gacha, setGacha] = useState(null);
  const [firstPrizes, setFirstprizes] = useState([]);
  const [secondPrizes, setSecondprizes] = useState([]);
  const [thirdPrizes, setThirdprizes] = useState([]);
  const [fourthPrizes, setFourthprizes] = useState([]);
  const [extraPrizes, setExtraprizes] = useState([]);
  const [lastPrizes, setLastprizes] = useState([]);
  const [roundPrizes, setRoundprizes] = useState([]);
  const [blurLevel, setBlurLevel] = useState(0);
  const [isOpenPointModal, setIsOpenPointModal] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);
  const [timeFlag, setTimeFlag] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [usercount, setUserCount] = useState(0);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    getGacha();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const newBlurLevel = Math.min(scrollPos / 50, 20);
      setBlurLevel(newBlurLevel);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  useEffect(() => {
    const currentTime = Math.floor(new Date(new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo', // Specify the time zone
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Use 24-hour format
    }).format(Date.now())) / 1000);
    
    const fetchGachaTime = async () => {
      try {
        const gachaTime = Math.floor(new Date(new Intl.DateTimeFormat('ja-JP', {
          timeZone: 'Asia/Tokyo', // Specify the time zone
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Use 24-hour format
        }).format(new Date(gacha.createdAt))) / 1000);
        const res = await api.get(`/user/drawlog/${user?._id}/${gacha?._id}`);
        
        if (gacha.kind.some((item) => item.value === "500")) {
          if (user.rankData.totalPointsAmount < 500) {setCheck(true); return;}
        }
        if (gacha.kind.some((item) => item.value === "1000")) {
          if (user.rankData.totalPointsAmount < 1000) {setCheck(true); return;}
        }
        if (gacha.kind.some((item) => item.value === "10000")) {
          if (user.rankData.totalPointsAmount < 10000) {setCheck(true); return;}
        }
        // once per day
        if (gacha.kind.some((item) => item.value === "once_per_day")) {
          const currentdaystart = currentTime - currentTime % 86400;
          if (res.data.msg !== "notdraw" && currentdaystart <= res.data.gacha) {
            setCheck(true);
            return ;
          }
        }
        // once in a week
        if (gacha.kind.some((item) => item.value === "Inweek")) {
          const registertime = Math.floor(new Date(user.createtime) / 1000);
          if (currentTime - registertime >= 86400 * 7) {setCheck(true); return;}  
          else if (res.data.msg !== "notdraw") {setCheck(true); return;} 
        }
        setCheck(false);

        let resttime = currentTime - gachaTime;
        setTimeFlag(resttime <= gacha.time * 60);
        if (resttime <= gacha.time * 60) {
          setCountdown(gacha.time * 60 - resttime); // Set countdown to remaining time
        }
      } catch (error) {
        console.error('Error fetching gacha data:', error);
      }
    };

    if (user && gacha) fetchGachaTime();
  }, [bgColor, user, gacha, check]);

  // update user data and update localstorage
  const updateUserData = async () => {
    setAuthToken();
    try {
      if (user) {
        // update user date
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

  // get gacha by gacha id
  const getGacha = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get(`/admin/gacha/${gachaId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        setSpinFlag(true);
        const cnt = await api.get(`admin/gacha/count/${gachaId}`);
        setSpinFlag(false);
        setGacha(res.data.gacha);
        setUserCount(cnt.data.count);
        devideRemainPrizes(res.data.gacha);
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

    if (gacha.show_prizes.length) {
      gacha.show_prizes.forEach((prize) => {
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

    setFirstprizes(firstPrizes);
    setSecondprizes(secondPrizes);
    setThirdprizes(thirdPrizes);
    setFourthprizes(fourthPrizes);
    setRoundprizes(roundPrizes);
    setExtraprizes(extraPrizes);
    setLastprizes(lastPrizes);
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
            <div className="group relative m-1" key={i}>
              <PrizeCard img_url={prize?.img_url} width={100} height={150} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // draw gacha
  const submitDrawGacha = async (gacha, counts) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (user.role === "admin") {
      showToast(t("drawnAdmin"), "error");
      return;
    }

    const totalPoints =
      gacha.price * (counts === "all" ? (gacha.remain_prizes.filter((item) => item.order != 0).length + gacha.rubbish_total_number): counts);
    const remainPoints = user.point_remain;
    if (remainPoints < totalPoints) {
      setIsOpenPointModal(true);
      return;
    }

    try {
      setAuthToken();

      setSpinFlag(true);
      const res = await api.post("/admin/gacha/draw_gacha", {
        gachaId: gacha._id,
        counts: counts,
        drawDate: new Date(),
      });
      setSpinFlag(false);

      if (res.data.status === 1) {
        updateUserData();

        navigate("/user/showDrawedPrizes", {
          state: { prizes: res.data.prizes },
        });
      } else {
        switch (res.data.msg) {
          case 0:
            showToast(t("drawnEnoughPrize"), "error");
            break;

          case 1:
            showToast(t("noEnoughPoints"), "error");
            break;

          default:
            showToast(t("faileReq", "error"));
            break;
        }
      }
    } catch (error) {
      showToast(t("faileReq", "error"));
    }
  };

  return (
    <div className="xxsm:mx-auto" ref={mainContent}>
      {spinFlag && <Spinner />}
      <div
        className={`w-full xxsm:w-[500px] fixed top-0 transition-all duration-100 bg-gray-800 h-screen h-[calc(100vh-160px)] shadow-md shadow-gray-400 mt-16 mx-auto`}
        style={{
          filter: `blur(${blurLevel}px)`,
          transition: "filter 0.2s ease",
        }}
      >
        <img
          src={process.env.REACT_APP_SERVER_ADDRESS + gacha?.img_url}
          alt="gacha thumnail"
          className="object-contain w-full"
        />
      </div>
      <div
        className="w-full xxsm:w-[500px] relative pb-48 mt-[calc(100vh-100px)] z-10 bg-[#f3f4f6]"
        style={{ boxShadow: "10px 10px 100px 0px rgba(0, 0, 0, 0.6)" }}
      >
        <div className="flex flex-wrap py-3 justify-center items-center">
          <div className="border border-1 h-[2px] w-[10%] border-black mx-3"></div>
          <p className="font-bold text-center text-3xl">
            {t("prize") + " " + t("list")}
          </p>
          <div className="border border-1 h-[2px] w-[10%] border-black mx-3"></div>
        </div>
        <hr className="my-2 text-sm mx-auto"></hr>
        {firstPrizes.length > 0 && drawPrizesByKind(firstPrizes, "first")}
        {secondPrizes.length > 0 && drawPrizesByKind(secondPrizes, "second")}
        {thirdPrizes.length > 0 && drawPrizesByKind(thirdPrizes, "third")}
        {fourthPrizes.length > 0 && drawPrizesByKind(fourthPrizes, "fourth")}
        {extraPrizes.length > 0 && drawPrizesByKind(extraPrizes, "extra_prize")}
        {roundPrizes.length > 0 &&
          drawPrizesByKind(roundPrizes, "round_number_prize")}
        {lastPrizes.length > 0 && drawPrizesByKind(lastPrizes, "last_prize")}
      </div>
      <div className="z-20 w-full xxsm:w-[500px] fixed bottom-[65px] flex flex-col items-center text-center px-20 pb-2">
        {/* <div className="w-auto bg-gray-100  text-white px-1 mb-3"> */}
          {user && usercount > 0 && <h1 className="text-red-500 mb-3"> {t(`Yesterday ${usercount} users drawed.`)} </h1>}
        {/* </div> */}

        <GachaPriceLabel price={gacha?.price} />
        <Progressbar
          progress={((gacha?.remain_prizes.filter((item) => item.order != 0).length + gacha?.rubbish_total_number) / gacha?.total_number) * 100}
          label={gacha?.remain_prizes.filter((item) => item.order != 0).length + gacha?.rubbish_total_number + " / " + gacha?.total_number}
          height={20}
        />
      </div>
      <div
        className="z-10 w-full xxsm:w-[500px] fixed bottom-0 flex justify-center pb-3 pt-12 px-2 bg-[#f3f4f6]"
        style={{ boxShadow: "10px 10px 100px 0px rgba(0, 0, 0, 0.5)" }}
      >
        {gacha != null && 
          (timeFlag === true ? <Timer setTimeFlag={setTimeFlag} countdown={countdown} /> : <UserImageButton data={gacha} setIsOpenPointModal={setIsOpenPointModal} setSpinFlag={setSpinFlag} check={check} />)
        }
      </div>
      <NotEnoughPoints
        headerText={t("noEnoughPoints")}
        bodyText={t("noEnoughPointsDesc")}
        okBtnClick={() => navigate("/user/purchasePoint")}
        isOpen={isOpenPointModal}
        setIsOpen={setIsOpenPointModal}
        bgColor={bgColor}
      />
    </div>
  );
}

export default GachaDetail;
