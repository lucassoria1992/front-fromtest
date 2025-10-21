import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Form, InputGroup, Modal, Dropdown, ToastContainer, Toast } from 'react-bootstrap';
import { isAdmin, loginAdmin, logoutAdmin, getProductsLS, setProductsLS, resetFromJSON } from '../utils/catalog';

const uid = () => Math.random().toString(36).slice(2, 9);

export default function AdminBar() {
  const [logged, setLogged] = useState(isAdmin());
  const [show, setShow] = useState(false); // modal "Nuevo"
  const [pwd, setPwd] = useState('');
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState({ nombre: '', imagen: '', price: '', description: '', disponible: true, categoria: '' });
  const [toast, setToast] = useState({ show: false, msg: '', bg: 'success' });

  // Categorías calculadas en cada render (lista pequeña, costo bajo) para evitar warnings de deps
  const categories = (() => {
    const list = getProductsLS();
    const set = new Set(list.map(p => (p?.categoria || '').toString().trim().toLowerCase()).filter(Boolean));
    return Array.from(set).sort();
  })();

  const can = logged;
  const open = () => setShow(true);
  const close = () => setShow(false);

  const doLogin = () => {
    if (loginAdmin(pwd)) {
      try { localStorage.setItem('admin.email', email || ''); } catch {}
      setLogged(true); setPwd('');
      window.location.reload();
    }
  };
  const doLogout = () => {
    logoutAdmin();
    try { localStorage.removeItem('admin.email'); } catch {}
    setLogged(false);
    window.location.reload();
  };

  const addProduct = () => {
    // Validaciones básicas
    if (!draft.nombre?.trim()) return setToast({ show: true, msg: 'El nombre es obligatorio', bg: 'danger' });
    if (!draft.imagen?.trim()) return setToast({ show: true, msg: 'La URL de imagen es obligatoria', bg: 'danger' });
    const priceNum = parseFloat(draft.price);
    if (isNaN(priceNum) || priceNum <= 0) return setToast({ show: true, msg: 'El precio debe ser mayor a 0', bg: 'danger' });

    const list = getProductsLS();
    const p = { _id: uid(), ...draft, price: priceNum };
    setProductsLS([p, ...list]);
    setDraft({ nombre: '', imagen: '', price: '', description: '', disponible: true, categoria: '' });
    close();
    setToast({ show: true, msg: 'Producto guardado', bg: 'success' });
  };

  // Escucha toasts globales (p.ej., desde ediciones/eliminaciones en tarjetas)
  useEffect(() => {
    const onToast = (e) => {
      const { msg, bg } = e.detail || {};
      if (msg) setToast({ show: true, msg, bg: bg || 'success' });
    };
    window.addEventListener('admin:toast', onToast);
    return () => window.removeEventListener('admin:toast', onToast);
  }, []);

  const clearAll = async () => {
    await resetFromJSON();
    setToast({ show: true, msg: 'Catálogo restaurado', bg: 'success' });
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Dropdown align="end" autoClose="outside">
        <Dropdown.Toggle id="admin-menu" variant="outline-light">
          Probar modo admin
        </Dropdown.Toggle>
        <Dropdown.Menu className="p-3" style={{ minWidth: 280 }}>
          {!can ? (
            <>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Ingresar como admin</div>
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">Email (opcional)</Form.Label>
                <Form.Control
                  id="inline_admin_email"
                  name="inline_admin_email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <InputGroup className="mb-2">
                <Form.Control type="password" placeholder="Clave: admin" value={pwd} onChange={e => setPwd(e.target.value)} />
                <Button variant="primary" onClick={doLogin}>Entrar</Button>
              </InputGroup>
              <div className="text-muted" style={{ fontSize: 12 }}>Solo para demo. Persiste en tu navegador.</div>
            </>
          ) : (
            <>
              <div className="mb-2" style={{ fontWeight: 600 }}>Modo admin activo</div>
              <ButtonGroup vertical className="w-100">
                <Button variant="outline-primary" className="text-start" onClick={open}>
                  <i className="fa-solid fa-plus me-2"></i>Nuevo producto
                </Button>
                <Button variant="outline-secondary" className="text-start" onClick={clearAll}>
                  <i className="fa-solid fa-rotate me-2"></i>Resetear catálogo
                </Button>
                <Button variant="outline-danger" className="text-start" onClick={doLogout}>
                  <i className="fa-solid fa-right-from-bracket me-2"></i>Salir (cerrar admin)
                </Button>
              </ButtonGroup>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control placeholder="Nombre de Producto" value={draft.nombre} onChange={e => setDraft({ ...draft, nombre: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control placeholder="Inserte URL de imagen" value={draft.imagen} onChange={e => setDraft({ ...draft, imagen: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" placeholder="Precio" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              {categories.length > 0 ? (
                <Form.Select value={draft.categoria} onChange={e => setDraft({ ...draft, categoria: e.target.value })}>
                  <option value="">Seleccioná categoría…</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__new__">Otra...</option>
                </Form.Select>
              ) : null}
              {(!categories.length || draft.categoria === '__new__') && (
                <Form.Control className="mt-2" placeholder="Nueva categoría (ej.: electronica)" onChange={e => setDraft({ ...draft, categoria: e.target.value })} />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="switch" id="disp" label="Disponible" checked={draft.disponible} onChange={e => setDraft({ ...draft, disponible: e.target.checked })} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="description" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="primary" onClick={addProduct}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg={toast.bg} onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={2000} autohide>
          <Toast.Body className="text-white">{toast.msg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
