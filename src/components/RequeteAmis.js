import React from 'react';

const RequeteAmis = ({ requeteAmis }) => {

    const listeRequeteAmis = requeteAmis.split(',')

    return (
        <span>
            <div className='form'>
                Requêtes d'amis effectuées :
            </div>
            {listeRequeteAmis.map((requeteAmi, index) => {
                return <div key={index}>
                    <div className='form'>- {requeteAmi}</div>
                </div>
            })}
        </span>
    );
};

export default RequeteAmis;