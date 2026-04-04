import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B1220] overflow-hidden text-white">

      {/* BIG FADED 404 BACKGROUND */}
      <h1 className="absolute text-[220px] font-extrabold text-white/5 select-none">
        404
      </h1>

      {/* MAIN CARD */}
      <div className="relative z-10 text-center px-6 py-10 rounded-2xl">

        {/* Cartoon / Robot */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="robot"
            className="w-40 animate-bounce"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-2">
          Uh-oh! Nothing here...
        </h2>

        {/* PATH */}
        <p className="text-gray-400 text-sm mb-6">
          The page{" "}
          <span className="text-indigo-400">{location.pathname}</span> doesn’t exist.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 transition shadow-lg text-white font-medium"
        >
          Go Back Home
        </button>
      </div>

      {/* GLOW EFFECT */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />
    </div>
  );
};

export default NotFound;