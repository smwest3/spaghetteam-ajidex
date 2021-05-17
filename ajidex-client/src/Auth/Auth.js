import React from 'react';
import PropTypes from 'prop-types';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import './Styles/Auth.css';

/**
 * @class Auth
 * @description This is an auth object that controls what page
 * is loaded based on sign up or sign in state
 */
const Auth = ({ type, setUser }) => {
    switch (type) {
        case "SignUp":
            return <SignUp setUser={setUser} />
        case "SignIn":
            return <SignIn setUser={setUser} />
        default:
            return <>Error, invalid path reached</>
    }
}

Auth.propTypes = {
    page: PropTypes.string.isRequired,
    setUser: PropTypes.func.isRequired
}

export default Auth;