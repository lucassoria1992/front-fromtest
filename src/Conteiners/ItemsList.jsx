import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import useGetProduct from '../hooks/useGetProduct';
import itemsDatos from '../Components/items_datos'
import { ListGroupItem } from 'react-bootstrap';


const ItemsList = () => {
    const API = 'http://localhost:4000/API/ver'
    const products = useGetProduct(API)
    console.log(products)

    return (
        <ListGroup variant="flush" className='container col-4 mt-5'>
            {products.map(product => (
                <ListGroupItem>
                    <itemsDatos product={product} key={product.id} />
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default ItemsList;