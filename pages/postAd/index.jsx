import React,{useState} from 'react'
import { getSession } from 'next-auth/react';
import Head from 'next/head';

import Category from '../../components/Category';
import ProductForm from '../../components/ProductForm';

import classes from "../../styles/postAd.module.css"

export default function PostAd() {

  const [state,setState] = useState({
    fill: false,
    cat: "Something"
  });

  return (
    <>
      <Head>
        <title>Post Your Ad</title>
      </Head>
      <div className = {classes.div}>
        <h1>Post your ad</h1>
        {!state.fill && <Category currCat = {state.cat} next = {setState}/>}
        {state.fill && <ProductForm currCat = {state.cat} back = {setState}/>}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if(!session){
    return {
      redirect: {
        destination: '/#login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session:session
    }
  }
}