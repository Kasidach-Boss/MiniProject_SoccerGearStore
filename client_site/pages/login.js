import Head from 'next/head'
import Layout from '../components/layout'
import Link from 'next/link';
import { useState } from 'react'
import Navbar from '../components/navbar'
import styles from '../styles/Login.module.css'
import axios from 'axios'
import config from '../config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactDom from 'react-dom';
import React from 'react';
import { useSpring, animated } from "react-spring";
import {FaKey,FaUser} from 'react-icons/fa';
export default function Login({ token }) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const[remember, setRemember] = useState(false)
    const [greetingStatus, displayGreeting] = React.useState(false); 
    const contentProps = useSpring({
        opacity: greetingStatus ? 1 : 0,
        marginTop: greetingStatus ? 0 : -500
      });

    const login = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/login`,
                { username, password, remember },
                { withCredentials: true })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.status + ': ' + result.data.user.username)
            toast.success(`Login Successful  Hello,${result.data.user.username} Status is${result.status}  `,{
                className:"custom-toast",
                draggable:true,
                position:toast.POSITION.BOTTOM_CENTER
            })
            
            
              
            
        }
        catch (e) {
            console.log('error: ', JSON.stringify(e.response))
            setStatus(JSON.stringify(e.response).substring(0, 80) + "...")
            toast.error(`Incorrect username or password.`,{
                className:"custom-toast",
                draggable:true,
                position:toast.POSITION.BOTTOM_CENTER
            })
        }
        
    }

    const loginForm = () => (
        
       <div >
        
             <h3><center>Hello {username}</center></h3>
             <div className={styles.imgcontainer}>
                 <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Avatar" className={styles.avatar}/>
             </div> 
             <div className={styles.inputcontainer}>
                <FaUser className={styles.icon} />
                
                <input type="text"
                    name="username"
                    placeholder="username" className={styles.input}
                    onChange={(e) => setUsername(e.target.value)}
                /><br/> 
             </div>
            
             <div className={styles.inputcontainer}>
            
                <FaKey className={styles.icon}/>
            
           
                <input type="password"
                    name="password" className={styles.input}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} /><br/>
            </div>
            
        <label className={styles.check}>    
        <input
          id="remember" 
          name="remember"
          type="checkbox"
          onClick={rememberStatus}
        />
       Remember Me</label>
       
      
      <ToastContainer/>
      
    </div>
    
       
       
        
    )
    const rememberStatus = async () =>{
        setRemember(true)
    }
   

    

    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>
           <Navbar /> 
           
            <div className={styles.container}>
               
                <div className={styles.card}>
                   <h1>Login</h1>
                <div className="button-container">
                    <button onClick={() => displayGreeting(a => !a)} className={styles.clbtn}>
                   Click to Login
                    </button>
                </div> 
                </div>
                
                {!greetingStatus ? (
                   
                    <div className="Intro"> <br/><h3 className={styles.introfont}>Click button below for login</h3></div>
                ) : (
                    <animated.div className={styles.box} style={contentProps}>
                    <center><h1>Hey there ! This is login page.</h1></center>
                    <center>{loginForm()} 
                        <div>
                            
                            <Link href="/register">
                                <button className={styles.buttonregis}>
                                    Register
                                </button>
                            </Link>
                            <button onClick={login} className={styles.button} >Login</button>
                        </div>
                    </center>
                    <br></br><br></br>
                    </animated.div>
                    
                )}
               
                
                
                
            </div>
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
