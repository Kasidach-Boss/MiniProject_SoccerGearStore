import Head from 'next/head' 
import Layout from '../components/layout' 
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css' 
import YouTube from 'react-youtube-embed'

export default function Home({ token }) {
 
  return (
   <div>
    <Head>
        <title>First Page</title>
    </Head>
    <Navbar />
    
    <div className={styles.container}>
        
        <h1>Home page</h1>
        <div className={styles.video} ><YouTube  id='L8taGwfp2sU' /></div>
        
    </div>
        
            
          
    </div>
       
  
  )
}

export function getServerSideProps({ req, res }) {
  // console.log("token from cookie: ",cookie.get("token")) 
  // console.log('req: ', req.headers)
  return { props: { token: req.cookies.token || "" } };
}