import Head from 'next/head' 
import Layout from '../components/layout' 
import Navbar from '../components/navbar'
import styles from '../styles/Customer.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'
import useSWR, { mutate } from 'swr';
import { useState } from 'react'
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WordArt from 'react-wordart'

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
        
        console.log(soccer.data);
        let answer = window.confirm("Do you want to buy it?")
        console.log(soccer.data.remark);
        if (answer === true   ) {
          setNumberofproduct(soccer.data)
          toast.success(`Successful Buying ${soccer.data.numberofproduct}`,{
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
                    <div className={styles.productlist} key={index}>
                        
                        <center><div><img src={item.image} alt={item.model} className={styles.img}/></div></center>
                        <div><b>Brand:</b> {item.brand}</div>
                        <div> <b>Model:</b> {item.model} </div>
                        <div><b>Price:</b> {item.price} ฿</div>
                        <div><b>Type:</b> {item.type}</div>
                        <div><b>number of product:</b> {item.numberofproduct}</div>
                        <div><b>Status:</b> {item.remark}</div>
                        <br></br>
                        <div><center>
                        <button onClick={() => getSoccer(item.id)} className={styles.getbutton}>Get</button>
                        <button onClick={()=> buy(item.id)} className={styles.buttonbuy}>Buy</button>
                        </center></div>
                        
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
        <title>Customer Preview</title>
    </Head>
    <Navbar />
    <div className={styles.container}>
        
       
    <WordArt text='Customer Preview' theme={`radial`} fontSize={100} />
        
        <ToastContainer/>
        <div className={styles.select}>
           <h3>Select {soccer.brand}:{soccer.type}:{soccer.model}:{soccer.price} ฿ :{soccer.remark}</h3>
        </div> 
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