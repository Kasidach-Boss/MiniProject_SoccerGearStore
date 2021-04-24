import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Register.module.css'
import Navbar from '../components/navbar'
import axios from 'axios'
import config from '../config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaKey,FaUser} from 'react-icons/fa';
import {MdEmail} from 'react-icons/md';

export default function Register({ token }) {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const profileUser = async () => {
        console.log('token: ', token)
        const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log('user: ', users.data)
    }

    const register = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/register`,
                { username, email, password })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.data.message)
            if(result.data.message === "Register success"){
                toast.success(`Status ${result.status} and ${result.data.message}`,{
                    className:"custom-toast",
                    draggable:true,
                    position:toast.POSITION.BOTTOM_CENTER
                })
            }
            if(result.data.message === "Duplicated user"){
                toast.warning(`${result.data.message}  `,{
                    className:"custom-toast",
                    draggable:true,
                    position:toast.POSITION.BOTTOM_CENTER
                })
            }
           
            
        }
        catch (e) {
            console.log(e)
            toast.error(` username or password or Email is empty!!!!.`,{
                                className:"custom-toast",
                                draggable:true,
                                position:toast.POSITION.BOTTOM_CENTER
                            })
        }

    }

    const registerForm = () => (
         <div >
            
             <div className={styles.inputcontainer}>
                 <FaUser className={styles.icon} />
                 <input className={styles.input} type="text"
                     name="username" 
                     placeholder="username"
                     onChange={(e) => setUsername(e.target.value)}
                 />
             </div>
         
             <div className={styles.inputcontainer}>
                 <MdEmail className={styles.icon} />
                 <input  className={styles.input} type="email"
                     name="email"
                     placeholder="email"
                     onChange={(e) => setEmail(e.target.value)} />
             </div>
           
             <div className={styles.inputcontainer}> 
                 <FaKey className={styles.icon}/>
                 <input className={styles.input} type="password"
                     name="password" 
                     placeholder="password"
                     onChange={(e) => setPassword(e.target.value)} />
             </div>

          </div>

    )


    return (
        <Layout>
            <Head>
                 <title>Register For Admin</title>
             </Head>

             <Navbar />
             <div className={styles.container}>
                 <div className={styles.box}>
                    <center><h1>Register</h1></center>
                
                 <div>
                     {registerForm()}
                     <ToastContainer/>
                 </div>
                 <div className="button-container">
                    <center><button onClick={register} className={styles.buttonregis}>
                         Register</button> <br></br><br></br>
                         <span><b>Please contact to Owner</b></span></center>
                         <br></br>
                 </div> 
                 </div>
               
             </div>
         </Layout>
//     )
// }

    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}