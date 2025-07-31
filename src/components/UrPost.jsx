import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCard from './MyCard';
import { ToastContainer, toast, Slide } from "react-toastify";

const UrPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const res = await fetch('http://localhost:3002/getUserItem', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error('Session expired ... please login again');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }

      const data = await res.json();
      setItems(data);
      setLoading(false);
    };

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-yellow-400">
        Loading...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center max-w-md w-4/5 text-gray-400 text-2xl">
          No Listing Available
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/10 backdrop-blur-md min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <MyCard
            key={item.item_id}
            id={item.item_id}
            title={item.title}
            url={item.url}
            description={item.description}
          // owner_email={item.owner_email}
          // claimer_email={user.email}
          />
        ))}
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

export default UrPost;
