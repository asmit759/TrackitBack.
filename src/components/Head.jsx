import React from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import About from "./About"
const Head = () => {
  const navigate = useNavigate();
  const user = useLoaderData();

  return (

    <div className='flex flex-col gap-[10rem]'>
        <div
        className="
          w-11/12 sm:w-5/6 md:w-2/3 lg:w-10/12 mx-auto h-[22rem] min-h-[16rem] max-h-[32rem] bg-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 text-yellow-400 flex flex-col items-center justify-center shadow-md mt-8 "
      >
        <h2
          className=" text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 text-center cursor-pointer "
          onClick={() => navigate('/home')}
        >
          Trackit Back
        </h2>
        <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-center">
          {user?.name
            ? `Welcome, ${user.name} to Trackit Back...`
            : 'Welcome to Trackit Back...'}
        </p>
        <button
          className="mt-8 rounded-xl px-4 py-2 bg-black/40 border text-base md:text-xl font-semibold hover:bg-yellow-300 hover:text-black transition "
          onClick={() => navigate('/dashboard')}
        >
          Drive through
        </button>
      </div>

      <div className='-translate-y-12'>
        <About/>
      </div>
    </div>
  );
};

export default Head;
