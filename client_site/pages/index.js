import Head from 'next/head' 
import Link from 'next/link'
import Layout from '../components/layout' 
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css' 
import { useSpring, animated } from "react-spring";
import React from 'react';
import ReactDom from 'react-dom';
import WordArt from 'react-wordart'
import{GiShoppingCart} from 'react-icons/gi';
import YouTube from 'react-youtube-embed';
import { FacebookProvider, Page ,MessageUs} from 'react-facebook';
import {APPID, PAGEID} from '../components/key/ID';

export default function Home({ token }) {
  
  const [greetingStatus, displayGreeting] = React.useState(false); 
  const [greetingStatus1, displayGreeting1] = React.useState(false); 
  
  const contentProps = useSpring({
        opacity: greetingStatus ? 1 : 0,
        marginTop: greetingStatus ? 0 : -500
  });
  const contentProps1 = useSpring({
    opacity: greetingStatus1 ? 1 : 0,
    marginTop: greetingStatus1 ? 0 : -500
});
    
  return (
   <div>
    <Head>
        <title>Welcome</title>
    </Head>
    <Navbar />
    
    <div className={styles.container}>
    <WordArt text='Welcome to our store' theme={`italicOutline`} fontSize={100} />
    <br></br><br></br>
    <WordArt text='What is position do you play?' theme={`italicOutline`} fontSize={50} />
    <br></br><br></br>  
                <div className={styles.card}>
                  {!greetingStatus ? (
                   <div className="Intro"> <br/><h1>A.This is for another position.</h1></div>
                   
                ) : (
                    <animated.div  style={contentProps}>
                    <h1><center>Hey there ! This is basic skill</center></h1>
                    <center> 
                      
                     <div className={styles.video}><YouTube id='L8taGwfp2sU' ></YouTube></div> 

                        
                    </center>
                    </animated.div>
                )}
                
                </div>
                
                <div >
                    <button onClick={() => displayGreeting(a => !a)} className={styles.button}>
                    Another Position
                    </button>
                </div>
                <div className={styles.card}>
                  {!greetingStatus1 ? (
                   
                   <div className="Intro"> <br/><h1>B.This is for Goalkepper.</h1></div>
               ) : (
                   <animated.div  style={contentProps1}>
                   <h1><center>Hey there ! This is Goalkeeper skill</center></h1>
                   <center> 
                   
                    <div className={styles.video}><YouTube id='7n51nnJPT6w' ></YouTube></div> 
                   </center>
                   </animated.div>
               )}
                </div>
                
                <div >
                    <button onClick={() => displayGreeting1(b => !b)} className={styles.button}>
                    Goalkeeper
                    </button>
                </div>
                <br></br><br></br>
               
          <Link href="/home">
              <button className={styles.buttonbuy}>
                  <p>Click to shop with us! &nbsp;<GiShoppingCart/></p>
              </button>
          </Link>
          
               
          
    </div>
              
            
          
    </div>
       
  
  )
}


export function getServerSideProps({ req, res }) {
  // console.log("token from cookie: ",cookie.get("token")) 
  // console.log('req: ', req.headers)
  return { props: { token: req.cookies.token || "" } };
}