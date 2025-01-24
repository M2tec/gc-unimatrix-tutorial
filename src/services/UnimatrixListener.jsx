import { useEffect } from 'react';
import { cardano as CardanoSync } from '@gamechanger-finance/unimatrix'
import CardanoWasm from './cardanoWasm';

// import { onVkWitnessHex } from '@gamechanger-finance/unimatrix/dist/types/sync';

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
    unimatrixId,
    members
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
                                    // console.log("txHash", { index, txHash })
                                    let daoTx = JSON.parse(localStorage.getItem('transactions_0'))

                                    if (!daoTx) {
                                        daoTx = {}
                                        // localStorage.setItem("transactions_0", JSON.stringify(daoTx))
                                    }

                                    if (!daoTx[index]) {
                                        console.log("No tx registered yet")
                                        let newDaoTx = {}
                                        newDaoTx[index] = { "txHash": txHash, "txHex": txHex, "vkWitnessHex": {} }

                                        daoTx = { ...daoTx, ...newDaoTx }
                                        console.log(daoTx)
                                        localStorage.setItem("transactions_0", JSON.stringify(daoTx))
                                    }

                                })
                                .catch(err => {
                                    console.warn(`Warning: Failed to fetch transaction '${txHash}'.${err || "Unknown error"}`);
                                    return {};
                                });


                            for (let memberIndex in members) {
                                // console.log("member: " + members[memberIndex].name)
                                // console.log(members[memberIndex]);

                                let vkHash = members[memberIndex].pubKey;


                                CardanoSync.getVkWitnessHex({ ...params, txHash, vkHash })
                                    .then(({ vkWitnessHex }) => {
                                        console.log(members[memberIndex].name, vkWitnessHex)
                                        // console.log(members[memberIndex].name, txHash)

                                        let daoTxs = JSON.parse(localStorage.getItem('transactions_0'))

                                        let currentProposalDaoTx = daoTxs[index]

                                        console.log("x", currentProposalDaoTx.vkWitnessHex[index])

                                        if (!(currentProposalDaoTx.vkWitnessHex[index])) {
                                            "no vk index"
                                            currentProposalDaoTx.vkWitnessHex = {}
                                        }
                                        // console.log(daoTxs)

                                        // if 

                                        // Current proposal indexes
                                        // let txWitnesses = {...daoTxs[index].vkWitnessHex};
                                        // console.log(txWitnesses)

                                        // txWitnesses[memberIndex] = vkWitnessHex

                                        // console.log("txWitnesss", txWitnesses)

                                        // daoTxs[index].vkWitnessHex = txWitnesses

                                        // localStorage.setItem("transactions_0", JSON.stringify(daoTxs))


                                    })
                                    .catch(err => {
                                        console.warn(`Warning: Failed to fetch witness '${txHash}'.${err || "Unknown error"}`);
                                        return {};
                                    });
                            }
                        });


                    }
                },
            });





        })();

    }, [unimatrixId]);
    return null;
}



export default UnimatrixListener;