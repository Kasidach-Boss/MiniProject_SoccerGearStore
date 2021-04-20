import Link from 'next/link'
import WordArt from 'react-wordart';
import styles from '../styles/nav.module.css'

const Navbar = () => (
    <div className={styles.nav}>
        <h1 className={styles.logo}><WordArt text='Soccer Store' theme={`rainbow`} fontSize={40}></WordArt></h1>
        <Link href="/" className={styles.Link}><a> Home </a></Link> |
        <Link href="/home"><a>show</a></Link>|
        <Link href="/register"><a> Register </a></Link>  |
        <Link href="/login"><a> Login </a></Link> |
        <Link href="/admin"><a>Admin</a></Link>|
        <Link href="/logout">Logout</Link>|
      

        
    </div>
)

export default Navbar