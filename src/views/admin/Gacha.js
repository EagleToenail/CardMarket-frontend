import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart, removeMultipart } from "../../utils/setHeader";
import formatPrice from "../../utils/formatPrice";
import subCategories from "../../utils/subCategories";
import usePersistedUser from "../../store/usePersistedUser";

import AgreeButton from "../../components/Forms/AgreeButton";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";
import uploadimage from "../../assets/img/icons/upload.png";
import Spinner from "../../components/Others/Spinner";

function Gacha() {
  const navigate = useNavigate();
  const [user] = usePersistedUser();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  const lang = i18n.language;

  const [formData, setFormData] = useState({
    type: 1,
    name: "",
    price: 0,
    category: "",
    kind: [],
    awardRarity: 0,
    order: 1,
    file: null,
    time: 0
  });
  const [categories, setCategories] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [gacha, setGacha] = useState(null);
  const [delGachaId, setDelGachaId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const subCats = subCategories.map((prize) => ({
    value: prize,
    label: t(prize),
  }));
  const [selSubCats, setSelSubCats] = useState([]);

  useEffect(() => {
    getCategory();
    getGacha();
  }, []);

  const getCategory = async () => {
    const res = await api.get("admin/get_category");

    if (res.data.status === 1) {
      setCategories(res.data.category);
    }
  };

  const getGacha = async () => {
    setSpinFlag(true);
    const res = await api.get("/admin/gacha");
    setSpinFlag(false);

    if (res.data.status === 1) setGacha(res.data.gachaList);
  };

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

  const addPrizeToGacha = (gachaId) => {
    navigate("/admin/gachaEdit", { state: { gachaId: gachaId } });
  };

  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const changeKind = (options) => {
    setSelSubCats(options);

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        kind: options,
      };

      // If options do not contain "round_number_prize", set awardRarity to 0
      if (!options.some((item) => item.value === "round_number_prize")) {
        updatedFormData.awardRarity = 0;
      }

      return updatedFormData;
    });
  };

  const addGacha = async () => {
    try {
      if (!user.authority["gacha"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setAuthToken();
      setMultipart();

      if (formData.name.trim() === "") {
        showToast(t("requiredGachaName"), "error");
      } else if (parseFloat(formData.price) < 0) {
        showToast(t("price") + " " + t("greaterThan"), "error");
      } else if (formData.category.trim() === "") {
        showToast(t("selectOption") + " : " + t("category"), "error");
      } else if (
        selSubCats.some((item) => item.value === "round_number_prize") &&
        parseFloat(formData.awardRarity) < 0
      ) {
        showToast(t("awardRarity") + " " + t("greaterThan"), "error");
      } else if (
        formData.file === NaN ||
        formData.file === null ||
        formData.file === undefined
      ) {
        showToast(t("selectImage"), "error");
      } else {
        setSpinFlag(true);
        const res = await api.post("/admin/gacha", formData);
        setSpinFlag(false);

        if (res.data.status === 1) {
          showToast(t(res.data.msg), "success");
          setImgUrl("");
          fileInputRef.current.value = null;
          setFormData({
            ...formData,
            type: 1,
            name: "",
            price: 0,
            awardRarity: 0,
            order: 1,
            kind: [],
            category: "",
            file: null,
            time: 0
          });
          setSelSubCats([]);
          removeMultipart();
          getCategory();
          getGacha();
        } else showToast(t(res.data.msg), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  const releaseGacha = () => {};

  const setRelease = async (gachaId) => {
    try {
      if (!user.authority["gacha"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }
      setSpinFlag(true);
      const res = await api.get(`/admin/gacha/set_release/${gachaId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successReleaseGacha"), "success");
        getGacha();
      } else {
        showToast(t("failedReleaseGacha"), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  const delGacha = async () => {
    try {
      if (!user.authority["gacha"]["delete"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      setIsModalOpen(false);

      setSpinFlag(true);
      const res = await api.delete(`/admin/gacha/${delGachaId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successDeleted", "success"));
        getGacha();
      } else showToast(t("failedDeleted", "error"));
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  return (
    <div className="relative px-3 pt-2 py-12">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("gacha")} />
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full lg:w-[35%] mb-2 border-1 h-fit">
          <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
            {t("add") + " " + t("gacha")}
          </div>
          <div className="flex flex-col justify-between items-center p-2 w-full">
            <label htmlFor="fileInput" className="text-gray-700 p-1 mb-2">
              {t("gacha") + " " + t("image")}
            </label>
            <input
              name="fileInput"
              type="file"
              id="fileInput"
              ref={fileInputRef}
              className="image p-1 w-full form-control"
              onChange={handleFileInputChange}
              autoComplete="fileInput"
            />
            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="prize"
              className={`cursor-pointer ${
                imgUrl ? "w-auto h-[250px]" : ""
              }  object-cover`}
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            />
          </div>
          <div className="flex flex-col p-2">
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="type" className="text-gray-700">
                {t("type")}
              </label>
              <select
                name="type"
                className="p-1 w-full form-control cursor-pointer"
                onChange={changeFormData}
                value={formData.type}
                id="type"
                autoComplete="type"
              >
                <option value={1}>{t("gacha")} 1</option>
                <option value={2}>{t("gacha")} 2</option>
              </select>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="name" className="text-gray-700">
                {t("name")}
              </label>
              <input
                name="name"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.name}
                id="name"
                autoComplete="name"
              />
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="price" className="text-gray-700">
                {t("price")} (pt)
              </label>
              <input
                name="price"
                type="number"
                min={0}
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.price}
                id="price"
                autoComplete="price"
              />
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="category" className="text-gray-700">
                {t("category")}
              </label>
              <select
                name="category"
                className="p-1 w-full form-control cursor-pointer"
                onChange={changeFormData}
                value={formData.category}
                id="category"
                autoComplete="name"
              >
                <option value="">{t("selectOption")}</option>
                {categories
                  ? categories.map((data, i) => {
                      let catName;
                      switch (lang) {
                        case "ch1":
                          catName = data.ch1Name;
                          break;
                        case "ch2":
                          catName = data.ch2Name;
                          break;
                        case "vt":
                          catName = data.vtName;
                          break;
                        case "en":
                          catName = data.enName;
                          break;

                        default:
                          catName = data.jpName;
                          break;
                      }

                      return (
                        <option key={i} id={data._id} value={data._id}>
                          {catName}
                        </option>
                      );
                    })
                  : ""}
              </select>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="kind" className="text-gray-700">
                {t("kind")}
              </label>
              <Select
                isMulti
                name="kind"
                options={subCats}
                value={selSubCats}
                onChange={changeKind}
                placeholder={t("selectOption")}
                className="basic-multi-select w-full cursor-pointer"
                classNamePrefix="select"
              />
            </div>
            {selSubCats.some((item) => item.value === "round_number_prize") && (
              <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
                <label htmlFor="awardRarity" className="text-gray-700">
                  {t("awardRarity")}
                </label>
                <input
                  name="awardRarity"
                  type="number"
                  className="p-1 w-full form-control"
                  onChange={changeFormData}
                  value={formData.awardRarity}
                  id="awardRarity"
                  autoComplete="awardRarity"
                />
              </div>
            )}
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="order" className="text-gray-700">
                {t("order")}
              </label>
              <input
                name="order"
                type="number"
                min={0}
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.order}
                id="order"
                autoComplete="order"
              />
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="time" className="text-gray-700">
                {t("time")}
              </label>
              <input
                name="time"
                type="number"
                min={0}
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.time}
                id="time"
                autoComplete="time"
              />
            </div>
            <div className="flex flex-wrap justify-end">
              <AgreeButton
                name={t("add")}
                addclassName="inline-block float-right"
                onClick={addGacha}
              />
            </div>
          </div>
        </div>
        <div className="overflow-auto flex flex-wrap w-full lg:w-[65%] h-fit">
          <div className="border-1 py-2 bg-admin_theme_color text-gray-200 text-center w-full">
            {t("gacha") + " " + t("list")}
          </div>
          <table className="w-full m-auto">
            <thead className="bg-admin_theme_color font-bold text-gray-200">
              <tr>
                <th>{t("no")}</th>
                <th>{t("image")}</th>
                <th>{t("type")}</th>
                <th>{t("name")}</th>
                <th>{t("price")}</th>
                <th>{t("category")}</th>
                <th>{t("kind")}</th>
                <th>{t("number")}</th>
                <th>{t("order")}</th>
                <th>{t("time")}</th>
              </tr>
            </thead>
            <tbody>
              {gacha && gacha.length !== 0 ? (
                gacha.map((data, i) => {
                  let catName;
                  switch (lang) {
                    case "ch1":
                      catName = data.category.ch1Name;
                      break;
                    case "ch2":
                      catName = data.category.ch2Name;
                      break;
                    case "vt":
                      catName = data.category.vtName;
                      break;
                    case "en":
                      catName = data.category.enName;
                      break;

                    default:
                      catName = data.category.jpName;
                      break;
                  }

                  return (
                    <React.Fragment key={data._id}>
                      <tr
                        key={i}
                        className={`border-2 ${
                          data.isRelease ? "bg-[#f2f2f2]" : ""
                        }`}
                      >
                        <td rowSpan="2">{i + 1}</td>
                        <td>
                          <img
                            src={
                              process.env.REACT_APP_SERVER_ADDRESS +
                              data.img_url
                            }
                            width="100"
                            className="mx-auto"
                            alt="gacha thumnail"
                          />
                        </td>
                        <td>{t("gacha") + " " + data.type}</td>
                        <td>{data.name}</td>
                        <td>{formatPrice(data.price)}pt</td>
                        <td>{catName}</td>
                        <td>
                          {data.kind.map((item, i) => (
                            <p key={i}>{t(item.value)}</p>
                          ))}
                        </td>
                        <td>
                          {
                            data.remain_prizes.filter((item) => item.order != 0)
                              .length
                          }{" "}
                          / {data.total_number}
                        </td>
                        <td>{data.order}</td>
                        <td>{data.time}</td>
                      </tr>
                      <tr
                        className={`border-2 ${
                          data.isRelease ? "bg-[#f2f2f2]" : ""
                        }`}
                      >
                        <td colSpan="9">
                          <div className="flex flex-wrap justify-center">
                            <button
                              className="py-1 px-4 m-1 bg-gray-200 text-center text-gray-600"
                              onClick={() => {
                                if (data.isRelease) {
                                  showToast(t("notAllowed"), "error");
                                } else {
                                  addPrizeToGacha(data._id);
                                }
                              }}
                            >
                              {t("edit") + " " + t("gacha")}
                            </button>
                            <button
                              className="py-1 px-4 m-1 bg-gray-200 text-center text-gray-600"
                              onClick={() => setRelease(data._id)}
                            >
                              {data.isRelease
                                ? t("unrelease") + " " + t("gacha")
                                : t("release") + " " + t("gacha")}
                            </button>
                            <button
                              className="py-1 px-4 m-1 bg-red-500 text-center text-gray-200"
                              onClick={() => {
                                if (data.isRelease) {
                                  showToast(t("notAllowed"), "error");
                                } else {
                                  setDelGachaId(data._id);
                                  setIsModalOpen(true);
                                }
                              }}
                            >
                              {t("delete") + " " + t("gacha")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9">{t("nogacha")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={delGacha}
      />
    </div>
  );
}

export default Gacha;
