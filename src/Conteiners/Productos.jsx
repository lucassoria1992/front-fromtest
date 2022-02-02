import React from 'react';
import UseGetItems from '../hooks/UseGetItems';
import ProductItem from '../Components/Producto';

const ProductItems = () => {
const items = UseGetItems()


    return (

    <div key={items._id} className='col-3 d-flex flex-wrap justify-content-center Align content-stretch'>
        {items.map(item => (
            <ProductItem key={item._id} item ={item} />)
        )}
    </div>
);
        }

    export default ProductItems; 