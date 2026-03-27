// Simple local auth check
function checkLogin() {
  const authToken = dbUtils.getAuthToken();
  if (dbUtils.checkAuth('test@test.com', 'admin123')) {
    dbUtils.setAuthToken('admin_logged_in');
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadAllData();
  } else {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
  }
}
window.checkLogin = checkLogin;
