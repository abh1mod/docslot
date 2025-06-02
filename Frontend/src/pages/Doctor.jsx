import { useEffect, useState } from "react";
import DocCard from "./DocCard";
import Loading from "./Loading";

const Doctor=()=>{

     const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fetch_all');
        const result = await response.json();

        if (result.data.length>0) {
          setDoctors(result.data);
        } else {
          console.error('Error fetching doctors:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
      fetchDoctors();
  
  }, []);
    // const[User,setUser]=useState([])
    // const data=[{"name":"himanshu","specialization":"brainlogist","phone":"988766554","email":"hsisodia988766@dyuvas","room_no":"12","id":10,"doc_id":"doc_10"},
    //     {"name":"pranjula","specialization":"brainlogsafast","phone":"988766564","email":"jdsgyjsdf","room_no":"12","id":11,"doc_id":"doc_11"}
    // ]

//     useEffect(()=>{
//         fetchdata();
//     },[])
//    async function fetchdata(){
//         try{
//         const res=await fetch(`http://localhost:3000/api/fetch_all`)
//         const data=await res.json();
//         if(data.data.length>0){
//         setUser(data);
//         }
//         }
//         catch(error){
//             console.log("Fetch nahi ho rha")
//         }
    //     try {
    //     const res = await fetch(`http://localhost:3000/api/fetch_all`);
    //     const data = await res.json();

    //     // Check if data is an array
    //     if (Array.isArray(data)) {
    //       setUser(data);
    //     } else if (data && data.User && Array.isArray(data.User)) {
    //       // If your API response is { users: [...] }
    //       setUser(data.User);
    //     } else {
    //       console.log("Unexpected data format:", data);
    //       setUser([]); // fallback to empty array
    //     }
    //   } catch (error) {
    //     console.log("Fetch nahi ho raha:", error);
    //     setUser([]); // fallback to empty array
    //   }
        
    // console.log(User)
    // }
    // fetchdata();
  
    return<>
      <ul className="p-4 space-y-4">
       {/* <DocCard events={data} /> */}
  {loading ? (
    <Loading/>
  ):(
    doctors.map((event, index) => (
      <li key={index}>
        <DocCard events={event} />
      </li>
    ))
  )}
</ul>
    </>
    
}

export default Doctor;