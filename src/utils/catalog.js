// Utilidades de catálogo para modo demo con LocalStorage

const KEY = 'catalog.products';
const ADMIN_KEY = 'admin.user';

export function isAdmin() {
    try { return localStorage.getItem(ADMIN_KEY) === 'admin'; } catch { return false; }
}

export function loginAdmin(pass) {
    try {
        if (pass === 'admin') {
            localStorage.setItem(ADMIN_KEY, 'admin');
            return true;
        }
    } catch { }
    return false;
}

export function logoutAdmin() {
    try { localStorage.removeItem(ADMIN_KEY); } catch { }
}

export function getProductsLS() {
    try {
        const raw = localStorage.getItem(KEY);
        const arr = JSON.parse(raw || '[]');
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

export function setProductsLS(arr) {
    try {
        localStorage.setItem(KEY, JSON.stringify(arr || []));
        window.dispatchEvent(new Event('catalog:updated'));
    } catch { }
}

export async function resetFromJSON() {
    try {
        const res = await fetch('/products.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setProductsLS(list);
        return list;
    } catch (e) {
        console.error('No se pudo resetear catálogo', e);
        return getProductsLS();
    }
}

export async function ensureInitialized() {
    const has = getProductsLS();
    if (has && has.length) return has;
    return await resetFromJSON();
}
