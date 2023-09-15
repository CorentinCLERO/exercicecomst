import React, { useState } from 'react';

const Ami = ({ ami, icone, publique, listedamis, comptePublic }) => {

    const [montrerInfosPublique, setMontrerInfosPublique] = useState(false);

    const infosPublique = () => {

        setMontrerInfosPublique(!montrerInfosPublique)
    }

    return (
        <div className="form">
            <span onClick={comptePublic ? infosPublique : null} style={comptePublic ? { cursor: 'pointer' } : {}}>- {ami} {icone} {publique}</span>
            {montrerInfosPublique && comptePublic && (
                <span>
                    <div className='form'>Amis de {ami} : </div>
                    {listedamis.split(',').map((ami, index) => (
                        <div key={index}>
                            <div className='form'>- {ami}</div>
                        </div>
                    ))}
                </span>
            )}
        </div>
    );
};

export default Ami;