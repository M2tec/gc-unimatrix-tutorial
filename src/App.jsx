import { useEffect, useState } from 'react'
import holdingHandsImage from './assets/holding_hands.png'
import proposalsImage from './assets/proposals.jpg'
import './App.css'
// import { Address } from '@emurgo/cardano-serialization-lib-browser'

function App() {
  const [members, setMembers] = useState({})
  const [proposals, setProposals] = useState({})
  
  useEffect(() => {
     let getMembers = JSON.parse( localStorage.getItem("members_0"));

     console.log(getMembers)
     if (getMembers === null) {
        console.log("null null null")
        getMembers = { 0: { type: "Controller", name: "maarten", member_address: "xxxx" } }
     }

     setMembers({ ...members, ...getMembers })

     let getProposals = JSON.parse( localStorage.getItem("proposals_0"));

     if (getProposals === null) {
      console.log("null null null")
      getProposals = { 0: { type: "Governance", name: "New prop", details: "Payout contractor 5 ADA", receiver_address: "xxxx", amount: 5 } }
     }

     setProposals({ ...proposals, ...getProposals })
  }, []);

  async function handleAddMember(e) {

    console.log("Add member");

    let newNumber = parseInt(Object.keys(members)[Object.keys(members).length - 1]) + 1;

    console.log(newNumber)

    let newMember = {}

    newMember[newNumber] = { type: "Member", name: "", member_address: "" }

    setMembers({ ...members, ...newMember })
    localStorage.setItem("members_0", JSON.stringify({ ...members, ...newMember }))

    console.log(members)

  }

  async function handleCreateDAO(e) {

    console.log("Create DAO");
  }

  async function handleAddProposal(e) {

    console.log("Add proposal");

    let newNumber = parseInt(Object.keys(proposals)[Object.keys(proposals).length - 1]) + 1;

    console.log(newNumber)

    let newProposals = {}

    newProposals[newNumber] = { type: "Governance", name: "New prop", details: "Payout contractor 5 ADA", receiver_address: "xxxx", amount: 5 }


    setProposals({ ...proposals, ...newProposals })
    localStorage.setItem("proposals_0", JSON.stringify({ ...proposals, ...newProposals }))

    console.log(proposals)

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
        <input type="text" className="form-control" placeholder="Username" defaultValue={members[item].name} aria-label="Username" aria-describedby="basic-addon1" />
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Address</span>
        </div>
        <input type="text" className="form-control" placeholder="Cardano address" defaultValue={members[item].member_address} aria-label="Username" aria-describedby="basic-addon1" />
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
}

export default App
