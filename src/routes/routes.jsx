import config from "@/config/routes";

// Pages
import Courses from "@/pages/Courses";
import Home from "@/pages/Home";

const publicRoutes = [
  { path: config.home, component: Home },
  { path: config.courses, component: Courses },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
