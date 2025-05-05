import { useState, useEffect } from 'react'
import Dashboard from './dashboard/Dashboard';

export default function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/guests');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log('Error:', error)
      }
    };
    fetchData();
  }, []);

  return (
    <Dashboard />
    
    // <>

    //   <h1>Guests</h1>
    //   <div className="card">
    //     {data.map((element, index) => {
    //         // {console.log(element.name)}
    //         return(
    //         <div  key={index}>
    //           <p>ID: #{element.id}<br/>
    //           Name: {element.name}<br/>
    //           Address: {element.address_1}, {element.address_2},{element.city}, {element.postcode}</p>
    //         </div>
    //         ) 
    //     })}
        
    //   </div>
    // </>
  )
}
