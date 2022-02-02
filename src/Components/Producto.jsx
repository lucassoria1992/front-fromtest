import React from 'react';
import { Card, Button, CardGroup } from 'react-bootstrap';


const ProductItem = ({ item }) => {

    const stock = (item.disponible)
    if (stock === null) {
        return (
            <CardGroup>
                <Card className='m-2'>
                    <Card.Img variant="top" src={item.imagen} />
                    <Card.Body>
                        <Card.Title>{item.nombre}</Card.Title>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <Button variant="primary" className='d-block'>Reservalo!</Button>
                    </Card.Footer>
                </Card>
            </CardGroup>
        );
    } else {
        return (
            <CardGroup>
                <Card className='m-2'>
                    <Card.Img variant="top" src={item.imagen}  />
                    <Card.Body>
                        <Card.Title>{item.nombre}</Card.Title>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                        
                    </Card.Body>
                    <Card.Footer>
                    <Button variant="primary" className='d-block'>Reservalo!</Button>
                    </Card.Footer>
                </Card>
            </CardGroup>
        );
    }
}


export default ProductItem; 