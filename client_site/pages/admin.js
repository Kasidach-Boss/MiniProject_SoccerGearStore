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
import {HiPhotograph,HiTemplate} from 'react-icons/hi';
import {BiMoney} from 'react-icons/bi';
import {GrObjectGroup,GrStatusUnknown} from 'react-icons/gr';
import {AiOutlineFieldNumber} from 'react-icons/ai';
import {SiBrandfolder} from 'react-icons/si';
import WordArt from 'react-wordart'


const URL = `http://localhost/api/soccers`

const fetcher = url => axios.get(url).then(res => res.data);

const admin = ({ token }) => {
  const {data} = useSWR(URL,fetcher);
  const [soccers, setSoccers] = useState({})
  const [soccer, setSoccer] = useState({})
  const [image, setImage] = useState('https://cdn.pixabay.com/photo/2017/01/25/17/33/camera-2008479_960_720.png')
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('')
  const [model, setModel] = useState('empty');
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
      let result = await axios.put(`${URL}/${id}`, { image,brand,model,type,price,remark,numberofproduct })
      setSoccers(soccer.data)
      toast.success(`Update ${result.data.brand} ${result.data.model}:${result.data.price}฿:${result.data.remark} Success`,{
        className:"custom-toast",
        draggable:true,
        position:toast.POSITION.BOTTOM_CENTER
    })
      mutate(URL)
    }
  }

  const deleteSoccer = async (id) => {
    let answer = window.confirm("Do you want to delete it?")
    if (answer === true) {
      let result = await axios.delete(`${URL}/${id}`, { image,brand,model,type,price,remark,numberofproduct })
      setSoccers(soccer.data)
      toast.success(`Delete Success`,{
        className:"custom-toast",
        draggable:true,
        position:toast.POSITION.BOTTOM_CENTER
    })
      mutate(URL)
    }
  }

  
  

  // const printSoccers=()=>{
  //     if(data.list && data.list.length){
  //       if(data.list && data.list.length){
  //         return(
  //         <div>
  //             <center><div className={styles.inputcontainer}>
  //                 <input type="text" placeholder="Search...."onChange={(e)=>{
  //                 setSearch(e.target.value)
  //             }} className={styles.input} />
  //             </div></center>
  //            < div className={styles.list}>
              
  //             {data.list.filter((item)=>{
  //             if (search =="") {
  //                 return (<div className={styles.list}>{item}</div>);
  //             }else if (item.brand.toLowerCase().includes(search.toLowerCase())){
  //                 return item.brand;
  //             }else if (item.model.toLowerCase().includes(search.toLowerCase())){
  //                 return item.model;
  //             }else if (item.type.toLowerCase().includes(search.toLowerCase())){
  //                 return item.type;
  //             }
  //             else if (item.remark.toLowerCase().includes(search.toLowerCase())){
  //                 return item.type;
  //             }
              
  //             }).map((item, index)=>{
  //             return(
  //                 <div className={styles.productlist} key={index}>
                    
  //                    <center><img src={item.image} alt={item.model} className={styles.img}/><br/></center> 
  //                     <b>Brand:</b>{item.brand}<br/>
  //                     <b>Model:</b> {item.model}<br/>
  //                     <b>Type:</b> {item.type}<br/>
  //                     <b>Price:</b> {item.price} ฿<br/>
  //                     <b>Number of product:</b> {item.numberofproduct} pieces<br/>
  //                     <b>Status:</b> {item.remark}<br/>
                      
  //                     <br/>
  //                     <button onClick={() => getSoccer(item.id)} className={styles.getbutton}>Get</button>
  //                     <button onClick={() => updateSoccer(item.id)} className={styles.updatebutton}>Update</button>
  //                     <button onClick={() => deleteSoccer(item.id)} className={styles.deletebutton}>Delete</button>
                      
                      
                      
                      
  //                     <br></br>
  //                 </div>
  //               })}
  //             )
  //         })
  //     }else {
  //         return <h3>loading...</h3>
  //     }
  // }

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
                    return item.remark;
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
                            <button onClick={() => updateSoccer(item.id)} className={styles.updatebutton}>Update</button>
                            <button onClick={() => deleteSoccer(item.id)} className={styles.deletebutton}>Delete</button>
                            
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
          <title>Manage Your Product</title>
      </Head>
      <Navbar />
      <div className={styles.container}>
          <br></br>
          <div className={styles.box}>
          <center><h1>You can input in this form for Update or add item</h1></center>
          <div className={styles.inputcontainer}>
            <HiPhotograph className={styles.icon}/>
            <input type="text" onChange={(e) => setImage(e.target.value)} 
            placeholder="Path or link image address" className={styles.input}>
            </input>
          </div>
            <div className={styles.inputcontainer}> 
              <SiBrandfolder className={styles.icon}/>
              <input type="text" onChange={(e) => setBrand(e.target.value)} 
               placeholder="Brand" className={styles.input}>
              </input>
            </div>
            <div className={styles.inputcontainer}>
              <HiTemplate className={styles.icon}/>
              <input type="text" onChange={(e) => setModel(e.target.value)}  
              placeholder="Model"className={styles.input}></input>
              </div>
           <div className={styles.inputcontainer}>
             <GrObjectGroup className={styles.icon}/>
             <input type="text" onChange={(e) => setType(e.target.value)} placeholder="Type" className={styles.input}></input>
            </div>
            <div className={styles.inputcontainer}> 
              <BiMoney className={styles.icon}/>
              <input type="number" onChange={(e) => setPrice(e.target.value)} placeholder="Pirce" className={styles.input}></input>
            </div>
            <div className={styles.inputcontainer}>
              <AiOutlineFieldNumber className={styles.icon}/>
              <input type="number" onChange={(e) => setNumberofproduct(e.target.value)} placeholder="number of product"className={styles.input}></input>
            </div>
            <div className={styles.inputcontainer}>
            <GrStatusUnknown className={styles.icon}/>
            <input type="text" onChange={(e) => setRemark(e.target.value)} placeholder="Status" className={styles.input}></input>
            </div>
            <br></br>
            <center><button  onClick={() => addSoccer(image,brand,model,type,price,remark,numberofproduct)} className={styles.button}>Add a Product</button></center>
          </div>
         <div className={styles.select}>
           <h3>Select {soccer.brand}:{soccer.type}:{soccer.model}:{soccer.price} ฿ :{soccer.remark}</h3>
           </div> 
          <div className={styles.list}>
             {printSoccers()} 
          </div>
          <ToastContainer/>
            
      </div>      
                                
          
          
      
    </Layout>
    )
}




      
    
export default withAuth(admin)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}