import Head from 'next/head'
import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import styles from '../styles/Admin.module.css'
import useSWR, { mutate } from 'swr';
import withAuth from '../components/withAuth'
import config from '../config/config'
import axios from 'axios';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const URL = `http://localhost/api/soccers`

const fetcher = url => axios.get(url).then(res => res.data);

const admin = ({ token }) => {
  const {data} = useSWR(URL,fetcher);
  const [soccers, setSoccers] = useState({})
  const [soccer, setSoccer] = useState({})
  const [image, setImage] = useState('./api/emptyphoto.png')
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('')
  const [model, setModel] = useState('empty');
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
  const addSoccer = async (image,brand,model,type,price,remark,numberofproduct) => {
    let soccer = await axios.post(URL, { image,brand,model,type,price,remark,numberofproduct })
    console.log(soccer.data);
    getSoccers();
   
  }
  const updateSoccer = async (id) => {
    let answer = window.confirm("Do you want to update it?")
    if (answer === true) {
      let soccer = await axios.put(`${URL}/${id}`, { image,brand,model,type,price,remark,numberofproduct })
      setStudents(soccer.data)
      mutate(URL)
    }
  }

  const deleteSoccer = async (id) => {
    let answer = window.confirm("Do you want to delete it?")
    if (answer === true) {
      let soccer = await axios.delete(`${URL}/${id}`, { image,brand,model,type,price,remark,numberofproduct })
      mutate(URL)
    }
  }

  // const buy = async(id)=>{
  //   let soccer = await axios.put(`${URL}/buy/${id}`,{numberofproduct})
  //   let answer = window.confirm("Do you want to buy it?")
  //   if (answer === true) {
  //     setNumberofproduct(soccer.data)
  //   }
    
  // }
  

  const printSoccers=()=>{
      if(data.list && data.list.length){
          return data.list.map((item, index)=>{
              return(
                  <div className={styles.productlist} key={index}>
                    
                      <img src={item.image} alt={item.model} className={styles.img}/><br/>
                      <b>Brand:</b> {item.brand}<br/>
                      <b>Model:</b> {item.model}<br/>
                      <b>Type:</b> {item.type}<br/>
                      <b>Price:</b> {item.price} ฿<br/>
                      <b>Number of product:</b> {item.numberofproduct} pieces<br/>
                      <b>Status:</b> {item.remark}<br/>
                      
                      <br/>
                      <button onClick={() => getSoccer(item.id)}>Get</button>
                      <button onClick={() => updateSoccer(item.id)}>Update</button>
                      <button onClick={() => deleteSoccer(item.id)}>Delete</button>
                      
                      
                      
                      
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
            Image Path or Link Image address:<input type="text" onChange={(e) => setImage(e.target.value)}></input>
            Brand:<input type="text" onChange={(e) => setBrand(e.target.value)}></input>
            Model:<input type="text" onChange={(e) => setModel(e.target.value)}></input>
            Type:<input type="text" onChange={(e) => setType(e.target.value)}></input>
            Price:<input type="number" onChange={(e) => setPrice(e.target.value)}></input>
            Number of product:<input type="number" onChange={(e) => setNumberofproduct(e.target.value)}></input>
            Status:<input type="text" onChange={(e) => setRemark(e.target.value)}></input>
            <br></br>
            <button  onClick={() => addSoccer(image,brand,model,type,price,remark,numberofproduct)}>Add a Product</button>
            <div className={styles.list}>
             {printSoccers()} 
            </div>
            
      </div>      
                                
          
          
      
    </Layout>
    )
}




      
    
export default withAuth(admin)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}