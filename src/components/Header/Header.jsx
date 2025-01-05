import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "./Header.css";
import userProfile from "../../../image/user.png";

const Header = () => {
  const navLinks = (
    <>
      <li>
        <NavLink className="text-[16px] py-2" to={`/`}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className="text-[16px] py-2" to={"/secret"}>
          Secret
        </NavLink>
      </li>
    </>
  );

  const { user, logOut } = useContext(AuthContext);

  // logout
  const handleLogout = () => {
    logOut()
      .then(() => {
        toast("sign out successfully");
      })
      .catch((e) => {
        console.error(e.message);
        toast.error(e.message);
      });
  };

  return (
    <div className="sticky top-0 z-40">
      <div className="navbar bg-gray-100">
        <div className="navbar-start ">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm space-y-1 lg:space-y-0 dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {navLinks}
            </ul>
          </div>
          <a className="text-3xl">AuthTech</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-3">{navLinks}</ul>
        </div>

        <div className="navbar-end">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-11 rounded-full">
                  <img alt="user-profile" src={userProfile} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm space-y-2 dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow"
              >
                <li>
                  <Link className="py-2 bg-gray-100" aria-disabled>
                    {user ? user?.displayName : ""}
                  </Link>
                </li>
                <li>
                  <button
                    className="bg-gray-100 text-black"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to={"/login"}
              className="btn btn-sm h-10 btn-primary text-white"
            >
              Sign in
            </Link>
          )}
        </div>
        <ToastContainer autoClose={1500} />
      </div>
    </div>
  );
};

export default Header;
