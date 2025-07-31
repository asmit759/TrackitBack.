import { useNavigate } from "react-router-dom";
import React from "react";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-center text-yellow-400/80 gap-4 max-w-4xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-yellow-400 font-bold border-b-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
        About Us
      </h1>

      <p className="text-lg sm:text-xl md:text-2xl font-semibold max-w-3xl">
        Welcome to{" "}
        <span
          className="font-extrabold cursor-pointer hover:text-yellow-300 transition-colors"
          onClick={() => {
            navigate("/home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Trackit Back
        </span>
        ! Our platform is dedicated to making it easy for users to find their lost items within a secure, user-friendly environment.
      </p>

      <p className="text-lg sm:text-xl md:text-2xl font-semibold max-w-3xl">
        Post what you have Lost or Found, browse current listings.
      </p>

      <p className="text-lg sm:text-xl md:text-2xl font-semibold max-w-3xl">
        We prioritize safety, privacy, and a smooth experience. All interactions are protected and require secure authentication. Your session and data are always handled responsibly.
      </p>

      <p className="text-lg sm:text-xl md:text-2xl font-semibold max-w-3xl">
        Thank you for being a part of our growing community. If you have any questions or feedback, feel free to reach out. Happy posting!
      </p>

      <button
        className="mt-4 px-8 py-3 bg-yellow-400 rounded-xl text-gray-700 font-semibold hover:bg-yellow-300 transition-colors max-w-xs w-full sm:w-auto"
      >
        Contact Us!
      </button>
    </div>
  );
};

export default About;
