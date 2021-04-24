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
import { FacebookProvider, Page ,MessageUs} from 'react-facebook';
import {APPID, PAGEID} from '../components/key/ID';


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
    const [search , setSearch] = useState('');

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

   const printSoccers =()=>{
        if(data.list && data.list.length){
            return(
            <div>
                <center><div className={styles.inputcontainer}>
                    <input type="text" placeholder="Search...."onChange={(e)=>{
                    setSearch(e.target.value)
                }} className={styles.input} />
                </div></center>
               < div className={styles.list}>
                
                {data.list.filter((item)=>{
                if (search =="") {
                    return (<div className={styles.list}>{item}</div>);
                }else if (item.brand.toLowerCase().includes(search.toLowerCase())){
                    return item.brand;
                }else if (item.model.toLowerCase().includes(search.toLowerCase())){
                    return item.model;
                }else if (item.type.toLowerCase().includes(search.toLowerCase())){
                    return item.type;
                }
                else if (item.remark.toLowerCase().includes(search.toLowerCase())){
                    return item.type;
                }
                
                }).map((item,index)=>{
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
                })}
                </ div>
               </div>
            )
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
     <div id="fb-root"></div>
    <script async defer crossorigin="anonymous" 
    src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0&appId=531411274164289&autoLogAppEvents=1" 
    nonce="8FfoYU1x">   
    </script>   
    <WordArt text='Customer Preview' theme={`radial`} fontSize={100} />
    <div class="fb-page" data-href="https://www.facebook.com/soccermcn12345/" data-tabs="send Message" data-width="" data-height="" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/soccermcn12345/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/soccermcn12345/">Soccer Gear Store</a></blockquote></div>
    <br></br>
    <FacebookProvider appId={APPID}>
        <MessageUs messengerAppId={APPID} pageId={PAGEID} size="large" />
    </FacebookProvider>   
        <ToastContainer/>
        <div className={styles.select}>
           <h3>Select {soccer.brand}:{soccer.type}:{soccer.model}:{soccer.price} ฿ :{soccer.remark}</h3>
        </div> 
        
        
        {printSoccers()}
        
          
        
        
       
        
    </div>
</Layout>
  )
}

export function getServerSideProps({ req, res }) {
  // console.log("token from cookie: ",cookie.get("token")) 
  // console.log('req: ', req.headers)
  return { props: { token: req.cookies.token || "" } };
}