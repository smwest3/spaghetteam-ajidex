import React, { useState } from 'react';
import { useAuth0 } from "./react-auth0-spa";
import Toast from 'react-bootstrap/Toast';
import ToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';

export const LogToast = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const [show, setShow] = useState(true);

   const toggleShow = () => setShow(!show);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'relative',
        minHeight: '100px',
      }}
    >
      <Toast
        show={show}
        onClose={toggleShow}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">Sign in</strong>
          <small></small>
        </Toast.Header>
        <Toast.Body onClick={() => loginWithRedirect({})}>Click here to sign in and experience all our features!</Toast.Body>
      </Toast>
    </div>

  );
}

export default LogToast;
