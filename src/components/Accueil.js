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
    const [statusRequete, setStatusRequete] = useState(0);
    const [listeAmis, setListeAmis] = useState([]);
    const [requeteAmis, setRequeteAmis] = useState([]);
    const [demandeAmis, setDemandeAmis] = useState([]);

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

        const data = {
            pseudoaajouter: pseudo,
            pseudoutilisateur: compte.pseudo,
            idutilisateur: compte.id
        };

        axios.post(`http://localhost:8080/api/utilisateurs/demandeamis`, data)
            .then(response => {
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


    useEffect(() => {
        setPseudoDemandeAmis(false)
        setPseudoNonValide(false)
        setMessage('')
    }, [pseudo])

    useEffect(() => {
        if (compte && compte.id) {
            axios.get(`http://localhost:8080/api/utilisateurs/${compte.id}`)
                .then(response => {
                    console.log('Réponse de la requête GET rechargement data:', response.data);
                    const data = response.data;

                    if (data) {
                        setListeAmis(data[0].leslistemamis.map((listeami) => listeami.pseudoAmi));
                        setDemandeAmis(data[0].lesdemandeamis.map((demandeami) => demandeami.pseudoAmi));
                        setRequeteAmis(data[0].lesrequeteamis.map((requeteami) => requeteami.pseudoAmi));
                    }

                    console.log("data reponse get : ", data);
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
                        {message && (
                            <div className="form">
                                {statusRequete === 500 && <div className="serveurerreur">{message}</div>}
                                {statusRequete === 400 && <div className="attention">{message}</div>}
                                {statusRequete === 200 && <div className="valider">{message}</div>}
                            </div>
                        )}
                        <div className='form'>
                            <button type="submit" disabled={pseudoDemandeAmis || pseudoNonValide || message}>Ajouter un ami</button>
                        </div>
                    </form>
                    {listeAmis.length > 0 && <ListeAmis listeAmis={listeAmis} />}
                    {requeteAmis.length > 0 && <RequeteAmis requeteAmis={requeteAmis} />}
                    {demandeAmis.length > 0 && <DemandeAmis demandeAmis={demandeAmis} compte={compte} setRechargementDonnees={setRechargementDonnees} rechargementDonnees={rechargementDonnees} />}
                    <button onClick={() => console.log(requeteAmis)} title='consolelog' >consolelog</button>
                </div>
            }
        </span>
    );
};

export default Accueil;