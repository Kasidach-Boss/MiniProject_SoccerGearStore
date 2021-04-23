import Head from 'next/head'
import Layout from '../components/layout'
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
        
       
        <div className={styles.gridContainer}>
             <center>Hello {username}</center>
                Username:
            
            
                <input type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                /><br/>
            
            
                Password:
            
           
                <input type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} /><br/>
            
            
            
        <input
          id="remember"
          name="remember"
          type="checkbox"
          onClick={rememberStatus}
        />
       
       
      <label>Remember Me</label>
      <ToastContainer/>
      
    </div>
    
       
       
        
    )
    const rememberStatus = async () =>{
        setRemember(true)
    }
   

    const copyText = () => {
        navigator.clipboard.writeText(token)
    }

    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>
           <Navbar />
            <div className={styles.container}>
            
                <h1>Login</h1>
                {/* <div><b>Token:</b> {token.substring(0, 15)}...
                <button onClick={copyText}> Copy token </button>
                </div>
                <br/>
                <div>
                    Status:  {status}
                </div> */}
                <div className="button-container">
                    <button onClick={() => displayGreeting(a => !a)} className="button">
                    Login
                    </button>
                </div>
                {!greetingStatus ? (
                   
                    <div className="Intro"> <br/>Click button below for login</div>
                ) : (
                    <animated.div className="box" style={contentProps}>
                    <h1>Hey there ! This is login page. Good luck for shopping.</h1>
                    <center>{loginForm()} 
                        <div>
                            <button onClick={login}>Login</button>
                        </div>
                    </center>
                    </animated.div>
                )}
               
                
                
                
            </div>
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
