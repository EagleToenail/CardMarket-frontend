import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { bgColorAtom } from "../../store/theme";
import { showToast } from "../../utils/toastUtil";

import Spinner from "../../components/Others/Spinner";
import NotEnoughPoints from "../../components/Modals/NotEnoughPoints";
import GachaBlog from "../../components/Blogs/GachaBlog";
const RedrawGacha = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bgColor] = useAtom(bgColorAtom);
  const { gachaId } = location.state || {};
  const [gacha, setGacha] = useState(null);
  const [isOpenPointModal, setIsOpenPointModal] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);
  useEffect(() => {
    // get gacha by gacha id
    const getGacha = async () => {
      try {
        setSpinFlag(true);
        const res = await api.get(`/admin/gacha/${gachaId}`);
        setSpinFlag(false);

        if (res.data.status === 1) setGacha(res.data.gacha);
      } catch (error) {
        showToast(t("failedReq"), "error");
      }
    };
    getGacha();
  }, [bgColor]);
  
  return (
    // <div className="w-full lg:w-[90%] xm:w-[80%] xmd:w-[70%] xl:w-[60%] md:mx-2 mt-16 mx-auto xm:p-2">
    <div className="w-full md:mx-2 mt-16 mx-auto xm:p-2">
      {spinFlag && <Spinner />}
      <div className="flex flex-col mt-[10%] xs:mt-[50px]  w-full lg:w-[90%] xm:w-[80%] xmd:w-[70%] xl:w-[60%] md:mx-2 mt-16 mx-auto ">
        <p className="text-center text-xl font-bold">{t("gachaAgain")}</p>
        <div className="w-full flex flex-wrap justify-between xm:px-3">
          {gacha != null &&  <GachaBlog
            data={gacha}  setIsOpenPointModal={setIsOpenPointModal} setSpinFlag={setSpinFlag} 
          />}
        </div>
      </div>
      <div className="flex flex-col fixed bottom-10 py-3 px-2 border-t-[1px] border-gray-200 w-full mx-auto">
        <div className="flex flex-col w-[90%] sm:w-[420px] mx-auto">
          {/* <p className="text-center font-bold">{t("gotPoints")}</p>
          <p className="text-center">{t("gotPointsDesc")}</p> */}
          <button
            className="mx-auto text-white bg-gray-600 hover:opacity-50 px-1 py-2.5 rounded-md w-[60%] mt-3"
            onClick={() => navigate("/")}
          >
            {t("returnHome")}
          </button>
        </div>
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
};

export default RedrawGacha;
