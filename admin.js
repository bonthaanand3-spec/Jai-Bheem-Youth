// Fixed Admin Login - Non-module version
(async () => {
  // Wait for db.js to load (non-module)
  const dbUtilsScript = document.querySelector('script[src=\"db.js\"]');
  if (!dbUtilsScript) {
    const script = document.createElement('script');
    script.src = './db.js';
    document.head.appendChild(script);
    await new Promise(r => script.onload = r);
  }

  // Auth check
  const token = localStorage.getItem('adminToken');
  if (token === 'admin_logged_in') {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadData();
  }

  window.handleLogin = () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    if (window.checkAuth(email, pass)) {
      localStorage.setItem('adminToken', 'admin_logged_in');
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'flex';
      loadData();
    } else {
      alert('Wrong! Use: test@test.com / admin123');
    }
  };

  window.handleLogout = () => {
    localStorage.removeItem('adminToken');
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
  };

  window.loadData = () => console.log('Dashboard ready - data loads via polling');
})();

// Simple auth - works without IndexedDB
window.checkAuth = (email, pass) => btoa(email + ':' + pass) === 'dGVzdEB0ZXN0LmNvbTphZG1pbjEyMw=='; // test@test.com:admin123
