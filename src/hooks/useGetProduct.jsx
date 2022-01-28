import { useEffect, useState } from "react";
import axios from "axios";




const useGetItems = () => {
    const API = 'http://localhost:4000/API/ver'
    const [items, setItems] = useState([])

    useEffect (async () => {
        const response = await axios.get(API)
        console.log(response)
        setItems([response.data])      
    })

};

export default useGetItems;