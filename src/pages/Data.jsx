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

        if (resultObj.exports.userData) {
        let userdata = resultObj.exports.userData
        let pubKey = userdata.addressInfo.paymentKeyHash
        let stakeKey = userdata.addressInfo.stakingKeyHash
        // console.log(pubKey)
        let id = userdata.id

        let members = JSON.parse(localStorage.getItem("members_0"));

        if (members !== null) {
          // console.log("memers_0", members[resultObj.exports.userData.id] );

          members[id].pubKey = pubKey
          members[id].stakeKey = stakeKey
          // console.log(members)
          localStorage.setItem("members_0", JSON.stringify(members))
        }
        
        // window.close()
      } else {
        console.log(resultObj.exports)
      }

    }
  }, [resultObj])

  return (<h1>Results</h1>)
};

export default Data;
