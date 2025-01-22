

const Signers = ({ members, daoTransactions }) => {

    const listSigners = Object.keys(members).map((item, index) =>
        <li className="list-group-item" key={index} >
            {members[index].name}
        </li>
    );

    return (
        <ul className="list-group list-group-horizontal">
            {listSigners}
        </ul>

    )
};

export default Signers;
