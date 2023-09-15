import React, { useEffect, useState } from 'react';
import '../css/css.css';
import axios from 'axios';

const Inscription = ({ setCompte, compte }) => {
    const [pseudo, setPseudo] = useState('');
    const [pseudoLogic, setPseudoLogic] = useState(false);
    const [motDePasse, setMotDePasse] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        setPseudoLogic(false)
    }, [pseudo])

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
            motdepasse: motDePasse,
            etatconnexion: "connecté"
        };

        axios.get(`http://localhost:8080/api/utilisateurs?pseudo=${pseudo}`)
            .then(response => {
                console.log('Réponse de la requête GET :', response.data);
                if (response.data.length > 0) {
                    setPseudoLogic(true);
                } else {
                    setPseudoLogic(false);
                    axios.post('http://localhost:8080/api/utilisateurs/', data)
                        .then(response => {
                            console.log('Réponse de la requête POST :', response.data);
                            setId(response.data.id);
                        })
                        .catch(error => {
                            console.error('Erreur de la requête POST :', error);
                        });
                }
            })
            .catch(error => {
                console.error('Erreur de la requête GET :', error);
            });

    };

    useEffect(() => {
        if (id !== '') {
            setCompte({
                id: id,
                pseudo: pseudo,
                etatconnexion: "connecté"
            });
            console.log('Compte mis à jour :', {
                id: id,
                pseudo: pseudo,
                etatconnexion: "connecté"
            });
        }
    }, [id, pseudo, setCompte]);

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
                {pseudoLogic && <div className='attention'>Ce pseudo existe déjà</div>}
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
                <div className='form'>
                    <button type="submit" disabled={pseudoLogic}>S'inscrire</button>
                </div>
            </form>
        </div>
    );
};

export default Inscription;
