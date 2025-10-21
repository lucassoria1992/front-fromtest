import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext.jsx';
import { isAdmin, getProductsLS, setProductsLS } from '../utils/catalog';

const ProductItem = ({ item }) => {
    const { addItem } = useCart();
    const placeholder = 'https://placehold.co/600x400?text=Imagen+no+disponible';
    const available = item?.disponible === true || item?.disponible === 'on';

    const handleImgError = (e) => {
        e.target.onerror = null;
        e.target.src = placeholder;
    };

    const rawPrice = typeof item?.price === 'number' ? item.price : parseFloat(item?.price ?? 0);
    const originalPrice = item?.originalPrice ? parseFloat(item.originalPrice) : null;
    const formatPrice = isNaN(rawPrice)
        ? ''
        : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(rawPrice);
    const formatOriginal = originalPrice && !isNaN(originalPrice)
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(originalPrice)
        : null;
    const discount = originalPrice && originalPrice > rawPrice
        ? Math.round(((originalPrice - rawPrice) / originalPrice) * 100)
        : null;

    // Beneficios típicos e-commerce LATAM
    const cuotas = rawPrice ? Math.ceil(rawPrice / 3) : 0; // 3 cuotas sin interés
    const envioGratis = rawPrice >= 100; // umbral demo

    const [edit, setEdit] = useState(false);
    const [draft, setDraft] = useState({
        nombre: item?.nombre || '',
        imagen: item?.imagen || '',
        price: item?.price || '',
        description: item?.description || '',
        categoria: item?.categoria || '',
        disponible: item?.disponible === true || item?.disponible === 'on'
    });

    const can = isAdmin();

    const save = () => {
        // Validaciones básicas para edición inline
        if (!draft.nombre?.trim()) {
            try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { msg: 'El nombre es obligatorio', bg: 'danger' } })); } catch {}
            return;
        }
        const priceNum = parseFloat(draft.price);
        if (isNaN(priceNum) || priceNum <= 0) {
            try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { msg: 'El precio debe ser mayor a 0', bg: 'danger' } })); } catch {}
            return;
        }
        const list = getProductsLS();
        const idx = list.findIndex(p => p._id === item._id);
        if (idx >= 0) {
            list[idx] = { ...list[idx], ...draft, price: priceNum };
            setProductsLS(list);
            setEdit(false);
            try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { msg: 'Producto actualizado', bg: 'success' } })); } catch {}
        }
    };

    const remove = () => {
        const list = getProductsLS().filter(p => p._id !== item._id);
        setProductsLS(list);
        try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { msg: 'Producto eliminado', bg: 'warning' } })); } catch {}
    };

    return (
        <Card
            className='m-2'
            style={{
                height: '100%',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
        >
            <div style={{ height: 180, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                <Card.Img
                    variant="top"
                    src={item?.imagen}
                    alt={item?.nombre}
                    onError={handleImgError}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {discount ? (
                    <Badge bg="danger" style={{ position: 'absolute', top: 10, left: 10 }}><i className="fa-solid fa-tags" style={{ marginRight: 6 }}></i>{discount}% OFF</Badge>
                ) : null}
                {envioGratis ? (
                    <Badge bg="success" style={{ position: 'absolute', top: 10, right: 10 }}><i className="fa-solid fa-truck" style={{ marginRight: 6 }}></i>Envío gratis</Badge>
                ) : null}
            </div>
            <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    {!edit ? (
                        <Card.Title style={{ marginBottom: 0, fontSize: '1.05rem' }}>{item?.nombre}</Card.Title>
                    ) : (
                        <input className='form-control form-control-sm' value={draft.nombre} onChange={e => setDraft({ ...draft, nombre: e.target.value })} />
                    )}
                    <Badge bg={available ? 'success' : 'secondary'}>
                        {available ? 'En stock' : 'Sin stock'}
                    </Badge>
                </div>
                {!edit ? (
                    <Card.Text style={{ color: '#556', minHeight: 60, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item?.description}
                    </Card.Text>
                ) : (
                    <textarea className='form-control form-control-sm' rows={3} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
                )}
            </Card.Body>
            <Card.Footer
                className="card-footer-responsive"
                style={{
                    background: 'white',
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8
                }}
            >
                <div>
                    {formatOriginal && (
                        <div style={{ fontSize: 12, color: '#98a2b3', textDecoration: 'line-through' }}>{formatOriginal}</div>
                    )}
                    {!edit ? (
                        <div style={{ fontWeight: 700, color: '#0d6efd' }}>{formatPrice}</div>
                    ) : (
                        <input type='number' className='form-control form-control-sm' value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} />
                    )}
                    {cuotas > 0 && !edit && (
                        <div style={{ fontSize: 12, color: '#64748b' }}>3 cuotas sin interés de {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cuotas)}</div>
                    )}
                </div>
                {!can ? (
                    <Button
                        variant="primary"
                        className='d-block w-100 d-sm-inline-block'
                        style={{ minWidth: 140 }}
                        disabled={!available}
                        title={available ? 'Agregar al carrito' : 'Sin stock'}
                        onClick={() => {
                            if (!available) return;
                            addItem(item, 1);
                            try { window.dispatchEvent(new CustomEvent('cart:add', { detail: item })); } catch {}
                        }}
                    >
                        {available ? (<><i className="fa-solid fa-cart-plus" style={{ marginRight: 6 }}></i>Agregar</>) : 'Sin stock'}
                    </Button>
                ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                        {!edit ? (
                            <>
                                <Button variant='outline-secondary' onClick={() => setEdit(true)}><i className='fa-solid fa-pen'></i></Button>
                                <Button variant='outline-danger' onClick={remove}><i className='fa-regular fa-trash-can'></i></Button>
                            </>
                        ) : (
                            <>
                                <Button variant='secondary' onClick={() => setEdit(false)}>Cancelar</Button>
                                <Button variant='primary' onClick={save}>Guardar</Button>
                            </>
                        )}
                    </div>
                )}
            </Card.Footer>
        </Card>
    );
}

export default ProductItem; 