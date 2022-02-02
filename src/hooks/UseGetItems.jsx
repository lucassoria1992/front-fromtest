import { useEffect, useState } from "react";
import axios from "axios";


const UseGetItems = () => {
    const API = 'http://localhost:4000/API/ver'
    const [items, setItems] = useState([])
    useEffect(() => {
        axios.get(API)
            .then(res => {
                setItems(res.data)
            })
    }, [])
    return (
        items
    );
}

export default UseGetItems;