import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Container, Button, Badge, Offcanvas, ListGroup, Image, Toast, ToastContainer } from 'react-bootstrap';
import AdminBar from './AdminBar';
import { useCart } from '../context/CartContext.jsx';

const Layout = () => {



    const { items, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart();
    const [showCart, setShowCart] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [lastAdded, setLastAdded] = useState(null);

    const formatPrice = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n || 0);

    // Escuchar eventos globales para mostrar toast al agregar
    useEffect(() => {
        const handler = (e) => {
            setLastAdded(e.detail);
            setShowToast(true);
        };
        window.addEventListener('cart:add', handler);
        return () => window.removeEventListener('cart:add', handler);
    }, []);

    return (
        <Navbar collapseOnSelect expand="lg" variant="dark" style={{ background: '#0b1220' }} >
            <Container>
                <Navbar.Brand href="/" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }} >
                    <i className="fa-solid fa-bag-shopping"></i>
                    Tutti Shop
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className=' justify-content-end'>
                    <Nav className="align-items-center" style={{ gap: 8 }}>
                        <AdminBar />
                        <Button variant="outline-light" onClick={() => setShowCart(true)}>
                            <i className="fa-solid fa-cart-shopping" style={{ marginRight: 6 }}></i>
                            Carrito{' '}
                            <Badge bg="success" pill>{totalItems}</Badge>
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Carrito ({totalItems})</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', paddingBottom: 88 }}>
                    <ListGroup as="div" variant="flush" style={{ flex: 1 }}>
                        {items.length === 0 && (
                            <div style={{ color: '#64748b' }}>Tu carrito está vacío</div>
                        )}
                        {items.map(it => (
                            <ListGroup.Item key={it._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <Image
                                    src={it.imagen}
                                    alt={it.nombre}
                                    onError={(e) => { e.target.src = 'https://placehold.co/64x64'; }}
                                    rounded
                                    width={56}
                                    height={56}
                                    style={{ objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{it.nombre}</div>
                                            <div style={{ fontSize: 12, color: '#64748b' }}>{formatPrice(it.price)}</div>
                                        </div>
                                        <div style={{ minWidth: 90, textAlign: 'right', fontWeight: 600 }}>
                                            {formatPrice((it.price || 0) * (it.quantity || 1))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            style={{ width: 32, height: 32, padding: 0 }}
                                            onClick={() => updateQty(it._id, Math.max(1, (it.quantity || 1) - 1))}
                                            aria-label="Disminuir cantidad"
                                        >
                                            −
                                        </Button>
                                        <span style={{ minWidth: 24, textAlign: 'center' }}>{it.quantity || 1}</span>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            style={{ width: 32, height: 32, padding: 0 }}
                                            onClick={() => updateQty(it._id, (it.quantity || 1) + 1)}
                                            aria-label="Aumentar cantidad"
                                        >
                                            +
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="link"
                                            className="ms-auto text-danger"
                                            onClick={() => removeItem(it._id)}
                                            aria-label="Eliminar del carrito"
                                        >
                                            <i className="fa-regular fa-trash-can"></i>
                                        </Button>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    {/* Total sticky al pie del Offcanvas */}
                    <div className="offcanvas-footer">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ fontWeight: 700 }}>Total</div>
                            <div style={{ fontWeight: 700, color: '#0d6efd' }}>{formatPrice(totalPrice)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button variant="outline-secondary" onClick={clearCart}>
                                <i className="fa-regular fa-trash-can" style={{ marginRight: 6 }}></i>
                                Vaciar
                            </Button>
                            <Button variant="primary" disabled={items.length === 0}>
                                <i className="fa-solid fa-credit-card" style={{ marginRight: 6 }}></i>
                                Continuar compra
                            </Button>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Toast de agregado al carrito */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide>
                    <Toast.Header closeButton={true}>
                        <i className="fa-solid fa-check-circle" style={{ color: '#22c55e', marginRight: 8 }}></i>
                        <strong className="me-auto">Agregado al carrito</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {lastAdded?.nombre || 'Producto agregado'}
                        <div>
                            <Button variant="link" onClick={() => { setShowCart(true); setShowToast(false); }}>Ver carrito</Button>
                        </div>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Navbar>

    );
}

export default Layout