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
    if (Object.keys(resultObj).length !== 0) {

      let userdata = resultObj.exports.userData
      let pubKey = userdata.addressInfo.paymentKeyHash
      console.log(pubKey)
      let id = userdata.id

      let getMembers = JSON.parse(localStorage.getItem("members_0"));

      if (getMembers !== null) {
        console.log("find 'x'", getMembers[resultObj.exports.userData.id] );

        getMembers[id].pubKey = pubKey
        console.log(getMembers)
        localStorage.setItem("members_0", JSON.stringify(getMembers))
      }
      
      window.close()

    }
  }, [resultObj])

  return (<h1>Results</h1>)
};

export default Data;
