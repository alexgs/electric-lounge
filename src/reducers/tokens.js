import Immutable from 'immutable';

const initialState = Immutable.fromJS( {
    access: 'BQDIOikk9ZdeR0kkDBZKl9H_w4byhhEYBv3npKESuOo5i5D0xFvxSpyfqJd85f3-jG'
        + 'VoeZsHIK46wsiiYI2o8lquPx6kvhqmnDuB5Dzk3PO8MT6WYiiVihIR6cGtIvENWQ3I0g'
        + 'l7Jzbj-AjecLpd_uTCFk_VLDs',
    refresh: 'AQBU9Ev64PeVinhbnS4OIErgCRDYlV8GjkHdDNlx-YpW9-LapchFNLy5jmbLiXfcc'
        + 'Lh1IlS7FEKzcykgLLuc3zW0C_w2srgW1BJ3-G2UtIHOGurjoQPiwSRCAwZYrOmQhl4>'
} );

const tokens = function( state = initialState, action ) {
    return state;
};

export default tokens;
