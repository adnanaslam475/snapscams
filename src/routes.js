import Home from "views/pages/Home.js";
import IndexView from "views/Index.js";
import EditProfile from "views/pages/EditProfile";
import Post from "views/pages/Post.js";

const routes = [
  {
    path: "/home",
    name: "Home",
    icon: "ni ni-calendar-grid-59",
    component: IndexView,
    layout: "/admin",
  },
  {
    path: "/post",
    name: "Post",
    icon: "ni ni-calendar-grid-60",
    component: Post,
    layout: "/admin",
  },
  {
    path: "/search",
    name: "Search",
    icon: "ni ni-calendar-grid-61",
    component: Home,
    layout: "/admin",
  },
  {
    path: "/edit-profile",
    name: "Settings",
    icon: "ni ni-calendar-grid-62",
    component: EditProfile,
    layout: "/admin",
  },
];

export default routes;
