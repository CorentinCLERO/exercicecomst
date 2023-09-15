import React from 'react';
import '../css/css.css';
import { NavLink } from 'react-router-dom';

const Header = ({ compte }) => {
    return (
        <div className='header'>
            <NavLink to="/" className='no-underline'><span className='button'>Accueil</span></NavLink>
            {compte === null && <NavLink to="/Inscription" className='no-underline'><span className='button'>Inscription</span></NavLink>}
            {compte === null && <NavLink to="/Connection" className='no-underline'><span className='button'>Connection</span></NavLink>}
        </div>
    );
};

export default Header;