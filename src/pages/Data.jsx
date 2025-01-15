import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Data = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resultObj, setResultObj] = useState({});


  async function decodeActionUrl(returnData) {
    const mydata = await gc.encodings.msg.decoder(returnData);
    setResultObj(mydata);
}

  useEffect(() => {

    let returnData = searchParams.get("d");
    console.log(returnData);

    decodeActionUrl(returnData);


  }, []);

  useEffect(() => {
    console.log("results")
    console.log(resultObj)
    console.log(resultObj.exports.userData.addressInfo.paymentKeyHash)
}, [resultObj])

  return ( <h1>Results</h1> )
  };
  
  export default Data;
  