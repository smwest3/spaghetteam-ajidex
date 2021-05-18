import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import { LinkContainer } from "react-router-bootstrap";

export const LogToast = () => {
  const [show, setShow] = useState(true);

  const toggleShow = () => setShow(!show);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "relative",
      }}
    >
      <Toast
        show={show}
        onClose={toggleShow}
        style={{
          position: "fixed",
          top: 70,
          right: 0,
          zIndex: 1,
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">Sign in</strong>
          <small></small>
        </Toast.Header>
        <LinkContainer to="/signin" onClick={toggleShow}>
          <Toast.Body>
            Click here to sign in and experience all our features!
          </Toast.Body>
        </LinkContainer>
      </Toast>
    </div>
  );
};

export default LogToast;
