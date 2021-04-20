import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import useSWR, { mutate } from 'swr';
// import styles from '../styles/Student.module.css'
import withAuth from '../components/withAuth'
import config from '../config/config'
import axios from 'axios';
const URL = `http://localhost/api/soccers`
const URLINCOME = `http://localhost/api/income`
const fetcher = url => axios.get(url).then(res => res.data);

const admin = ({ token }) => {
    const {data} = useSWR(URL,fetcher);
    const {incomedata} = useSWR(URLINCOME,fetcher)
    const [soccers, setSoccers] = useState({})
    const [soccer, setSoccer] = useState({})
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState(0);
    const [remark, setRemark] = useState('');
    useEffect(() => {
        getSoccers();
        profileUser();
      }, []);
      const profileUser = async () => {
          try {
            
            const users = await axios.get(`${config.URL}/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
           
            setUser(users.data);
          } catch (e) {
            console.log(e);
          }
        };

    if(!data || !incomedata){
        console.log(data);
        return <div><h1>Loading...</h1></div>
    }
    const getSoccer = async(id)=>{
        let result = await axios.get(`${URL}/${id}`);
        setSoccer(result.data);
        mutate(URL);
    }
    const addSoccer = async (image,brand,model,type,price,remark) => {
        let student = await axios.post(URL, { image,brand,model,type,price,remark })
        console.log(student.data);
        getSoccers();
       
    }

    const getSoccers=async()=>{
        let result = await axios.get(`${URL}`);
        setSoccers(soccers.data)
        mutate(URL)
    }
    const Buy = async(id,price) =>{
        let result = await axios.get(`${URL}/${id}`,{price});
        let income = await axios.put(`${URLINCOME}`);
        income.data += result.data;
        mutate(URLINCOME)
        mutate(URL)
    }
    const getIncome = async() =>{
        let result = await axios.get(`${URLINCOME}`)
    }
    const updateSoccer = async (id) => {
        let soccer = await axios.put(`${URL}/${id}`, { image,brand,model,type,price,remark })
        setSoccers(soccer.data)
        getSoccers();
      }
    
    const deleteSoccer = async (id) => {
        let soccer = await axios.delete(`${URL}/${id}`, { image,brand,model,type,price,remark })
        getSoccers();
    }

    const printSoccers = () =>{
        if (soccers.list && soccers.list.length) {
            return soccers.list.map((item, index)=>{
                return(
                    <div className={styles.listItem} key={index}>
                    {index+1}
                  <b> Name:</b> {item.name} <br />
                  <b>Major:</b> {item.major} <br />
                  <b>GPA:</b> {item.gpa}
                  <div >
                    <button onClick={() => getSoccer(item.id)} >
                      Get
                    </button>
                    <button onClick={() => updateSoccer(item.id)} >
                      Update
                    </button>
                    <button onClick={() => deleteSoccer(item.id)}>
                      Delete
                    </button>
                    <buttonon Click={() => Buy(item.id,item.price)}>Buy</button>
                  </div>
                  <br></br>
                </div>  
                )
            })
        }
    }
    return(

    )
    
};

      
    
export default withAuth(admin)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}