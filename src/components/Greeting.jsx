import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const greetings = [
  "ନମସ୍କାର", "নমস্কার", "నమస్కారం", "வணக்கம்",
  "નમસ્કાર", "ನಮಸ್ಕಾರ", "നമസ്കാരം", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  "ꯈꯨꯔꯝꯖꯔꯤ", "السلام علیکم", "नमस्ते",
];

const Greeting = () => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (index < greetings.length - 1) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => prevIndex + 1);
      }, 250);
      return () => clearInterval(interval);
    } else {
      // After all greetings, start exit animation
      const timeout = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  // After exit animation completes, navigate to /login
  const handleExitComplete = () => {
    navigate('/login');
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          className="bg-black h-screen flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl text-white drop-shadow-[0_0_35px_white] font-semibold">
            {greetings[index]}
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Greeting;
