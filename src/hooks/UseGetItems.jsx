import { useEffect, useState } from "react";
import { ensureInitialized, getProductsLS } from "../utils/catalog";
// import axios from "axios";

// Hook: obtiene items desde un JSON local (modo demo)
// Para volver al backend, descomenta axios y cambia la fuente en useEffect.
const UseGetItems = () => {
    // const API = 'http://localhost:4000/API/ver';
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await ensureInitialized();
                // Siempre leer desde LocalStorage para reflejar exactamente lo persistido
                if (mounted) setItems(getProductsLS());
            } catch (err) {
                console.error('Error cargando catálogo demo', err);
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        const onUpd = () => setItems(getProductsLS());
        window.addEventListener('catalog:updated', onUpd);
        return () => { mounted = false; window.removeEventListener('catalog:updated', onUpd); };
        // Modo backend:
        // axios.get(API).then(res => setItems(res.data));
    }, []);

    return { items, loading, error };
}

export default UseGetItems;