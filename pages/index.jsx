import { useRouter } from "next/router";
import Head from "next/head";
import { useSession, getSession } from "next-auth/react";
import { MongoClient } from "mongodb";
import { useEffect ,useState} from "react";
import { FooterHead } from "../components/Footer";
// import BackToTop from "react-back-to-top-button";

import Navbar from "../components/Navbar"
import Banner from "../components/Banner"
import Login from "../components/Login";
import Register from "../components/Register";
import Hero from "../components/Hero";
import ProductsSec from "../components/ProductsSec";

function Home(props) {

  const router = useRouter();
  const [sVal,setSVal] = useState("*");
  const [cat,setCat] = useState("")

  useEffect(() => {

    let query = router.asPath;
    if(query.includes("-")){
      let val = query.split("-")[1];
      console.log(val)
      setSVal(val)
    }
    else{
      setSVal("*")
    }

  },[router.asPath]);

  return (
    <>
      <Head>
        <title>OLX</title>
      </Head>

      <Navbar/>
      <Banner setCat = {setCat}/>
      <Hero/>
      <ProductsSec cat = {cat} search = {sVal} products = {props.products} view = "all"/>

      {(router.asPath === "/#login") && <Login/>}
      {(router.asPath === "/#register") && <Register/>}
      
    </>
  )
}

export default Home;

export async function getServerSideProps(context){

  const session = await getSession(context);
  
  const client = await MongoClient.connect(`${process.env.MONGO_URL}`);
  const db = client.db();
  const products = db.collection("products")

  let reqProducts = (await products.find({}).toArray()).filter(p => p.status === "unsold")

  reqProducts = reqProducts.map(p => {
    return {
      ...p,
      _id: p._id.toString()
    }
  })

  // console.log(reqProducts);

  return {
    props: {
      session: session,
      products: reqProducts
    }
  }
 
}