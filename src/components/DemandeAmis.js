import React, { useState } from 'react';
import axios from 'axios';

const DemandeAmis = ({ demandeAmis, compte, setRechargementDonnees, rechargementDonnees }) => {

    const [message, setMessage] = useState('');
    const [statusRequete, setStatusRequete] = useState(0);

    const validationAmi = ({ ami }) => {

        const data = {
            pseudoaajouter: ami,
            pseudoutilisateur: compte.pseudo,
            idutilisateur: compte.id
        };


        axios.post(`http://localhost:8080/api/utilisateurs/ajoutamis`, data)
            .then(response => {
                console.log('Réponse de la requête GET :', response.data);
                setMessage(response.data.message);
                setStatusRequete(response.status);
                setRechargementDonnees(!rechargementDonnees);
            })
            .catch(error => {
                if (error.response) {
                    setMessage(error.response.data.message);
                    setStatusRequete(error.response.status);
                } else if (error.request) {
                    // La requête a été effectuée mais il n'y a pas eu de réponse du serveur
                    console.log("Erreur de la requête, pas de réponse du serveur.");
                } else {
                    // Une erreur s'est produite lors de la préparation de la requête
                    console.error("Erreur lors de la préparation de la requête :", error.message);
                }
            });
    }

    const refusAmi = ({ ami }) => {

        const data = {
            pseudoaajouter: ami,
            pseudoutilisateur: compte.pseudo,
            idutilisateur: compte.id
        };


        axios.post(`http://localhost:8080/api/utilisateurs/refusamis`, data)
            .then(response => {
                console.log('Réponse de la requête GET :', response.data);
                setMessage(response.data.message);
                setStatusRequete(response.status);
                setRechargementDonnees(!rechargementDonnees);
            })
            .catch(error => {
                if (error.response) {
                    setMessage(error.response.data.message);
                    setStatusRequete(error.response.status);
                } else if (error.request) {
                    // La requête a été effectuée mais il n'y a pas eu de réponse du serveur
                    console.log("Erreur de la requête, pas de réponse du serveur.");
                } else {
                    // Une erreur s'est produite lors de la préparation de la requête
                    console.error("Erreur lors de la préparation de la requête :", error.message);
                }
            });
    }

    return (
        <span>
            <div className='form'>
                Demande d'amis :
            </div>
            {demandeAmis.map((demandeAmi, index) => {
                console.log(typeof (demandeAmi))
                console.log(demandeAmi)
                return <div key={index}>
                    <span className='form'>- {demandeAmi}</span>
                    <button className='buttonform' onClick={() => validationAmi({ ami: demandeAmi })}>Valider</button>
                    <button className='buttonform' onClick={() => refusAmi({ ami: demandeAmi })}>Refuser</button>
                    {message && (
                        <div className="form">
                            {statusRequete === 500 && <div className="serveurerreur">{message}</div>}
                            {statusRequete === 400 && <div className="attention">{message}</div>}
                            {statusRequete === 200 && <div className="valider">{message}</div>}
                        </div>
                    )}
                </div>

            })}
        </span>
    );
};

export default DemandeAmis;