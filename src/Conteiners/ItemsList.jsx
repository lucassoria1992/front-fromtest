import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const ItemsList = () => {

    return (
        <ListGroup variant="flush" className='container col-4 mt-5'>
            <ListGroup.Item variant="dark"> Items Cargados</ListGroup.Item>
            <ListGroup.Item> ESTE ES UN ITEM</ListGroup.Item>
            <ListGroup.Item> ESTE ES UN ITEM</ListGroup.Item>
        </ListGroup>
    );
}

export default ItemsList;