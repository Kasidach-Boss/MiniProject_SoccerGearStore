import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import config from '../config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WordArt from 'react-wordart';

export default function Logout({ token }) {

    const [status, setStatus] = useState('')

    useEffect(() => {
        logout()
    }, [])

    const logout = async () => {
        console.log('remove token: ', token)
        let result = await axios.get(`${config.URL}/logout`, { withCredentials: true })
        setStatus("Logout successful")
        console.log("result: ",result);
        toast.success(`${result.data.message}`, {
            className:"custom-toast",
            draggable:true,
            position:toast.POSITION.BOTTOM_CENTER
        })

    }
 
    return (
        <div>
           <Head>
                <title>Logout</title>
            </Head>
            <Navbar />
            <div className={styles.container}>
            <WordArt text='Logout' theme={`italicOutline`} fontSize={100} />  
                <div>
                    <br></br>
                    <h1> {status}  </h1>
                </div>
                <ToastContainer/>
            </div> 
        </div>
            
        
    )
}
