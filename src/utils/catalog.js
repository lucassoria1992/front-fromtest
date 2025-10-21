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
        const base = (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) ? process.env.PUBLIC_URL : '';
        const res = await fetch(`${base}/products.json`);
        if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            if (list.length) {
                setProductsLS(list);
                return list;
            }
        }
        throw new Error('No se pudo cargar products.json');
    } catch (e) {
        console.warn('Fallo fetch de products.json, usando fallback embebido', e);
        try {
            const fallback = (await import('./products.fallback.json')).default;
            const list = Array.isArray(fallback) ? fallback : [];
            if (list.length) setProductsLS(list);
            return list;
        } catch (err) {
            console.error('No se pudo cargar fallback embebido', err);
            return getProductsLS();
        }
    }
}

export async function ensureInitialized() {
    const has = getProductsLS();
    if (has && has.length) return has;
    return await resetFromJSON();
}
