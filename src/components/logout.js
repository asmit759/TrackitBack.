const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
  localStorage.setItem('greetingShown', 'false'); 
};

export default handleLogout;

