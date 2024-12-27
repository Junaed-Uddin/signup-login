import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { ImSpinner9, ImSpinner2 } from "react-icons/im";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../Provider/AuthProvider";

const Registration = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // auth context
  const {
    googleSignIn,
    githubSignIn,
    registrationUser,
    updateProfileData,
    verificationByEmail,
    logOut,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // auth provider
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  // google sign in
  const handleGoogleSignIn = () => {
    googleSignIn(googleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        toast("User created Successfully");
        setTimeout(() => {
          navigate(location?.state ? location.state : "/");
        }, 1000);
      })
      .catch((e) => {
        console.error(e);
        console.error(e.code);
        toast.error(e.message);
      });
  };

  // github sign in
  const handleGithubSignIn = () => {
    githubSignIn(githubProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        toast("User created Successfully");
        setTimeout(() => {
          navigate(location?.state || "/");
        }, 1100);
      })
      .catch((e) => {
        console.log(e.message);
        toast.error(e.message);
      });
  };

  // email handler
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // handle password
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    //email validate
    if (!email.length) {
      setSuccessMsg("");
      return setErrorMsg("");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      setSuccessMsg("");
      setErrorMsg("Provide a valid email address");
      return;
    } else {
      setErrorMsg("");
    }

    // password validate
    if (!password.length) {
      setErrorMsg("");
      return;
    } else if (password.length < 6) {
      setSuccessMsg("");
      setErrorMsg("Password should be at least 6 characters long");
      setLoadingSpinner(false);
      return;
    } else if (!/[A-Z]/.test(password)) {
      setErrorMsg("At least one character should be uppercase");
      setSuccessMsg("");
      setLoadingSpinner(false);
      return;
    } else {
      setErrorMsg("");
    }
  }, [email, password]);

  // submit handler
  const handleRegistration = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);
    let name = e.target.name.value;
    let terms = e.target.checkbox.checked;

    // reset error & success message
    setErrorMsg("");
    setSuccessMsg("");

    // check terms
    if (!terms) {
      setErrorMsg("Please Accept our Terms & Conditions");
      setLoadingSpinner(false);
      return;
    }

    // create user validation
    registrationUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setSuccessMsg("User created Successfully");
        console.log(user);
        // update profile
        updateProfileData({ displayName: name })
          .then(() => {
            // profile updated
          })
          .catch((e) => console.error(e));

        // verification email
        verificationByEmail().then(() => {
          setLoadingSpinner(false);
          toast.success("Email verification has sent. Please check..");

          // signout after registration
          logOut()
            .then(() => {
              // logout successfully
            })
            .catch((e) => {
              console.error(e);
            });

          // input reset
          e.target.name.value = "";
          e.target.email.value = "";
          e.target.password.value = "";
          // page redirect to the login page
          setTimeout(() => {
            navigate("/login");
          }, 1600);
        });
      })
      .catch((e) => {
        console.error(e);
        setLoadingSpinner(false);
        setErrorMsg("Your email already in-use");
      });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center">
      {/* registration starts  */}
      <div className="w-full px-4 py-4 rounded-md shadow sm:pt-6 sm:px-8 bg-gray-50 text-gray-800">
        <h2 className="mb-3 text-3xl font-semibold text-center">
          Create your account
        </h2>
        <p className="text-sm text-center text-gray-600">
          {`Already have an account? `}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
        <div className="flex flex-col sm:flex-row justify-start items-center space-y-3 sm:space-y-0 my-5 space-x-0 sm:space-x-3">
          {/* google  */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="flex items-center justify-center w-full p-3 space-x-2 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 focus:ring-violet-600"
          >
            <FcGoogle className="text-2xl"></FcGoogle>
            <p>Google</p>
          </button>
          {/* github  */}
          <button
            onClick={handleGithubSignIn}
            role="button"
            className="flex items-center justify-center w-full p-3 space-x-2 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 focus:ring-violet-600"
          >
            <FaGithub className="text-2xl"></FaGithub>
            <p>GitHub</p>
          </button>
        </div>
        <div className="flex items-center w-full my-2">
          <hr className="w-full text-gray-600" />
          <p className="px-3 text-gray-600">OR</p>
          <hr className="w-full text-gray-600" />
        </div>
        <form onSubmit={handleRegistration} className="space-y-4">
          <div className="space-y-4">
            {/* name  */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm">
                Full Name
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="Name"
                className="w-full px-3 py-2 border rounded-md bg-white text-black"
              />
            </div>
            {/* email  */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm">
                Email address
              </label>
              <input
                onChange={handleEmail}
                required
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-md bg-white text-black"
              />
            </div>
            {/* password  */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  required
                  onChange={handlePassword}
                  type={`${showPassword ? "text" : "password"}`}
                  name="password"
                  placeholder="*****"
                  className="w-full px-3 py-2 border rounded-md bg-white text-black"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[13px] right-3"
                >
                  {showPassword ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>}
                </span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center px-8 py-3 font-semibold rounded-md bg-violet-600 text-gray-50"
          >
            <ImSpinner9
              className={`mr-3 ${loadingSpinner ? "animate-spin " : "hidden"}`}
            ></ImSpinner9>
            Registration
          </button>
          {/* terms & condition  */}
          <div className="flex justify-start items-center space-x-2">
            <input
              type="checkbox"
              name="checkbox"
              className="checkbox [--chkbg:theme(colors.black)] [--chkfg:white] checked:border-black border border-blue-400 checkbox-xs"
            />
            <span className="text-[14px]">
              Accept our{" "}
              <Link className="hover:underline text-blue-500">
                Terms and Conditions
              </Link>
            </span>
          </div>
          {/* set error/success message */}
          {loadingSpinner ? (
            <ImSpinner2 className="animate-spin"></ImSpinner2>
          ) : (
            <div>
              {errorMsg && (
                <div className="flex justify-start items-center space-x-1">
                  <FaXmark className="text-red-500 mt-0.5"></FaXmark>
                  <p className="text-red-500">{errorMsg}</p>
                </div>
              )}
              {successMsg && (
                <div className="flex justify-start items-center space-x-1">
                  <IoIosCheckmarkCircleOutline className="text-green-500 mt-0.5"></IoIosCheckmarkCircleOutline>
                  <p className="text-green-500">{successMsg}</p>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Registration;
