import React, { useRef, useState } from "react";
import Form from 'react-bootstrap/Form'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

const FormularioCarga = () => {
    const form = useRef(null);
    const handleSubmit = async () => {
        const formData = new FormData(form.current);
        const data = {
            id: formData.get(uuidv4()),
            nombre: formData.get('nombre'),
            description: formData.get('description'),
            disponible: formData.get('disponible'),
            imagen: formData.get('imagen'),
            price:formData.get('price')
        }
        const respuesta = await axios.post('http://localhost:4000/API/crear', data)
        console.log(respuesta)
    }
    //ModalStates
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Agregar Producto
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Infomacion de Producto </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form ref={form} >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Producto</Form.Label>
                            <Form.Control name="nombre" type="text" placeholder="Nombre de Prodcuto" required/>
                            <Form.Text className="text-muted">
                                Enter Product Name
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Label>Imagen</Form.Label>
                            <Form.Control name="imagen" type="text" placeholder="Inserte URL de imagen" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Label>Precio</Form.Label>
                            <Form.Control name="price" type="number" placeholder="Precio" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Descripcion del prodcuto</Form.Label>
                            <Form.Control as="textarea" rows={4} name="description" type="text" placeholder="description" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
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

export default FormularioCarga;