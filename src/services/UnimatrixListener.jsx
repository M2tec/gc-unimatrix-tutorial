import { useEffect } from 'react';
import { cardano as CardanoSync } from '@gamechanger-finance/unimatrix'
import CardanoWasm from './cardanoWasm';

/**
 * React component that listens for announced transaction groups on Unimatrix Sync,
 * retrieves the transaction (hexadecimal encoded CBOR structure)
 * and populates the React application state with all the data for `UnimatrixMonitor` 
 * component to render it and trigger transaction validation and signing.
 * 
 * @param {*} param0 
 */
export const UnimatrixListener = ({
    gun,
    index,
    unimatrixId
}) => {
    let dltTag = "cardano";
    let networkTag = "preprod";
    let path = ["signTxs"];

    const params = {
        CSL: CardanoWasm(),
        db: gun,
        dltTag,
        networkTag,
        id: unimatrixId,
        subPath: path,
    }

    useEffect(() => {

        if (!gun || !unimatrixId || !path)
            return

        (async () => {

            CardanoSync.onTxHashes({
                ...params,
                cb: async ({ txHashes, validationError, userError, timeoutError, store, node, stop }) => {
                    
                    if (validationError || userError || timeoutError)
                        console.warn(`onTxHashes(): Error. ${JSON.stringify({ validationError, userError, timeoutError, node })}`);
                    
                    if (txHashes) {
                        
                        txHashes.forEach(txHash => {

                            CardanoSync.getTxHex({ ...params, txHash })
                                .then(({ txHex }) => {
                                    console.log("storetx")
                                    console.log(txHash, txHex)
                                    let daoTx = JSON.parse(localStorage.getItem('transactions_0'))

                                    if (daoTx === null) {
                                        daoTx = { }
                                    }

                                    daoTx[index] = {"txHash": txHash, "txHex": txHex}
                                    console.log("daoTx", daoTx)
                                    localStorage.setItem("transactions_0", JSON.stringify(daoTx)  )
                                })
                                .then(({ txHex }) => {

                                })
                                .catch(err => {
                                    console.warn(`Warning: Failed to fetch transaction '${txHash}'.${err || "Unknown error"}`);
                                    return {};
                                });

                        });
                    }
                },
            });
        })();

    }, [unimatrixId]);
    return null;
}



export default UnimatrixListener;