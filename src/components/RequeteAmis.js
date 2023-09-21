import React from 'react';

const RequeteAmis = ({ requeteAmis }) => {

    return (
        <span>
            <div className='form'>
                Requêtes d'amis effectuées :
            </div>
            {requeteAmis.map((requeteAmi, index) => {
                return <div key={index}>
                    <div className='form'>- {requeteAmi}</div>
                </div>
            })}
        </span>
    );
};

export default RequeteAmis;