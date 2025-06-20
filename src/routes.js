import Index from "./views/Index.js";
import License from "./views/user/License.js";
import Terms from "./views/user/Terms.js";
import SpecialLaw from "./views/user/SpecialLaw.js";
import Category from "./views/admin/Category.js";
import Prize from "./views/admin/Prize.js";
import PrizeVideo from "./views/admin/PrizeVideo.js";
import Statistics from "./views/admin/Statistics.js";
import User from "./views/admin/User.js";
import Gacha from "./views/admin/Gacha.js";
import Point from "./views/admin/Point.js";
import GachaEdit from "./views/admin/GachaEdit.js";
import UseTerms from "./views/admin/UseTerms.js";
import Administrators from "./views/admin/Administrators.js";
import UserDetail from "./views/admin/UserDetail.js";
import Delivering from "./views/admin/Delivering.js";
import AdminLogin from "./views/auth/AdminLogin.js";
import Login from "./views/auth/Login.js";
import Forgot from "./views/auth/Forgot.js";
import Register from "./views/auth/Register.js";
import Profile from "./views/user/Profile.js";
import PurchasePoint from "./views/user/PurchasePoint.js";
import PointLog from "./views/user/PointLog.js";
import AcquisitionHistory from "./views/user/AcquisitionHistory.js";
import GachaDetail from "./views/user/GachaDetail.js";
import Blog from "./views/user/Blog.js";
import BlogDetail from "./views/user/BlogDetail.js";
import ChangeShippingAddress from "./views/user/ChangeShippingAddress.js";
import AddShippingAddress from "./views/user/AddShippingAddress.js";
import ShowDrawedPrizes from "./views/user/ShowDrawedPrizes.js";
import DecideShip from "./views/user/DecideShip.js";
import RedrawGacha from "./views/user/RedrawGacha.js";
import InviteFriend from "./views/user/InviteFriend.js";
import Rank from "./views/admin/Rank.js";
import Theme from "./views/admin/Theme.js";
import Carousel from "./views/admin/Carousel.js";
import Rubbish from "./views/admin/Rubbish.js";
import Coupon from "./views/admin/Coupon.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/user",
  },
  {
    path: "/blog",
    name: "Blog",
    icon: "ni ni-tv-2 text-primary",
    component: <Blog />,
    layout: "/user",
  },
  {
    path: "/blogDetail",
    name: "Blog Detail",
    icon: "ni ni-tv-2 text-primary",
    component: <BlogDetail />,
    layout: "/user",
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/user",
  },
  {
    path: "/purchasePoint",
    name: "Purchase Point",
    icon: "ni ni-single-02 text-yellow",
    component: <PurchasePoint />,
    layout: "/user",
  },
  {
    path: "/changeShippingAddress",
    name: "user shiping",
    icon: "fa fa-users",
    component: <ChangeShippingAddress />,
    layout: "/user",
  },
  {
    path: "/addShippingAddress",
    name: "user shiping",
    icon: "fa fa-users",
    component: <AddShippingAddress />,
    layout: "/user",
  },
  {
    path: "/pointsHistory",
    name: "Point History",
    icon: "ni ni-single-02 text-yellow",
    component: <PointLog />,
    layout: "/user",
  },
  {
    path: "/acquisitionHistory",
    name: "Acquisition History",
    icon: "ni ni-single-02 text-yellow",
    component: <AcquisitionHistory />,
    layout: "/user",
  },
  {
    path: "/redrawGacha",
    name: "Redraw Gacha",
    icon: "ni ni-single-02 text-yellow",
    component: <RedrawGacha />,
    layout: "/user",
  },
  {
    path: "/gachaDetail",
    name: "My Card",
    icon: "ni ni-single-02 text-yellow",
    component: <GachaDetail />,
    layout: "/user",
  },
  {
    path: "/terms",
    name: "terms",
    icon: "ni ni-circle-08 text-pink",
    component: <Terms />,
    layout: "/user",
  },
  {
    path: "/lisence",
    name: "lisence",
    icon: "ni ni-circle-08 text-pink",
    component: <License />,
    layout: "/user",
  },
  {
    path: "/specialLaw",
    name: "specialLaw",
    icon: "ni ni-circle-08 text-pink",
    component: <SpecialLaw />,
    layout: "/user",
  },
  {
    path: "/showDrawedPrizes",
    name: "showDrawedPrizes",
    icon: "fa fa-film",
    component: <ShowDrawedPrizes />,
    layout: "/user",
  },
  {
    path: "/decideShip",
    name: "decideShip",
    icon: "fa fa-film",
    component: <DecideShip />,
    layout: "/user",
  },
  {
    path: "/enterCode",
    name: "inviteFriend",
    icon: "fa fa-film",
    component: <InviteFriend />,
    layout: "/user",
  },
  {
    path: "/index",
    name: "statistics",
    icon: "fa fa-bar-chart",
    component: <Statistics />,
    layout: "/admin",
  },
  {
    path: "/admin",
    name: "admin",
    icon: "fa-solid fa-user-secret",
    component: <Administrators />,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "users",
    icon: "fa fa-users",
    component: <User />,
    layout: "/admin",
  },
  {
    path: "/userDetail",
    name: "user detail",
    icon: "fa fa-users",
    component: <UserDetail />,
    layout: "/admin/sub",
  },
  {
    path: "/carousel",
    name: "carousel",
    icon: "fa fa-file-image",
    component: <Carousel />,
    layout: "/admin",
  },
  {
    path: "/rank",
    name: "rank",
    icon: "fa fa-trophy",
    component: <Rank />,
    layout: "/admin",
  },
  {
    path: "/point",
    name: "point",
    icon: "fa-brands fa-product-hunt",
    component: <Point />,
    layout: "/admin",
  },
  {
    path: "/category",
    name: "category",
    icon: "fa-solid fa-list",
    component: <Category />,
    layout: "/admin",
  },
  {
    path: "/prize",
    name: "prize",
    icon: "fa fa-gift",
    component: <Prize />,
    layout: "/admin",
  },
  {
    path: "/rubbish",
    name: "rubbish",
    icon: "fa fa-gift",
    component: <Rubbish />,
    layout: "/admin",
  },
  {
    path: "/prizeVideo",
    name: "prizeVideo",
    icon: "fa fa-film",
    component: <PrizeVideo />,
    layout: "/admin",
  },
  {
    path: "/gacha",
    name: "gacha",
    icon: "fa-brands fa-dropbox",
    component: <Gacha />,
    layout: "/admin",
  },
  {
    path: "/gachaEdit",
    name: "gacha",
    icon: "fa fa-modx",
    component: <GachaEdit />,
    layout: "/admin/sub",
  },
  {
    path: "/coupon",
    name: "coupon",
    icon: "fa fa-gift",
    component: <Coupon />,
    layout: "/admin",
  },
  {
    path: "/delivering",
    name: "delivering",
    icon: "fa fa-truck",
    component: <Delivering />,
    layout: "/admin",
  },
  {
    path: "/useterm",
    name: "userterms",
    icon: "fa-brands fa-readme",
    component: <UseTerms />,
    layout: "/admin",
  },
  {
    path: "/theme",
    name: "theme",
    icon: "fa fa-cogs",
    component: <Theme />,
    layout: "/admin",
  },
  {
    path: "/admin-amlkh741hgw45q88jajg223qw-login",
    name: "Admin Login",
    icon: "ni ni-key-25 text-info",
    component: <AdminLogin />,
    layout: "/auth",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/forgot",
    name: "Forgot",
    icon: "ni ni-key-25 text-info",
    component: <Forgot />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
