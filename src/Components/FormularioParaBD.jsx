import React, { useRef, useState } from "react";
import Form from 'react-bootstrap/Form'
import { Button, Modal, Nav } from 'react-bootstrap'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import ProductItemsList from "../Conteiners/Productos";

// Formulario original orientado a backend (con axios)
// Renombrado para referencia histórica. No se usa en el flujo demo.
const FormularioParaBD = () => {
    const form = useRef(null);

    const handleSubmit = async () => {
        const formData = new FormData(form.current);
        const data = {
            id: formData.get(uuidv4()),
            nombre: formData.get('nombre'),
            description: formData.get('description'),
            disponible: formData.get('disponible'),
            imagen: formData.get('imagen'),
            price: formData.get('price')
        }
        await axios.post('http://localhost:4000/API/crear', data)
    }
    ProductItemsList();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Nav.Link onClick={handleShow}>
                Agregar Producto
            </Nav.Link>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Infomacion de Producto </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form ref={form} >
                        <Form.Group className="mb-3">
                            <Form.Label>Producto</Form.Label>
                            <Form.Control name="nombre" type="text" placeholder="Nombre de Producto" required />
                            <Form.Text className="text-muted">
                                Enter Product Name
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control name="imagen" type="text" placeholder="Inserte URL de imagen" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control name="price" type="number" placeholder="Precio" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripcion del producto</Form.Label>
                            <Form.Control as="textarea" rows={4} name="description" type="text" placeholder="description" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check name="disponible" type="checkbox" label="En Stock" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={(() => { handleClose(); handleSubmit() })}>
                        Save Product
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FormularioParaBD;
