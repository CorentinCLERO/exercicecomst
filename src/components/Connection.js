import React, { useState } from 'react';
import '../css/css.css';
import axios from 'axios';

const Connection = ({ setCompte, compte }) => {

    const [pseudo, setPseudo] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [id, setId] = useState(false);

    const handlePseudoChange = (e) => {
        setPseudo(e.target.value);
    };

    const handleMotDePasseChange = (e) => {
        setMotDePasse(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Pseudo:', pseudo);
        console.log('Mot de passe:', motDePasse);

        const data = {
            pseudo: pseudo,
            motdepasse: motDePasse
        };

        axios.post(`http://localhost:8080/api/utilisateurs/test`, data)
            .then(response => {
                console.log('Réponse de la requête POST connection :', response.data);
                setCompte({ "id": response.data.id, "pseudo": response.data.pseudo, "etatconnexion": response.data.etatconnexion, "publique": response.data.publique })
                setId(false);
                axios.put(`http://localhost:8080/api/utilisateurs/${response.data.id}`, {
                    etatconnexion: "connecté"
                })
                    .then(response => {
                        console.log('Réponse de la requête PUT :', response.data);
                    })
                    .catch(error => {
                        console.error('Erreur de la requête PUT :', error);
                    });
            })
            .catch(error => {
                console.error('Erreur de la requête POST connection :', error);
                setId(true);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='form'>
                    <label htmlFor="pseudo">Pseudo :</label>
                    <input
                        type="text"
                        id="pseudo"
                        name="pseudo"
                        value={pseudo}
                        onChange={handlePseudoChange}
                    />
                </div>
                <div className='form'>
                    <label htmlFor="motDePasse">Mot de passe :</label>
                    <input
                        type="password"
                        id="motDePasse"
                        name="motDePasse"
                        value={motDePasse}
                        onChange={handleMotDePasseChange}
                    />
                </div>
                {id && <div className='attention'>Le pseudo ou le mot de passe est erroné</div>}
                <div className='form'>
                    <button type="submit">Se connecter</button>
                </div>
            </form>
        </div>
    );
};

export default Connection;