import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/css.css';
import DemandeAmis from './DemandeAmis';
import RequeteAmis from './RequeteAmis';
import ListeAmis from './ListeAmis';

const Accueil = ({ compte, setCompte }) => {

    const [pseudo, setPseudo] = useState('');
    const [pseudoDemandeAmis, setPseudoDemandeAmis] = useState(false);
    const [pseudoNonValide, setPseudoNonValide] = useState(false);
    const [rechargementDonnees, setRechargementDonnees] = useState(false);
    const [message, setMessage] = useState('');
    const [listeAmis, setListeAmis] = useState('');
    const [requeteAmis, setRequeteAmis] = useState('');
    const [demandeAmis, setDemandeAmis] = useState('');

    const deconnexion = () => {
        axios.put(`http://localhost:8080/api/utilisateurs/${compte.id}`, {
            etatconnexion: "déconnecté"
        })
            .then(response => {
                console.log('Réponse de la requête PUT :', response.data);
                setCompte(null)
                localStorage.removeItem('compte')
            })
            .catch(error => {
                console.error('Erreur de la requête PUT :', error);
            });
    }

    const publique = () => {
        axios.put(`http://localhost:8080/api/utilisateurs/${compte.id}`, {
            publique: !compte.publique
        })
            .then(response => {
                console.log('Réponse de la requête PUT :', response.data);
                setCompte(prevCompte => ({
                    ...prevCompte,
                    publique: !prevCompte.publique
                }));
            })
            .catch(error => {
                console.error('Erreur de la requête PUT :', error);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedPseudo = pseudo.trim();

        if (trimmedPseudo.length === 0) {
            setPseudoNonValide(true)
            return;
        }

        const data = {
            pseudo: trimmedPseudo
        };

        axios.get(`http://localhost:8080/api/utilisateurs/${compte.id}`)
            .then(response => {
                console.log('Réponse de la requête GET :', response.data);
                const listAmis = response.data["listeamis"] ? response.data["listeamis"].split(',') : [];
                if (listAmis.includes(data.pseudo)) {
                    setMessage(`${data.pseudo} est déjà votre ami`)
                } else if (data.pseudo === compte.pseudo) {
                    setMessage("Ceci est votre pseudo")
                } else {
                    axios.get(`http://localhost:8080/api/utilisateurs?pseudo=${data.pseudo}`)
                        .then(response => {
                            console.log('Réponse de la requête GET :', response.data);
                            if (response.data.length > 0) {
                                axios.put(`http://localhost:8080/api/utilisateurs/amis/${compte.id}`, {
                                    champ: "requeteamis",
                                    nouvelleValeur: data.pseudo,
                                    type: "add"
                                })
                                    .then(response => {
                                        setMessage(response.data.message);
                                        setRechargementDonnees(!rechargementDonnees);
                                    })
                                    .catch(error => {
                                        console.error('Erreur de la requête PUT :', error);
                                    });
                                axios.put(`http://localhost:8080/api/utilisateurs/amis/${response.data[0].id}`, {
                                    champ: "demandeamis",
                                    nouvelleValeur: compte.pseudo,
                                    type: "add"
                                })
                                    .then(response => {
                                        console.log('Réponse de la requête PUT :', response.data);
                                        setRechargementDonnees(!rechargementDonnees);
                                    })
                                    .catch(error => {
                                        console.error('Erreur de la requête PUT :', error);
                                    });
                            } else {
                                setPseudoDemandeAmis(true)
                            }
                        })
                        .catch(error => {
                            console.error('Erreur de la requête GET :', error);
                        });
                }

            })
            .catch(error => {
                console.error('Erreur de la requête GET :', error);
            });
    }


    useEffect(() => {
        setPseudoDemandeAmis(false)
        setPseudoNonValide(false)
        setMessage('')
    }, [pseudo])

    useEffect(() => {
        if (compte && compte.id) {
            axios.get(`http://localhost:8080/api/utilisateurs/${compte.id}`)
                .then(response => {
                    console.log('Réponse de la requête GET :', response.data);
                    const data = response.data;

                    if (data) {
                        setListeAmis(data.listeamis)
                        setDemandeAmis(data.demandeamis)
                        setRequeteAmis(data.requeteamis)
                    }
                })
                .catch(error => {
                    console.error('Erreur de la requête GET :', error);
                });
        }
    }, [compte, rechargementDonnees])


    return (
        <span>
            <div className='form'>Bienvenue</div>
            {compte !== null &&
                <div>
                    <div className='form'>Bonjour {compte.pseudo}, vous êtes actuellement {compte.etatconnexion}</div>
                    <div className='form'>
                        <button type="button" onClick={publique}>
                            {!compte.publique ? "Compte en privée" : "Compte en public"}
                        </button>
                    </div>
                    <div className='form'>
                        <button type="button" onClick={deconnexion}>Déconnexion</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='form'>
                            <label htmlFor="pseudo">Ajouter un ami :</label>
                            <input
                                type="text"
                                id="pseudo"
                                name="pseudo"
                                value={pseudo}
                                onChange={(e) => { setPseudo(e.target.value) }}
                            />
                        </div>
                        {pseudoDemandeAmis && <div className='attention form'>Ce pseudo n'existe pas</div>}
                        {pseudoNonValide && <div className='attention form'>Rentrer un pseudo valide</div>}
                        {message && <div className='form'>{message}</div>}
                        <div className='form'>
                            <button type="submit" disabled={pseudoDemandeAmis || pseudoNonValide || message}>Ajouter un ami</button>
                        </div>
                    </form>
                    {listeAmis && <ListeAmis listeAmis={listeAmis} />}
                    {requeteAmis && <RequeteAmis requeteAmis={requeteAmis} />}
                    {demandeAmis && <DemandeAmis demandeAmis={demandeAmis} compte={compte} setRechargementDonnees={setRechargementDonnees} rechargementDonnees={rechargementDonnees} />}
                </div>
            }
        </span>
    );
};

export default Accueil;