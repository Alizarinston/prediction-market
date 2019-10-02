import React from 'react';
import CustomForm from '../components/Form';

class ProposalCreate extends React.Component {

    state = {
        proposals: []
    };

    render () {
        return (
            <div>
                <h2>Create a proposal</h2>
                <CustomForm
                    requestType="post"
                    btnText="Create"/>
            </div>
        )
    }
}

export default ProposalCreate;