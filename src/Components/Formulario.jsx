import React, { useRef } from "react";
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import itemsDatos from "./items_datos";


const FormularioCarga = () => {
    const form = useRef(null);
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(form.current);
        const data = {
            nombre: formData.get('nombre'),
            description: formData.get('description'),
            disponible: formData.get('disponible'),
        }
        const respuesta = await axios.post('http://localhost:4000/API/crear', data)
        console.log(respuesta)
        itemsDatos(data)
    }
    return (
        <>
            <Form className="container col-4" ref={form} >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter Name</Form.Label>
                    <Form.Control name="nombre" type="text" placeholder="ingrese Nombre" />
                    <Form.Text className="text-muted">
                        Enter Name
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Description</Form.Label>
                    <Form.Control name="description" type="text" placeholder="description" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check name="disponible" type="checkbox" label="En Stock" />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit} >
                    Submit
                </Button>
            </Form>
        </>
    );
}

export default FormularioCarga;