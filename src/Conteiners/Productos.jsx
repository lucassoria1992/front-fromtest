import React from 'react';
import UseGetItems from '../hooks/UseGetItems';
import ProductItem from '../Components/Producto';
import {Row} from 'react-bootstrap';

const ProductItems = () => {
const items = UseGetItems()


    return (
    <div key={items._id}>
        <Row  md={4} className=" container d-flex">
            {items.map(item => (
            <ProductItem key={item._id} item ={item} />)
        )}
        </Row>
    </div>
);
        }

    export default ProductItems; 