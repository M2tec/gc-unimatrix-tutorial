import {useEffect} from 'react';
import {cardano as CardanoSync} from '@gamechanger-finance/unimatrix'
import CardanoWasm from './cardanoWasm';

/**
 * React component that listens for announced transaction groups on Unimatrix Sync,
 * retrieves the transaction (hexadecimal encoded CBOR structure)
 * and populates the React application state with all the data for `UnimatrixMonitor` 
 * component to render it and trigger transaction validation and signing.
 * 
 * @param {*} param0 
 */
export const UnimatrixListener =({
    unimatrixId    
})=>{
    

let unimatrixRelays = ["https://ar01.gamechanger.finance:2083/unimatrix/gun",
    "http://localhost:5173/unimatrix/gun",
    "http://localhost:5173/gun"]

    const gun = new Gun({ unimatrixRelays });

    let dltTag = "cardano";
    let networkTag = "preprod";
    let path = ["signTxs"];

    const params={
        CSL:CardanoWasm(),
        db:gun,
        dltTag,
        networkTag,
        id:unimatrixId,
        subPath:path, 
    }
    console.log("listener")
    console.log("params", params)

    useEffect(()=>{
        if(!unimatrixId) 
            return
        (async()=>{
            //We listen for announced group of transaction hashes
            CardanoSync.onTxHashes({
                ...params,
                cb:async ({txHashes,validationError,userError,timeoutError,store,node,stop})=>{
                    if(validationError||userError||timeoutError)
                        console.warn(`onTxHashes(): Error. ${JSON.stringify({validationError,userError,timeoutError,node})}`);
                    if(txHashes){
                        const updatedAt=store.updatedAt||0;
                        // we register the transaction hashes
                        // const txGroupId=registerTxHashes({txHashes})
                        // console.info(`[${path.join('/')}]: Data = ${JSON.stringify({txGroupId,txHashes})}`);
                        txHashes.forEach(txHash => {
                            // for each transaction hash we try to retrieve the transaction data (CBOR hex)
                            CardanoSync.getTxHex({...params,txHash})
                                //we register the transaction data
                                // .then(({txHex})=>registerTxHex({txGroupId,txHash,txHex,updatedAt}))
                                .then(({ store }) => console.log(store))
                                .catch(err=>{
                                    console.warn(`Warning: Failed to fetch transaction '${txHash}'.${err||"Unknown error"}`);
                                    return {};
                                });
                        
                        });
                    }
                },
            });
        })();

    },[unimatrixId]);
    return null;
}



export default UnimatrixListener;