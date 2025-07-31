import React, { useState } from 'react';
import MapIcon from '../assets/location.png';
import pic from '../assets/pic.jpg';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Card = ({ title, location, url, description, id }) => {
  const [submit, setSubmit] = useState(true);

  const handleClaim = async () => {
    if (!submit) return; // prevent clicks during processing

    setSubmit(false);

    const cooldownKey = `claimed_${id}`;
    const lastClaim = localStorage.getItem(cooldownKey);
    const now = Date.now();
    const cooldownPeriod = 2 * 24 * 60 * 60 * 1000; // 2 days

    if (lastClaim && now - parseInt(lastClaim) < cooldownPeriod) {
      toast.warn('Claim email already sent. Try again after 2 days.', {
        position: 'top-center',
      });
      setSubmit(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/sendClaimMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      const { owner_email, claimer_email } = data;

      if (owner_email === claimer_email) {
        toast.error('Owner and claimer cannot be same', {
          position: 'top-center',
        });
        setSubmit(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      localStorage.setItem(cooldownKey, now.toString());

      toast.success('Email sent successfully!', {
        position: 'top-center',
      });
    } catch (err) {
      toast.error('Failed to send claim email', {
        position: 'top-center',
      });
    }

    setSubmit(true);
  };

  return (
    <div className="h-100 p-6" id="cards">
      <div className="bg-white/30 backdrop-blur p-4 flex flex-col items-center rounded-2xl gap-3 hover:scale-105 transition-all ease-in-out" id="card">
        <div className='w-55 h-60 group relative'>
          <img
            src={url || pic}
            alt={title}
            className="w-55 h-60 rounded-2xl object-cover absolute top-0 group-hover:-top-12 group-hover:transition-all group-hover:ease-in-out group-hover:duration-200"
          />
        </div>

        <div className="flex gap-4 relative">
          <div className="flex flex-col gap-2.5 transition-opacity duration-200 ease-in-out group-hover:opacity-0">
            <h2 className="text-xl font-semibold text-amber-200">{title}</h2>
            <p className="font-medium text-green-400 flex gap-2">
              <img src={MapIcon} className="h-7.5 bg-amber-200 p-0.5 rounded-full" alt="location" />
              {location}
            </p>
          </div>

          <div className='translate-y-3.5'>
            <div
              className={`cursor-pointer border-3 border-black bg-gray-500 pb-[10px] transition-all duration-200 select-none active:pb-0 active:mb-[10px] active:translate-y-[10px] group-hover:opacity-100 ${
                !submit ? 'pointer-events-none opacity-50' : ''
              }`}
              onClick={submit ? handleClaim : null}
            >
              <div className="bg-[#dddddd] border-4 border-white px-2 py-1 active:bg-yellow-400">
                <span className="text-[1.2em] tracking-wide">
                  {submit ? 'Claim' : 'Sending...'}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-0 transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100 group-hover:-top-12">
            <h2 className="text-xl font-semibold text-amber-200">{description}</h2>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        limit={1}
      />
    </div>
  );
};

export default Card;
