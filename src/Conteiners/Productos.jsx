import React, { useState } from 'react';
import UseGetItems from '../hooks/UseGetItems';
import ProductItem from '../Components/Producto';
import { Container, Row } from 'react-bootstrap';

const ProductItemsList = () => {

    const [List, setList] = useState([]);
    const items = UseGetItems();

    return (
        <Container>
            <div key={items._id}>
                <Row md={4} className=" container d-flex">
                    {items.map(item => (
                        <ProductItem key={item._id} item={item} />
                    )
                    )
                    }
                </Row>
            </div>
        </Container>
    );
}

export default ProductItemsList;