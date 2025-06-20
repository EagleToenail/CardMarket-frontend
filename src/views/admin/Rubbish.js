import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import formatPrice from "../../utils/formatPrice";
import {
  setAuthToken,
  setMultipart,
  removeMultipart,
} from "../../utils/setHeader";

import AgreeButton from "../../components/Forms/AgreeButton";
import RubbishList from "../../components/Tables/RubbishList";
import PageHeader from "../../components/Forms/PageHeader";
import uploadimage from "../../assets/img/icons/upload.png";
import Spinner from "../../components/Others/Spinner";
import PrizeCard from "../../components/Others/PrizeCard";

import usePersistedUser from "../../store/usePersistedUser";

const Rubbish = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const [user] = usePersistedUser();

  const [cuflag, setCuFlag] = useState(1);
  const [trigger, setTrigger] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [rubbishs, setRubbishs] = useState([]);
  const [spinFlag, setSpinFlag] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    cashBack: 0,
    file: null,
  });

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file !== undefined) {
      setFormData({ ...formData, file: file });
      const reader = new FileReader();

      reader.onload = (e) => {
        setImgUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addRubbish = async () => {
    try {
      if (!user.authority["rubbish"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setAuthToken();
      setMultipart();
      if (
        cuflag === 1 &&
        (formData.file === NaN ||
          formData.file === null ||
          formData.file === undefined)
      ) {
        showToast(t("selectImage"), "error");
      } else if (formData.name.trim() === "") {
        showToast(t("requiredName"), "error");
      } else if (parseInt(formData.cashBack) < 0) {
        showToast(t("cashback") + " " + t("greaterThan"), "error");
      } else {
        setSpinFlag(true);
        const res = await api.post("/admin/rubbish", formData);
        setSpinFlag(false);

        if (res.data.status === 1) {
          setImgUrl(null);
          setTrigger(!trigger);
          fileInputRef.current.value = null;
          setFormData({
            ...formData,
            id: "",
            name: "",
            cashBack: 0,
            file: null,
          });
          removeMultipart();
          showToast(t(res.data.msg), "success");
        } else showToast(t(res.data.msg), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  const updateRubbish = () => {
    if (!user.authority["rubbish"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setCuFlag(1);
    addRubbish();
  };

  const uploadCancel = () => {
    csvInputRef.current.value = null;
    setRubbishs([]);
  };

  // upload bulk rubbish from csv file
  const uploadRubbish = async () => {
    try {
      if (!user.authority["gacha"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setAuthToken();

      if (rubbishs.length === 0) {
        showToast(t("selectCSV"), "error");
      } else {
        setSpinFlag(true);
        const res = await api.post("/admin/gacha/upload_bulk", {
          prizes: rubbishs,
        });
        setSpinFlag(false);

        if (res.data.status === 1) {
          showToast(t("successAdded"), "success");
          setTrigger(!trigger);
          uploadCancel();
        } else {
          showToast(t("failedAdded"), "error");
        }
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  return (
    <div className="px-3 pt-2 py-12">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("rubbish")} />
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full lg:w-[35%] mb-2 border-1 h-fit">
          <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
            {t("rubbish") + " " + t("add")}
          </div>
          <div className="flex flex-col justify-between items-center p-2 w-full">
            <label
              htmlFor="fileInput"
              className="text-gray-700 px-1 justify-start flex flex-wrap w-full"
            >
              {t("rubbish") + " " + t("image")}
            </label>
            <input
              name="fileInput"
              type="file"
              id="fileInput"
              ref={fileInputRef}
              className="image p-1 w-full form-control"
              onChange={handleFileInputChange}
              autoComplete="name"
            />
            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="rubbish"
              className={`cursor-pointer ${
                imgUrl ? "w-auto h-[250px]" : ""
              } object-cover`}
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            />
          </div>
          <div className="flex flex-col p-2">
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="prizename" className="text-gray-700">
                {t("name")}
              </label>
              <input
                name="name"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.name}
                id="prizename"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="cashBack" className="text-gray-700">
                {t("cashback")} (pt)
              </label>
              <input
                type="number"
                min={0}
                name="cashBack"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.cashBack}
                id="cashBack"
                autoComplete="name"
              ></input>
            </div>
            {/* <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="totalNumber" className="text-gray-700">
                {t("count")}
              </label>
              <input
                type="number"
                name="totalNumber"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.totalNumber}
                id="totalNumber"
                autoComplete="name"
              />
            </div> */}
            {/* <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="kind" className="text-gray-700">
                {t("kind")}
              </label>
              <select
                name="kind"
                className="p-1 w-full form-control cursor-pointer"
                onChange={changeFormData}
                value={formData.kind}
                id="kind"
                autoComplete="kind"
              >
                {prizeType.map((item, i) => {
                  return (
                    <option key={i} value={item}>
                      {t(item)}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="deliveryCompany" className="text-gray-700">
                {t("deliveryCompany")}
              </label>
              <input
                name="deliveryCompany"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.deliveryCompany}
                id="deliveryCompany"
                autoComplete="name"
              />
            </div> */}
            <div className="flex flex-wrap justify-end">
              {cuflag ? (
                <AgreeButton name={t("add")} onClick={addRubbish} />
              ) : (
                <>
                  <button
                    className="p-2 px-4 my-1 text-white hover:bg-opacity-50 bg-red-500 rounded-md"
                    onClick={() => {
                      setCuFlag(true);
                      setImgUrl(null);
                      setFormData({
                        ...formData,
                        id: "",
                        name: "",
                        cashBack: 0,
                        // file: null,
                        // kind: "first",
                        // trackingNumber: "",
                        // deliveryCompany: "",
                      });
                    }}
                  >
                    {t("cancel")}
                  </button>
                  <AgreeButton name={t("update")} onClick={updateRubbish} />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-full lg:w-[65%] h-fit">
          <div className="mx-auto w-full border-1 mb-2">
            {/* <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
              {t("set_CSV")}
            </div> */}
            <div className="flex flex-wrap justify-center w-full">
              {/* <a
                className="button-38 my-1 mx-1"
                href={
                  process.env.REACT_APP_SERVER_ADDRESS + `template/template.csv`
                }
                download
              >
                {t("template")}.csv
                <i className="fa fa-download ml-2"></i>
              </a> */}
              {/* <label
                htmlFor="file-upload"
                className="flex flex-col items-center button-22 m-1"
              >
                <span className="text-sm">{t("importCSV")}</span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  ref={csvInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label> */}
              <button className={`button-22 m-1`} onClick={uploadRubbish}>
                {t("add")}
              </button>
              {rubbishs.length > 0 && (
                <button className={`button-22 m-1`} onClick={uploadCancel}>
                  {t("cancel")}
                </button>
              )}
            </div>
            {rubbishs && rubbishs.length !== 0 ? (
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-admin_theme_color font-bold text-gray-200">
                    <tr>
                      <td>{t("no")}</td>
                      <td>{t("image")}</td>
                      <td>{t("name")}</td>
                      <td>{t("cashback")}</td>
                      {/* <td>{t("kind")}</td> */}
                      <td>{t("count")}</td>
                      {/* <td>{t("deliveryCompany")}</td> */}
                    </tr>
                  </thead>
                  <tbody>
                    {rubbishs.map((data, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="mx-auto w-[60px]">
                            <PrizeCard
                              img_url={data.img_url}
                              width={50}
                              height={80}
                            />
                          </div>
                        </td>
                        <td>{data.name}</td>
                        <td>{formatPrice(data.cashback)}pt</td>
                        {/* <td>{t(data.kind)}</td> */}
                        {/* <td>{data.totalNumber}</td> */}
                        {/* <td>{data.deliveryCompany}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="border-1 py-2 bg-admin_theme_color text-gray-200 text-center w-full">
            {t("prize") + " " + t("list")}
          </div>
          <RubbishList
            trigger={trigger}
            setFormData={setFormData}
            setCuFlag={setCuFlag}
            setImgUrl={setImgUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default Rubbish;
