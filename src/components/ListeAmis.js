import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHatWizard, faQuestion, faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons';
import Ami from './Ami';

const ListeAmis = ({ listeAmis }) => {

    const [amisAvecConnexion, setAmisAvecConnexion] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAmisConnexion = async () => {
            const amisListe = listeAmis.split(',');
            const amisAvecConnexion = [];

            for (const ami of amisListe) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/utilisateurs?pseudo=${ami}`);
                    const etatConnexion = response.data[0].etatconnexion;
                    const comptePublic = response.data[0].publique;
                    let listedamis = ""
                    if (comptePublic === true) {
                        listedamis = response.data[0].listeamis
                    }

                    let icone;
                    if (etatConnexion === 'connecté') {
                        icone = (
                            <FontAwesomeIcon
                                icon={faHatWizard}
                                style={{ color: "#04ff00" }}
                            />
                        );
                    } else if (etatConnexion === 'déconnecté') {
                        icone = (
                            <FontAwesomeIcon
                                icon={faHatWizard}
                                style={{ color: "#ff0000" }}
                            />
                        );
                    } else {
                        icone = (
                            <FontAwesomeIcon
                                icon={faQuestion}
                                style={{ color: "#00e1ff" }}
                            />
                        );
                    };

                    let publique;
                    if (comptePublic === false) {
                        publique = (
                            <FontAwesomeIcon
                                icon={faLock}
                                style={{ color: "#ff0000" }}
                            />
                        );
                    } else if (comptePublic === true) {
                        publique = (
                            <FontAwesomeIcon
                                icon={faLockOpen}
                                style={{ color: "#04ff00" }}
                            />
                        );
                    }

                    amisAvecConnexion.push({ ami, icone, publique, comptePublic, listedamis });
                } catch (error) {
                    console.error('Erreur de la requête GET :', error);
                }
            }

            setAmisAvecConnexion(amisAvecConnexion);
            setIsLoading(true); // Définir isLoading sur false une fois les données chargées
        };

        // Déclencher fetchAmisConnexion toutes les 2 secondes
        const intervalId = setInterval(() => {
            fetchAmisConnexion();
        }, 2000);

        // Nettoyer l'intervalle lorsque le composant est démonté
        return () => clearInterval(intervalId);
    }, [listeAmis]);

    return (
        <span>
            <div className='form'>
                Liste d'amis :
            </div>
            {isLoading ? (
                amisAvecConnexion.map(({ ami, icone, publique, listedamis, comptePublic }, index) => <Ami ami={ami} icone={icone} publique={publique} listedamis={listedamis} comptePublic={comptePublic} key={index} />
                )) : (
                listeAmis.split(',').map((ami, index) => (
                    <div key={index}>
                        <div className='form'>- {ami}</div>
                    </div>))
            )}
        </span>
    );
};

export default ListeAmis;
