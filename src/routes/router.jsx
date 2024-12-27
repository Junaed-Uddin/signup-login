import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Registration from "../components/Registration/Registration";
import Login from "../components/Login/Login";
import Secret from "../components/Secret/Secret";
import Home from "../components/Home/Home";
import PrivateRouter from "./PrivateRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/register",
        element: <Registration></Registration>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/secret",
        element: (
          <PrivateRouter>
            <Secret></Secret>
          </PrivateRouter>
        ),
      },
    ],
  },
]);

export default router;
