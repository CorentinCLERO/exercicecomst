import React from 'react';
import axios from 'axios';

const DemandeAmis = ({ demandeAmis, compte, setRechargementDonnees, rechargementDonnees }) => {

    const listeDemandeAmis = demandeAmis.split(',')

    const validationAmi = ({ ami }) => {

        const data = {
            pseudo: ami
        };

        let validationRequete = 0

        axios.get(`http://localhost:8080/api/utilisateurs?pseudo=${data.pseudo}`)
            .then(response => {
                console.log('Réponse de la requête GET :', response.data, data);
                if (response.data.length > 0) {
                    axios.put(`http://localhost:8080/api/utilisateurs/amis/${compte.id}`, {
                        champ: "listeamis",
                        nouvelleValeur: data.pseudo,
                        type: "add"
                    })
                        .then(response => {
                            console.log('Réponse de la requête PUT :', response.data);
                            validationRequete++;
                            if (validationRequete === 4) setRechargementDonnees(!rechargementDonnees);
                        })
                        .catch(error => {
                            console.error('Erreur de la requête PUT :', error);
                        });
                    axios.put(`http://localhost:8080/api/utilisateurs/amis/${response.data[0].id}`, {
                        champ: "listeamis",
                        nouvelleValeur: compte.pseudo,
                        type: "add"
                    })
                        .then(response => {
                            console.log('Réponse de la requête PUT :', response.data);
                            validationRequete++;
                            if (validationRequete === 4) setRechargementDonnees(!rechargementDonnees);
                        })
                        .catch(error => {
                            console.error('Erreur de la requête PUT :', error);
                        });
                    axios.put(`http://localhost:8080/api/utilisateurs/amis/${compte.id}`, {
                        champ: "demandeamis",
                        nouvelleValeur: data.pseudo,
                        type: "sup"
                    })
                        .then(response => {
                            console.log('Réponse de la requête PUT :', response.data);
                            validationRequete++;
                            if (validationRequete === 4) setRechargementDonnees(!rechargementDonnees);
                        })
                        .catch(error => {
                            console.error('Erreur de la requête PUT :', error);
                        });
                    axios.put(`http://localhost:8080/api/utilisateurs/amis/${response.data[0].id}`, {
                        champ: "requeteamis",
                        nouvelleValeur: compte.pseudo,
                        type: "sup"
                    })
                        .then(response => {
                            console.log('Réponse de la requête PUT :', response.data);
                            validationRequete++;
                            if (validationRequete === 4) setRechargementDonnees(!rechargementDonnees);
                        })
                        .catch(error => {
                            console.error('Erreur de la requête PUT :', error);
                        });
                }
            })
            .catch(error => {
                console.error('Erreur de la requête GET :', error);
            });
    }

    const refusAmi = () => {

    }

    return (
        <span>
            <div className='form'>
                Demande d'amis :
            </div>
            {listeDemandeAmis.map((demandeAmi, index) => {
                console.log(typeof (demandeAmi))
                console.log(demandeAmi)
                return <div key={index}>
                    <span className='form'>- {demandeAmi}</span>
                    <button className='buttonform' onClick={() => validationAmi({ ami: demandeAmi })}>Valider</button>
                    <button className='buttonform' onClick={refusAmi()}>Refuser</button>
                </div>
            })}
        </span>
    );
};

export default DemandeAmis;