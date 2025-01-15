import { useEffect, useState } from 'react'
import { cardano as CardanoSync } from '@gamechanger-finance/unimatrix'
import * as CSLib from '@emurgo/cardano-serialization-lib-browser';
import Gun from 'gun';

import holdingHandsImage from '../assets/holding_hands.png'
import proposalsImage from '../assets/proposals.jpg'

const Home = () => {
    const [members, setMembers] = useState({})
    const [proposals, setProposals] = useState({})
  
    const gc = window.gc;
    const defaultMemberData = { 0: { type: "Controller", name: "John", address: "", pubKey: "" } }
  
    async function handleGC(gcscript) {

        console.log(JSON.stringify(gcscript))

        const url = await gc.encode.url({
          input: JSON.stringify(gcscript), // GCScript is pure JSON code, supported on all platforms
          apiVersion: '2', //APIV2
          network: 'preprod', // mainnet or preprod
          encoding: 'gzip' //suggested, default message encoding/compression 
        });
    
        window.open(url, '_blank', 'location=yes,height=700,width=520,scrollbars=yes,status=yes');
    }

    useEffect(() => {
  
      // Setup Unimatrix
      //const connection = new Gun({ peers: ["https://preprod-sunflower.m2tec.nl/unimatrix/gun"] });
      const connection = new Gun();
  
      (async () => {
  
        //We listen for announced group of transaction hashes
        CardanoSync.onTxHashes({
          CSL: CSLib,
          db: connection,
          id: "M2tec_1234",
          dltTag: "cardano",
          networkTag: "preprod",
          subPath: ["signTxs"],
          cb: async ({ txHashes, validationError, userError, timeoutError, store, node, stop }) => {
            for (const txHash of txHashes) {
              console.log(`Received announcement for transaction ${txHash}`)
            }
          },
        });
      })();
  
      //  CardanoSync.onTxHashes({
      //   //dependencies:
      //   CSL:CSLib,
      //   db: connection,
      //   // channel parameters:
      //   id: "M2tec_1234",
      //   dltTag: "cardano",
      //   networkTag: "preprod",
      //   subPath: "signTxs",
      //   // callback that gets fired on each broadcasted transaction group:
      //   cb:async ({txHashes,stop})=>{
      //       for (const txHash of txHashes) {
      //           console.log(`Received announcement for transaction ${txHash}`)
      //       }
      //   }})
  
      // Get data from localstorage
      let getMembers = JSON.parse(localStorage.getItem("members_0"));
  
      console.log(getMembers)
      if (getMembers === null) {
        getMembers = defaultMemberData
      }
  
      setMembers({ ...members, ...getMembers })
  
      let getProposals = JSON.parse(localStorage.getItem("proposals_0"));
  
      if (getProposals === null) {
        getProposals = { 0: { type: "Governance", name: "New prop", details: "Payout contractor 5 ADA", receiver_address: "xxxx", amount: 5 } }
      }
  
      setProposals({ ...proposals, ...getProposals })


      window.addEventListener('storage', () => {
        setMembers(JSON.parse(localStorage.getItem('members_0')) || {})   
      });
    }, []);
  
  
    async function handleNameChange(event, index) {
  
      console.log("Change name");
  
      let changedMembers = { ...members }
      changedMembers[index].name = event.target.value
      setMembers({ ...changedMembers })
  
      console.log(members)
      localStorage.setItem("members_0", JSON.stringify({ ...members }))
  
    }
  
    async function handleAddressChange(event, index) {
  
      console.log("Change address");
  
      let changedMembers = { ...members }
      changedMembers[index].address = event.target.value
      setMembers({ ...changedMembers })
  
      console.log(members)
      localStorage.setItem("members_0", JSON.stringify({ ...members }))
  
    }
  
    async function getSpendPubKey(event, index) {

      let memberAddress = members[index].address
  
      const gcscript={
        "type": "script",
        "title":"Get user data",
        "description":"Get the pubkey hash for the specified address",
        "exportAs": "userData",
        "run": {
            "id": {
                "type": "data",
                "value": "" + index + ""
                },
            "addressInfo": {
                    "type": "macro",
                    "run": "{getAddressInfo('" + memberAddress + "')}"
            }
        },
        "returnURLPattern":"http://localhost:5173/return-data?d={result}"
      }
      
      handleGC(gcscript);    
    }
  
    async function handleAddMember(e) {
  
      console.log("Add member");
  
      let newNumber = parseInt(Object.keys(members)[Object.keys(members).length - 1]) + 1;
      let newMember = {}
  
      newMember[newNumber] = { type: "Member", name: "", address: "", pubKey: "" }
      setMembers({ ...members, ...newMember })
      localStorage.setItem("members_0", JSON.stringify({ ...members, ...newMember }))
    
    }
  
    async function resetMembers(e) {
      localStorage.setItem("members_0", JSON.stringify(defaultMemberData))
      let getMembers = JSON.parse(localStorage.getItem("members_0"));
      setMembers({ ...getMembers })
      console.log("Reset")
    }
  
  
    async function handleCreateDAO(e) {
  
      console.log("Create DAO");

      const gcscript={
        "type": "script",
        "title":"Get user data",
        "description":"Get the pubkey hash for the specified address",
        "exportAs": "userData",
        "run": {
            "id": {
                "type": "data",
                "value": "" + index + ""
                },
            "addressInfo": {
                    "type": "macro",
                    "run": "{getAddressInfo('" + memberAddress + "')}"
            }
        },
        "returnURLPattern":"http://localhost:5173/return-data?d={result}"
      }
      
      handleGC(gcscript);  

    }
  
    async function handleAddProposal(e) {
  
      console.log("Add proposal");
  
      let newNumber = parseInt(Object.keys(proposals)[Object.keys(proposals).length - 1]) + 1;
      let newProposals = {}
  
      newProposals[newNumber] = { type: "Governance", name: "New prop", details: "Payout contractor 5 ADA", receiver_address: "xxxx", amount: 5 }
      setProposals({ ...proposals, ...newProposals })
      localStorage.setItem("proposals_0", JSON.stringify({ ...proposals, ...newProposals })) 
    }
  
    async function handleAuthorizeProposal(e) {
  
      console.log("Authorize Proposal");
  
    }
  
    const listMembers = Object.keys(members).map((item, index) =>
  
      <li className="list-group-item" key={index} >{members[item].type}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">@</span>
          </div>
          <input type="text" onChange={(e) => handleNameChange(e, index)} className="form-control" placeholder="Username" defaultValue={members[item].name} aria-label="Username" aria-describedby="basic-addon1" />
        </div>
  
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Address</span>
          </div>
          <input type="text" onChange={(e) => handleAddressChange(e, index)} className="form-control" placeholder="Cardano address" defaultValue={members[item].address} aria-label="Username" aria-describedby="basic-addon1" />
        </div>
  
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Public Key</span>
          </div>
          <input type="text" className="form-control" disabled="disabled" placeholder="" defaultValue={members[item].pubKey} aria-label="Username" aria-describedby="basic-addon1" />
          <a className="btn btn-primary" onClick={(e) => getSpendPubKey(e, index)}>Get</a>
        </div>
      </li>
  
    );
  
    const listProposals = Object.keys(proposals).map((item, index) =>
  
      <li className="list-group-item" key={index} >{proposals[item].type}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">@</span>
          </div>
          <input type="text" className="form-control" placeholder="Username" defaultValue={proposals[item].name} aria-label="Username" aria-describedby="basic-addon1" />
        </div>
  
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Reciever address</span>
          </div>
          <input type="text" className="form-control" placeholder="Cardano address" defaultValue={proposals[item].receiver_address} aria-label="Username" aria-describedby="basic-addon1" />
        </div>
  
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Details</span>
          </div>
          <input type="text" className="form-control" placeholder="Cardano address" defaultValue={proposals[item].details} aria-label="Username" aria-describedby="basic-addon1" />
        </div>
  
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Amount</span>
          </div>
          <input type="text" className="form-control" placeholder="Cardano address" defaultValue={proposals[item].amount} aria-label="Username" aria-describedby="basic-addon1" />
        </div>
  
        <a href="#" className="btn btn-primary mb-3" onClick={handleAuthorizeProposal}>Authorize</a>
      </li>
  
    );

    return (
        <>
        <div className="card">
          <img className="card-img-top" src={holdingHandsImage} alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">DAO creator</h5>
            <ul className="list-group">
              {listMembers}
              <a className="btn btn-primary mt-2" onClick={handleAddMember}>Add member</a>
              <a className="btn btn-primary mt-2" onClick={resetMembers}>Reset</a>
            </ul>
            <a className="btn btn-primary m-3" onClick={handleCreateDAO}>Create DAO</a>
          </div>
        </div>
  
        <div className="card mt-3">
          <img className="card-img-top" src={proposalsImage} alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">Proposal</h5>
            <ul className="list-group">
              {listProposals}
              <a className="btn btn-primary mt-2" onClick={handleAddProposal}>Add proposal</a>
            </ul>
          </div>
        </div>
      </>

    ) 
};

export default Home;
