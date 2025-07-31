import { useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';

import NET from 'vanta/dist/vanta.net.min';
import Nav from '../src/components/Navbar';
import Head from '../src/components/Head';
import Post from '../src/components/Post';
import Login from '../src/components/Login';
import Register from '../src/components/Register';
import Dashboard from '../src/components/Dashboard';
import Logout from './components/logout';
import NavSch from "./components/NavSch"
import Greeting from "./components/Greeting"
import UrPost from './components/UrPost';
import EditForm from './components/EditForm';
import Footer from './components/Footer';

async function requireAuth() {
  const token = localStorage.getItem('token');
  if (!token) return redirect('/login');

  const res = await fetch('http://localhost:3002/items', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    localStorage.removeItem('token');
    return redirect('/login');
  }
  return res.json;
}

async function fetchCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return redirect('/login');

  const res = await fetch('http://localhost:3002/getUser', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    localStorage.removeItem('token');
    return redirect('/login');
  }
  return res.json(); // returns { name, email, phone... }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Greeting></Greeting>
      </>
    ),
  },
  {
    path: '/login',
    element: (
      <>
        <Login />
      </>
    ),
  },
  { path: '/register', element: <Register /> },
  {
    path: '/home',
    loader: fetchCurrentUser,
    element: (
      <>
        <Nav />
        <Head />
        <Footer/>
      </>
    ),
  },
  {
    path: '/dashboard',
    loader: requireAuth,
    element: (
      <>
        <NavSch />
        <Dashboard />
      </>
    ),
  },
  {
    path: '/post-item',
    loader: requireAuth,
    element: (
      <>
        <Nav />
        <Post />
      </>
    ),
  },
  { path: '/logout', element: <Logout /> },
  {
    path: '/Hola',
    element: (
      <>
        <Greeting></Greeting>
      </>
    ),
  },
  {
    path: '/your-post',
    loader: requireAuth,
    element: (
      <>
        <Nav />
        <UrPost />
      </>
    ),
  },
  {
    path: '/edit-post/:id',
    loader: requireAuth,
    element: (
      <>
        <Nav />
        <EditForm />
      </>
    ),
  },
]);

function App() {
  useEffect(() => {
    NET({
      el: '#vanta',
      color: 0xfacc15,
      backgroundColor: 0x0,
    });
  }, []);

  return (
    <div>
      <div className="h-full w-full overflow-x-hidden fixed -z-20" id="vanta"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-yellow-400/10 via-white/5 to-black/20 animate-pulse-blur"></div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
