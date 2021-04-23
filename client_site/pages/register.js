
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
import {MdEmail} from 'react-icon/Md';

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
            toast.success(`Login Successful  Hello,${result.data.user.username} Status is${result.status}  `,{
                className:"custom-toast",
                draggable:true,
                position:toast.POSITION.BOTTOM_CENTER
            })
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
                <input type="text"
                    name="username" className={styles.input}
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
           
            <div className={styles.inputcontainer}>
                <MdEmail className={styles.icon} />
                <input type="email"
                    name="email" className={styles.input}
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
           
            <div className={styles.inputcontainer}> 
                <FaKey className={styles.icon}/>
                <input type="password"
                    name="password" className={styles.input}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>

        </div>
    )


    return (
        <Layout>
            <Head>
                <title>Register</title>
            </Head>

            <Navbar />
            <div className={styles.container}>
                <div className={styles.box}>
                   <h1>Register</h1>
                <div><b>Token:</b> {token.substring(0, 15)}...
                <button
                        onClick={() => { navigator.clipboard.writeText(token) }}>
                        Copy token
                </button>
                </div>
                <br />
            Status:  {status}
                <br /><br />
                <div>
                    {registerForm()}
                    <ToastContainer/>
                </div>

                <div className="button-container">
                    <button onClick={register} className={styles.buttonregis}>
                        Register</button>
                </div> 
                </div>
                
            </div>
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
