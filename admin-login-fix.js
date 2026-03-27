// Fixed Admin Login Functions - Standalone
document.addEventListener('DOMContentLoaded', async () => {
  const dbUtils = await import('./db.js');
  await dbUtils.initDB();

  const loginBtn = document.querySelector('#loginSection .btn');
  loginBtn.onclick = async () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    if (dbUtils.checkAuth(email, pass)) {
      dbUtils.setAuthToken('admin_logged_in');
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'flex';
      loadAdminData();
    } else {
      alert('Invalid credentials. Use: test@test.com / admin123');
    }
  };
});

function loadAdminData() {
  // Data tables will auto-load via db.js polling
  console.log('Admin dashboard loaded');
}
