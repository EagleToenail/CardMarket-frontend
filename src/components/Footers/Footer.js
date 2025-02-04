import { useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { Nav, NavItem } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import '../../assets/css/responsive.css';

import { bgColorAtom } from "../../store/theme";
import api from "../../utils/api";
import { categoryAtom } from "../../store/category";

const Footer = () => {
  const [category, setCategory] = useState(null);
  const [categoryFilter, setCategoryFilter] = useAtom(categoryAtom);
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const [bgColor] = useAtom(bgColorAtom);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const changeMainCat = (cat) => {
    // getGacha();
    setCategoryFilter(cat);
  };

  useEffect(() => {
    api
      .get("admin/get_category")
      .then((res) => {
        if (res.data.status === 1) {
          setCategory(res.data.category);
        }
      })
  }, []);

  return (
    <div
      className="w-full py-3 xsm:px-4 relative bottom-0 z-10 flex flex-wrap justify-center"
    >
      <div className="lg:w-3/4 sm:w-full xm flex flex-wrap px-1 pb-10">
        <div className="footer-responsive flex flex-wrap lg:w-[15%] sm:w-[100%] pb-2">
          <Nav className="nav-footer text-white grid grid-cols-1 gap-2">
          {category != null
                ? category.map((data, i) => {
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
                      <NavItem key={i} id={data.id}>
                        <div className={`pt-1 hover:cursor-pointer`}
                        >
                          <span className="text-black text-16" onClick={() => {changeMainCat(data._id)}}> {catName} </span>
                        </div>
                      </NavItem>
                    );
                  })
                : null}{" "}
          </Nav>
        </div>
        <div className="footer-responsive flex flex-wrap  lg:w-[15%] sm:w-[100%] pb-2">
          <Nav className="nav-footer text-white grid grid-cols-1 gap-2">
            <NavItem>
              <div className="pt-1 hover:cursor-pointer">
                <span
                  className="text-black"
                  onClick={() => window.open("https://company.on-gacha.com/lp/shotorihiki/", "_blank")}
                >
                  {t("specialLaw")}
                </span>
              </div>
            </NavItem>

            <NavItem>
              <div className="pt-1 hover:cursor-pointer">
                <span
                  className="text-black"
                  onClick={() => window.open("https://company.on-gacha.com/lp/riyoukiyaku/", "_blank")}
                >
                  {t("userterms")}
                </span>
              </div>
            </NavItem>

            <NavItem>
              <div className="pt-1 hover:cursor-pointer">
                <span className="text-black" onClick={() => navigate("/user/blog")}>
                  {t("blog")}
                </span>
              </div>
            </NavItem>

            <NavItem>
              <div className="pt-1 hover:cursor-pointer">
                <span
                  className="text-black hover:underline-offset-2"
                  onClick={() => navigate("/user/license")}
                >
                  {t("license")}
                </span>
              </div>
            </NavItem>
          </Nav>
        </div>
        <div className="footer-responsive copyright text-black py-1 flex-1">
          <div className="w-full flex lg:justify-end sm:justify-begin">
            <div>
              © {new Date().getFullYear()}{" "}
              <button
                className="font-weight-bold text-red-900"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-black text-md">Operating Company</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;
