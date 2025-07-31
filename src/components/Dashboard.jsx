import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from './Card';
import { ToastContainer, toast,Slide } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const searchQuery = new URLSearchParams(location.search).get('search')?.toLowerCase() || "";

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const res = await fetch('http://localhost:3002/items', {
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

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery === "") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(item =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.location.toLowerCase().includes(searchQuery)
        )
      );
    }
  }, [searchQuery, items]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white/10 backdrop-blur-md p-4">
      {filteredItems.length === 0 ? (
        <div className="col-span-full text-center text-gray-600">No items found.</div>
      ) : (
        filteredItems.map(item => (
          <Card key={item.id} {...item} />
        ))
      )}
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

export default Dashboard;
