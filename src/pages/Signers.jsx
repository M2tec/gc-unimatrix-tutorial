

const Signers = ({ index, members, daoTransactions }) => {

    let daoTx = daoTransactions[index]
    // let witness = daoTx.vkWitnessHex    
    // console.log("proposal", index)

    function SignerItem({ memberIndex }) {
        let hasWitness = false

        if (daoTx) {
            let witness = daoTx.vkWitnessHex
            // console.log(witness[memberIndex])
            if (witness[memberIndex]) {
                hasWitness = true
            }
    
        }
        // console.log("hasWitness", hasWitness)

        if (hasWitness) {
            return <li className="list-group-item list-group-item-success" key={memberIndex}>{members[memberIndex].name}</li>
        }
        return <li className="list-group-item" key={memberIndex}>{members[memberIndex].name}</li>;
    }


    const listSigners = Object.keys(members).map((item, memberIndex) =>
        <SignerItem key={memberIndex} memberIndex={memberIndex} />
    );

    return (
        <ul className="list-group list-group-horizontal justify-content-center">
            {listSigners}
        </ul>

    )
};

export default Signers;
