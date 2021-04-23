import Head from 'next/head' 
import Layout from '../components/layout' 
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'
import useSWR, { mutate } from 'swr';
import { useState } from 'react'
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URL = `http://localhost/api/soccers`;

const fetcher = url => axios.get(url).then(res=>res.data);

export default function Home({ token }) {
    const {data} = useSWR(URL,fetcher);
    const [soccers, setSoccers] = useState({})
    const [soccer, setSoccer] = useState({})
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('');
    const[type, setType] = useState('')
    const [model, setModel] = useState('');
    const [price, setPrice] = useState(0);
    const [numberofproduct, setNumberofproduct] = useState(0)
    const [remark, setRemark] = useState('');
    

    if(!data){
        console.log(data);
        return <div className={styles.load}><h1>Loading...</h1></div>
    }
    const getSoccer = async(id)=>{
        let result = await axios.get(`${URL}/${id}`);
        setSoccer(result.data);
        console.log(result.data);
        mutate(URL);
        toast.success(`You are choosing ${result.data.brand} ${result.data.model}:${result.data.price}฿:${result.data.remark}`,{
            className:"custom-toast",
            draggable:true,
            position:toast.POSITION.BOTTOM_CENTER
        })
    }

    const getSoccers=async()=>{
        let result = await axios.get(`${URL}`);
        mutate(URL)
    }

    
    const buy = async(id)=>{
        let soccer = await axios.put(`${URL}/buy/${id}`,{numberofproduct})
        let answer = window.confirm("Do you want to buy it?")
        if (answer === true) {
          setNumberofproduct(soccer.data)
          toast.success("Successful Buying",{
              className:"custom-toast",
              draggable:true,
              position:toast.POSITION.BOTTOM_CENTER
          });
          
        }
        
    }

    const printSoccers=()=>{
        if(data.list && data.list.length){
            return data.list.map((item, index)=>{
                return(
                    <div className={styles.listItem} key={index}>
                        
                        <div><img src={item.image} alt={item.model} className={styles.img}/></div>
                        <div><b>Brand:</b> {item.brand}</div>
                        <div> <b>Model:</b> {item.model} </div>
                        <div><b>Price:</b> {item.price} ฿</div>
                        <div><b>Type:</b> {item.type}</div>
                        <div><b>number of product:</b> {item.numberofproduct}</div>
                        <div><b>Status:</b> {item.remark}</div>
                        
                        <div>
                        <button onClick={() => getSoccer(item.id)}>Get</button>
                        <button onClick={()=> buy(item.id)}>Buy</button>
                        </div>
                        <br></br>
                    </div>
                )
            })
        }else {
            return <h3>loading...</h3>
        }
    }

 
  return (
    <Layout>
    <Head>
        <title>First Page</title>
    </Head>
    <Navbar />
    <div className={styles.container}>
        
       
        <h1>Home page</h1>
        
        <ToastContainer/>
        Select {soccer.brand}:{soccer.type}:{soccer.model}:{soccer.price} ฿ :{soccer.remark}
        <div className={styles.list}> 
        
        {printSoccers()}
        </div>
    </div>
</Layout>
  )
}

export function getServerSideProps({ req, res }) {
  // console.log("token from cookie: ",cookie.get("token")) 
  // console.log('req: ', req.headers)
  return { props: { token: req.cookies.token || "" } };
}