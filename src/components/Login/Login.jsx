import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { ImSpinner2, ImSpinner9 } from "react-icons/im";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../Provider/AuthProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // auth context
  const { SignInUser, passwordResetEmail, googleSignIn, githubSignIn } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
        }, 1100);
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

  // login handle
  const handleSignIn = (e) => {
    e.preventDefault();
    // error and success message reset
    setSuccessMsg("");
    setErrorMsg("");
    // loading
    setLoadingSpinner(true);

    SignInUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setLoadingSpinner(false);
        setSuccessMsg("User Login Successfully");
        toast.success("user login successfully");
        // input field reset
        emailRef.current.value = "";
        e.target.password.value = "";
        setTimeout(() => {
          navigate(location?.state || "/");
        }, 1100);
      })
      .catch((e) => {
        console.error(e.message);
        toast.error(e.message);
        setLoadingSpinner(false);
        setErrorMsg(e.message);
      });
  };

  // forgot password handler
  const forgotPasswordHandler = () => {
    // error and success message reset
    setSuccessMsg("");
    setErrorMsg("");

    const email = emailRef.current.value;
    if (!email) {
      setErrorMsg("Please provide an email");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      setErrorMsg("Please provide a valid email");
      return;
    }
    // send password reset email
    passwordResetEmail(email)
      .then(() => {
        toast("Password reset email sent");
        setSuccessMsg("Password reset email sent");
      })
      .catch((e) => {
        console.error(e.message);
        toast.error(e.message);
      });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center">
      {/* registration starts  */}
      <div className="w-full px-4 py-4 rounded-md shadow sm:pt-8 sm:px-8 bg-gray-50 text-gray-800">
        <h2 className="mb-3 text-3xl font-semibold text-center">
          Login your account
        </h2>
        <p className="text-sm text-center text-gray-600">
          {`Don't have an account? `}
          <Link to="/register" className="text-blue-500 hover:underline">
            Registration here
          </Link>
        </p>
        <div className="flex flex-col sm:flex-row justify-start items-center space-y-3 sm:space-y-0 my-6 space-x-0 sm:space-x-3">
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
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-4">
            {/* email  */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm">
                Email address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                ref={emailRef}
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
                <Link
                  onClick={forgotPasswordHandler}
                  className="text-xs hover:underline text-gray-600"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            Login
          </button>

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

export default Login;
