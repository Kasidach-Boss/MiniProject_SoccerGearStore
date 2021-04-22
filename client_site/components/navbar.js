import Link from 'next/link'
import WordArt from 'react-wordart';
import styles from '../styles/nav.module.css'
import {BiLogOut} from 'react-icons/bi';




const Navbar = () => (
       
    <ul className={styles.topnav}>
        <li><a href="/"><WordArt text='Soccer Store' theme={`rainbow`} fontSize={30} /></a></li>
        <li><a href="/home">Customer Side</a></li>
        <li><a href="/register">Register</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/admin">Admin Side</a></li>
        <li className={styles.right}><a href="/logout">Logout &nbsp;<BiLogOut/></a></li>
    </ul>
    
)


export default Navbar