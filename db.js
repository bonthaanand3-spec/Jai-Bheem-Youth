// JAI BHEEM YOUTH Local Database Utilities - Phase 2
const DB_NAME = 'JaiBheemYouthDB';
const DB_VERSION = 1;
const STORES = ['samathaData', 'beneficiaryFamilies', 'donors', 'socialLinks'];

let db = null;
let subscribers = {};

export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      createStores();
      seedSampleData();
      resolve(db);
      startPolling();
    };
    
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      createStores();
    };
  });
}

function createStores() {
  STORES.forEach(storeName => {
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      if (storeName === 'socialLinks') {
        store.createIndex('id', 'id', { unique: true });
      }
    }
  });
}

async function seedSampleData() {
  const tx = db.transaction(['socialLinks'], 'readwrite');
  const store = tx.objectStore('socialLinks');
  const countReq = store.count();
  
  countReq.onsuccess = async () => {
    if (countReq.result === 0) {
      // Seed sample social links
      await store.add({ id: 'socialLinks', youtube: 'https://youtube.com/@jai_bheem_youth', instagram: 'https://instagram.com/jai_bheem_youth', facebook: 'https://facebook.com/jai_bheem_youth', whatsapp: 'https://chat.whatsapp.com/example' });
      
      console.log('Sample data seeded');
    }
  };
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export async function add(storeName, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.add(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function update(storeName, id, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put({...data, id});
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function del(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function subscribe(storeName, callback) {
  const key = storeName;
  if (!subscribers[key]) subscribers[key] = [];
  subscribers[key].push(callback);
}

function startPolling() {
  setInterval(async () => {
    for (const [storeName, cbs] of Object.entries(subscribers)) {
      const data = await getAll(storeName);
      cbs.forEach(cb => cb(data));
    }
  }, 500);
}

// Local Auth (simple - use btoa for basic hash)
export function checkAuth(email, password) {
  const hash = btoa(email + ':' + password);
  return hash === 'dGVzdEB0ZXN0LmNvbTphZG1pbjEyMw==' ; // test@test.com:admin123
}

export function setAuthToken(token) {
  localStorage.setItem('adminToken', token);
}

export function getAuthToken() {
  return localStorage.getItem('adminToken');
}

export function logout() {
  localStorage.removeItem('adminToken');
}

// Init on load
initDB().catch(console.error);
