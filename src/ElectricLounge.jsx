import React, { Component, PropTypes } from 'react';

class ElectricLounge extends Component {
    render() {
        return (
            <div>
                <h1>Hello Electric Lounge!</h1>
            </div>
        );
    }
}

// TODO Pass the immutable tokens map, rather than the individual tokens
ElectricLounge.propTypes = {
    accessToken: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired
};

export default ElectricLounge;
