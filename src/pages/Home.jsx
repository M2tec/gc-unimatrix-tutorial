import { useEffect, useState } from 'react'
import UnimatrixListener from '../services/UnimatrixListener';
import Gun from 'gun';
import Signers from './Signers';
import holdingHandsImage from '../assets/holding_hands.png'
import proposalsImage from '../assets/proposals.jpg'

const Home = () => {
  const [members, setMembers] = useState({})
  const [proposals, setProposals] = useState({})
  const [daoInfo, setDaoInfo] = useState({})
  const [daoFundAmount, setDaoFundAmount] = useState("100")
  const [daoTransactions, setDaoTransactions] = useState({})

  const [host, setHost] = useState("")

  const gc = window.gc;

  let peers = ["https://ar01.gamechanger.finance:2083/unimatrix/gun"]
  const gun = new Gun({ peers });

  const defaultMemberData = { 0: { type: "Controller", name: "John", address: "", pubKey: "", stakeKey: "" } };
  const defaultProposalData = { 0: { type: "Governance", name: "", details: "", address: "", amount: "", txHashes: [] } };

  async function handleGC(gcscript) {

    console.log(JSON.stringify(gcscript))

    let url = await gc.encode.url({
      input: JSON.stringify(gcscript), // GCScript is pure JSON code, supported on all platforms
      apiVersion: '2', //APIV2
      network: 'preprod', // mainnet or preprod
      encoding: 'gzip' //suggested, default message encoding/compression 
    });

    // url = url.replace("https://beta-preprod-wallet.", "https://dev-preprod-wallet.")
    
    window.open(url, '_blank', 'location=yes,height=700,width=520,scrollbars=yes,status=yes');
  }

  useEffect(() => {


    let getDaoInfo = JSON.parse(localStorage.getItem("daoInfo_0"));

    if (getDaoInfo === null) {
      getDaoInfo = { name: "", address: "" }
    }

    setDaoInfo({ ...daoInfo, ...getDaoInfo })


    let getMembers = JSON.parse(localStorage.getItem("members_0"));

    if (getMembers === null) {
      getMembers = defaultMemberData
    }

    setMembers({ ...members, ...getMembers })

    let getProposals = JSON.parse(localStorage.getItem("proposals_0"));

    if (getProposals === null) {
      getProposals = defaultProposalData
    }

    setProposals({ ...proposals, ...getProposals })

    let getTransactions = JSON.parse(localStorage.getItem("transactions_0"));

    if (getTransactions === null) {
      getTransactions = {}
    }

    setDaoTransactions({ ...getTransactions })


    window.addEventListener('storage', () => {     
      console.log("StorageEvent")
      setDaoInfo(JSON.parse(localStorage.getItem('daoInfo_0')) || {})

      setMembers(JSON.parse(localStorage.getItem('members_0')) || {})

      setDaoTransactions(JSON.parse(localStorage.getItem('transactions_0')) || {})
    });

    let myHostname = location.protocol + '//' + location.host
    setHost(myHostname);


  }, []);


  // Members
  async function handleDaoNameChange(event) {

    console.log("Change name");

    let changedDaoInfo = { ...daoInfo }

    changedDaoInfo.name = event.target.value
    setDaoInfo(changedDaoInfo)

    localStorage.setItem("daoInfo_0", JSON.stringify(changedDaoInfo))

  }

  async function handleNameChange(event, index) {

    console.log("Change name");

    let changedMembers = { ...members }
    changedMembers[index].name = event.target.value
    setMembers(changedMembers)

    // console.log(members)
    localStorage.setItem("members_0", JSON.stringify(changedMembers))

  }

  async function handleAddressChange(event, index) {

    console.log("Change address");

    let changedMembers = { ...members }
    changedMembers[index].address = event.target.value
    setMembers({ ...changedMembers })

    console.log(members)
    localStorage.setItem("members_0", JSON.stringify({ ...members }))

  }

  async function getWalletData(event, index) {

    let memberAddress = members[index].address

    const gcscript = {
      "type": "script",
      "title": "Get user data",
      "description": "Get the pubkey hash for the specified address",
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
      "returnURLPattern": host + "/return-data?d={result}"
    }

    handleGC(gcscript);
  }

  async function handleAddMember(e) {

    console.log("Add member");

    let newNumber = parseInt(Object.keys(members)[Object.keys(members).length - 1]) + 1;
    let newMember = {}

    newMember[newNumber] = { type: "Member", name: "", address: "", pubKey: "", stakeKey: "" }

    setMembers({ ...members, ...newMember })
    localStorage.setItem("members_0", JSON.stringify({ ...members, ...newMember }))

  }

  async function resetMembers(e) {
    console.log("Reset")

    localStorage.setItem("members_0", JSON.stringify(defaultMemberData))
    let getMembers = JSON.parse(localStorage.getItem("members_0"));
    setMembers({ ...getMembers })

  }

  async function handleCreateDAO(e) {

    console.log("Create DAO");

    const gcscript =
    {
      "type": "script",
      "title": "Multisig Workspace Builder",
      "description": "Controller",
      "exportAs": "daoWalletData",
      "args": {},
      "run": {
        "walletSetup": {
          "type": "loadConfig",
          "updateId": "multisigs_update_1",
          "layers": [
            {
              "type": "Workspace",
              "items": [
                {
                  "namePattern": daoInfo.name + "_DAO",
                  "titlePattern": daoInfo.name + " multisig",
                  "descriptionPattern": "Multisig wallet " + daoInfo.name
                }
              ]
            },
            {
              "type": "NativeScript",
              "workspaceIds": [
                daoInfo.name + "_DAO"
              ],
              "namePattern": daoInfo.name + "_{key}_script",
              "items": {
                "spend": {
                  "all": {}
                },
                "stake": {
                  "all": {}
                }
              }
            },
            {
              "type": "Address",
              "workspaceIds": [
                daoInfo.name + "_DAO",
              ],
              "items": [
                {
                  "namePattern": daoInfo.name,
                  "spendNativeScriptName": daoInfo.name + "_spend_script",
                  "stakeNativeScriptName": daoInfo.name + "_stake_script"
                }
              ]
            }
          ]
        },
        "walletSelect": {
          "type": "setCurrentWorkspace",
          "workspaceId": daoInfo.name + "_DAO"
        },
        "getAddress": {
          "type": "getAddresses",
        } 
      },
      "returnURLPattern": host + "/return-data?d={result}"
    }


    for (let key in members) {
      console.log(key, members[key]);

      gcscript.args[members[key].name] = {
        "spendKeyHashHex": members[key].pubKey,
        "stakeKeyHashHex": members[key].stakeKey
      }

      gcscript.run.walletSetup.layers[1].items.spend.all[members[key].name] =
      {
        "pubKeyHashHex": "{get('args." + members[key].name + ".spendKeyHashHex')}"
      }

      gcscript.run.walletSetup.layers[1].items.stake.all[members[key].name] =
      {
        "pubKeyHashHex": "{get('args." + members[key].name + ".stakeKeyHashHex')}"
      }

    }

    handleGC(gcscript);

  }


  // DAO tools
  async function handleDaoAddressChange(event) {

    console.log("Change address");

    let changedDaoInfo = { ...daoInfo }

    changedDaoInfo.address = event.target.value
    setDaoInfo(changedDaoInfo)

    localStorage.setItem("daoInfo_0", JSON.stringify(changedDaoInfo))

  }

  async function handleDaoFundChange(event) {

    console.log("Change fund");

    let fundAmount = event.target.value
    setDaoFundAmount(fundAmount)

  }

  async function fundDAOWallet(event) {

    let lovelaceAmount = (daoFundAmount * 10 ** 6).toString()

    let gcscript = {
      "type": "script",
      "title": "Funding DAO",
      "description": "This will fund the DAO with the following amount " + daoFundAmount,
      "exportAs": "fundDAO",
      "return": {
        "mode": "last"
      },
      "run": {
        "build_0": {
          "type": "buildTx",
          "tx": {
            "outputs": [
              {
                "address": daoInfo.address,
                "assets": [
                  {
                    "policyId": "ada",
                    "assetName": "ada",
                    "quantity": lovelaceAmount
                  }
                ]
              }
            ]
          }
        },
        "sign_1": {
          "type": "signTxs",
          "namePattern": "Signed Demo Transaction",
          "detailedPermissions": false,
          "txs": [
            "{get('cache.build_0.txHex')}"
          ]
        },
        "submit_2": {
          "type": "submitTxs",
          "namePattern": "Submitted Demo Transaction",
          "txs": "{get('cache.sign_1')}"
        },
        "export_3": {
          "type": "macro",
          "run": "{get('cache.build_0.txHash')}"
        }
      },
      "returnURLPattern": host + "/return-data?d={result}"
    }

    handleGC(gcscript);
  }


  // Proposals
  async function handleProposalNameChange(event, index) {

    console.log("Change proposal name");

    let changedProposals = { ...proposals }
    changedProposals[index].name = event.target.value
    setProposals(changedProposals)

    // console.log(proposals)
    localStorage.setItem("proposals_0", JSON.stringify(changedProposals))

  }

  async function handleProposalAddressChange(event, index) {

    console.log("Change proposal address");

    let changedProposals = { ...proposals }
    changedProposals[index].address = event.target.value
    setProposals(changedProposals)

    // console.log(proposals)
    localStorage.setItem("proposals_0", JSON.stringify(changedProposals))

  }

  async function handleProposalDetailsChange(event, index) {

    console.log("Change proposal details");

    let changedProposals = { ...proposals }
    changedProposals[index].details = event.target.value
    setProposals(changedProposals)

    // console.log(proposals)
    localStorage.setItem("proposals_0", JSON.stringify(changedProposals))

  }

  async function handleProposalAmountChange(event, index) {

    console.log("Change proposal amount");

    let changedProposals = { ...proposals }


    changedProposals[index].amount = event.target.value
    setProposals(changedProposals)

    // console.log(proposals)
    localStorage.setItem("proposals_0", JSON.stringify(changedProposals))

    console.log(proposals)
  }

  async function handleAddProposal(e) {

    console.log("Add proposal");

    let newNumber = parseInt(Object.keys(proposals)[Object.keys(proposals).length - 1]) + 1;
    let newProposals = {}

    newProposals[newNumber] = defaultProposalData["0"]
    setProposals({ ...proposals, ...newProposals })
    localStorage.setItem("proposals_0", JSON.stringify({ ...proposals, ...newProposals }))
  }

  async function handleAuthorizeProposal(event, index) {

    console.log("Authorize Proposal");

    let lovelaceAmount = (proposals[index].amount * 10 ** 6).toString()

    const gcscript =
    {
      "type": "script",
      "title": proposals[index].name,
      "description": proposals[index].details,
      "exportAs": "proposalData",
      "return": {
        "mode": "last"
      },
      "run": {
        "build_0": {
          "type": "buildTx",
          "tx": {
            "outputs": [
              {
                "address": proposals[index].address,
                "assets": [
                  {
                    "policyId": "ada",
                    "assetName": "ada",
                    "quantity": lovelaceAmount
                  }
                ]
              }
            ],
            "requiredSigners": {
            },
            "options": {
              "autoProvision": {
                "workspaceNativeScript": true
              },
              "autoOptionalSigners": {
                "nativeScript": true
              }
            }
          }
        },
        "sign_1": {
          "type": "signTxs",
          "namePattern": "MultiSig-{key}",
          "detailedPermissions": false,
          "multisig": [
            { "kind": "MainAddress" },
            { "kind": "CurrentWorkspace" },
            {
              "kind": "Unimatrix",
              "id": daoInfo.name + "_" + index,
              "share": true,
              "shareTxs": true,
              "announceTxHashes": true,
              "announceTxHashesSubPath": "signTxs",
              "relays": peers,
            },
          ],
          "txs": [
            "{get('cache.build_0.txHex')}"
          ]
        },
        "stage4_export_results": {
          "type": "macro",
          "run": "{get('cache.build_0.txHash')}"
        }
      },
      "returnURLPattern": host + "/return-data?d={result}"
    }

    for (let key in members) {
      console.log(key, members[key]);

      let gc_tx = gcscript.run.build_0.tx;
      gc_tx.requiredSigners[members[key].name] = members[key].pubKey
    }

    handleGC(gcscript);
  }

  async function handleSignProposal(event, index) {

    console.log("Sign Proposal");

    let memberAmount = Object.keys(members).length
    let witnessKeyAmount = Object.keys(daoTransactions[index].vkWitnessHex).length

    let gcscript = {
      "title": "Multi-sign transaction",
      "description": "Sign next",
      "type": "script",
      "run": {
        "sign_0": {
          "type": "signTxs",
          "namePattern": "MultiSig-{key}",
          "multisig": [
            {
              "kind": "MainAddress"
            },
            {
              "kind": "CurrentWorkspace"
            },

            {
              "kind": "Unimatrix",
              "id": daoInfo.name + "_" + index,
              "share": true,
              "shareTxs": true,
              "announceTxHashes": true,
              "relays": peers
            }
          ],
          "txs": [daoTransactions[index].txHex]
        }
      }
    }

    // Add submit to the final signing. 
    if (witnessKeyAmount == memberAmount -1) {
      console.log (witnessKeyAmount, memberAmount)

      gcscript["run"]["submit_2"]= 
      {
        "type": "submitTxs",
        "namePattern": "Submitted Demo Transaction",
        "txs": "{get('cache.sign_0')}"
      }

    }

    // With all witnesskeys present abort
    if (witnessKeyAmount >= memberAmount) {
      console.log ("Transaction finished")
      return
    }

    handleGC(gcscript);
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
        <a className="btn btn-primary" onClick={(e) => getWalletData(e, index)}>Get</a>
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Stake Key</span>
        </div>
        <input type="text" className="form-control" disabled="disabled" placeholder="" defaultValue={members[item].stakeKey} aria-label="Username" aria-describedby="basic-addon1" />
      </div>
    </li>

  );

  const listProposals = (proposals, daoTransactions) => Object.keys(proposals).map((item, index) => {

    let proposal = proposals[item]
    let proposalTx = daoTransactions[index]

    return (
    <li className="list-group-item" key={index} >{proposal.type}
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">@</span>
        </div>
        <input type="text" onChange={(e) => handleProposalNameChange(e, index)} className="form-control" placeholder="Proposal name" defaultValue={proposal.name} aria-label="Username" aria-describedby="basic-addon1" />
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Reciever address</span>
        </div>
        <input type="text" onChange={(e) => handleProposalAddressChange(e, index)} className="form-control" placeholder="Cardano address" defaultValue={proposal.address} aria-label="Username" aria-describedby="basic-addon1" />
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Details</span>
        </div>
        <input type="text" onChange={(e) => handleProposalDetailsChange(e, index)} className="form-control" placeholder="" defaultValue={proposal.details} aria-label="Username" aria-describedby="basic-addon1" />
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Amount</span>
        </div>
        <input type="text" onChange={(e) => handleProposalAmountChange(e, index)} className="form-control" placeholder="" defaultValue={proposal.amount} aria-label="Amount" aria-describedby="basic-addon1" />
      </div>

      <Signers {...{ proposalTx, members }} />
      <a href="#" className="btn btn-primary m-2" onClick={(e) => handleAuthorizeProposal(e, index)}>Authorize</a>
      <a href="#" className="btn btn-primary m-2" onClick={(e) => handleSignProposal(e, index)}>Sign</a>
      <UnimatrixListener {...{
        gun,
        index,
        unimatrixId: `${daoInfo.name}_${index}`,
        members }} />
    </li>)
  }
  );

  return (
    <>
      <div className="card">
        <img className="card-img-top" src={holdingHandsImage} alt="Card image cap" />
        <div className="card-body">
          <h5 className="card-title">DAO creator</h5>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">DAO name</span>
            </div>
            <input type="text" onChange={handleDaoNameChange} className="form-control" placeholder="" defaultValue={daoInfo.name} aria-label="DAOname" aria-describedby="basic-addon1" />
          </div>

          <ul className="list-group">
            {listMembers}
            <a className="btn btn-primary mt-2" onClick={handleAddMember}>Add member</a>
            <a className="btn btn-primary mt-2" onClick={resetMembers}>Reset</a>
          </ul>
          <a className="btn btn-primary m-3" onClick={handleCreateDAO}>Create DAO</a>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">DAO address</span>
            </div>
            <input type="text" onChange={handleDaoAddressChange} className="form-control" placeholder="" defaultValue={daoInfo.address} aria-label="DAOname" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">Fund DAO</span>
            </div>
            <input type="text" onChange={handleDaoFundChange} className="form-control" placeholder="" defaultValue="100" aria-label="DAOname" aria-describedby="basic-addon1" />
            <a className="btn btn-primary" onClick={fundDAOWallet}>Fund</a>
          </div>

        </div>
      </div>

      <div className="card mt-3">
        <img className="card-img-top" src={proposalsImage} alt="Card image cap" />
        <div className="card-body">
          <h5 className="card-title">Proposal</h5>
          <ul className="list-group">
            {listProposals(proposals, daoTransactions)}
            <a className="btn btn-primary mt-2" onClick={handleAddProposal}>Add proposal</a>
          </ul>
        </div>
      </div>
    </>

  )
};

export default Home;
