import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import caf from "./img/cafeteria.jpg";
import eat from "./img/eating.jpg";

function About() {
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontFamily: "Raleway",
          fontWeight: 900,
          marginTop: "20px",
        }}
      >
        Expand your Food Palette <br />
        with <red style={{ color: "#CC5216" }}>Ajidex</red>
      </h1>
      <Row style={{ marginTop: "30px" }}>
        <Col md={7}>
          <Image
            rounded
            fluid
            src={caf}
            style={{
              paddingLeft: "5vw",
              paddingBottom: "10px",
            }}
          />
        </Col>
        <Col md={5}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Raleway",
              fontWeight: 600,
              marginLeft: "3vw",
              marginRight: "3vw",
            }}
          >
            Add new and exciting dishes to your palette
          </h2>
          <p
            style={{
              textAlign: "left",
              fontFamily: "Roboto",
              fontSize: "15px",
              color: "gray",
              marginTop: "30px",
              marginLeft: "7vw",
              marginRight: "7vw",
            }}
          >
            Our promise to you: keep things exciting and provide the opportunity
            for community building with new friendly faces while exploring your
            food options. Through a customized experience of picking the
            textures that don’t work for you and us finding the most convenient
            restaraunts and you friendly foods, your food adventure is bound to
            be less boring and more enjoyable! Save your favorite restaraunts
            that fit your price range, texture preferences and are convient for
            you.
          </p>
          <Link to="/restaurants">
            <p
              style={{
                textAlign: "Center",
                fontFamily: "Roboto",
                fontSize: "15px",
                color: "#CC5216",
                fontWeight: 700,
              }}
            >
              View Restaurants
            </p>
          </Link>
        </Col>
      </Row>
      <Row
        className="flex-column-reverse flex-md-row"
        style={{ marginTop: "40px" }}
      >
        <Col md={5}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Raleway",
              fontWeight: 600,
              marginLeft: "3vw",
              marginRight: "3vw",
            }}
          >
            Meet a safe and understanding community
          </h2>
          <p
            style={{
              textAlign: "left",
              fontFamily: "Roboto",
              fontSize: "15px",
              color: "gray",
              marginTop: "30px",
              marginLeft: "7vw",
              marginRight: "7vw",
            }}
          >
            Connect with likeminded individuals through the profile and
            restaraunt sections. See who’s visited which tasty restaraunts and
            what their experience was like. Plan visits to new restaraunts with
            new friends! With likeminded individuals who understand the
            sensitivies with textures, you’ll feel less pressured in not being
            yourself. You’ll feel more excited to try new and exciting dishes!
          </p>
          <Link to="/signup">
            <p
              style={{
                textAlign: "Center",
                fontFamily: "Roboto",
                fontSize: "15px",
                color: "#CC5216",
                fontWeight: 700,
              }}
            >
              Create Profile
            </p>
          </Link>
        </Col>
        <Col md={7}>
          <Image
            rounded
            fluid
            src={eat}
            style={{
              paddingRight: "5vw",
              paddingBottom: "10px",
            }}
          />
        </Col>
      </Row>
      <p
        style={{
          textAlign: "Center",
          fontFamily: "Roboto",
          fontSize: "18px",
          color: "black",
          fontWeight: 700,
          marginTop: "40px",
        }}
      >
        Take charge of your new restaraunt experiences with{" "}
        <red style={{ color: "#CC5216" }}>Ajidex</red>.<br /> The first ever
        food texture sensitivity focused site.
      </p>
      <Row className="d-flex justify-content-center">
        <LinkContainer style={{ background: "#CC5216" }} to="/signup">
          <Button variant="outline-light" size="lg">
            Start Now
          </Button>
        </LinkContainer>
      </Row>
    </div>
  );
}

export default About;
