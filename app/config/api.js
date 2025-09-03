// ***** เปลี่ยนแค่บรรทัดนี้เวลาไปใช้ LAN อื่น *****
let BASE_URL = "http://192.168.1.195:3000"; // ← เปลี่ยน IP/พอร์ตที่นี่ที่เดียว

let TOKEN = null;

export const getBaseUrl = () => BASE_URL;
export const setBaseUrl = (url) => {
  if (!url) return;
  BASE_URL = url.replace(/\/$/, "");
};

export const setToken = (token) => { TOKEN = token || null; };
export const clearToken = () => { TOKEN = null; };

const joinUrl = (base, path) => base + (path.startsWith("/") ? path : `/${path}`);

export async function apiFetch(path, options = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };

  const url = joinUrl(BASE_URL, path);
  return fetch(url, { ...options, headers });
}

export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}
