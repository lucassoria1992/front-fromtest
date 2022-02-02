import React from 'react';
import { Card, Button, CardGroup } from 'react-bootstrap';



const ProductItem = ({ item }) => {

    const stock = (item.disponible)

    if (stock === null) {
        return (
            <CardGroup>
                <Card  className='m-2' >
                    <Card.Img variant="top" src="https://picsum.photos/100/80" />
                    <Card.Body>
                        <Card.Title>{item.nombre}</Card.Title>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                        <Button variant="danger" disabled >Agotado</Button>
                    </Card.Body>
                </Card>
            </CardGroup>
        );
    } else {
        return (
            <CardGroup>
                <Card className='m-2'>
                    <Card.Img variant="top" src="https://picsum.photos/100/80" />
                    <Card.Body>
                        <Card.Title>{item.nombre}</Card.Title>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                        <Button variant="primary">Reservalo!</Button>
                    </Card.Body>
                </Card>
            </CardGroup>
        );
    }
}


export default ProductItem; 