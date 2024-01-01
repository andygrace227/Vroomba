import { Button, Offcanvas, Image} from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function SiteNavigation(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let buttonStyleDict = {
    "borderRadius": "50px",
    fontSize: "25px",
    fontWeight: "bold",
    padding: "10px",
    lineHeight: "1.0",
    "margin-left":"20px"
  };

  return (
    <>
      <Outlet />
      <Button className="shadow-lg fixed-bottom h2" onClick={handleShow} style={buttonStyleDict} variant="primary">
        <i className="bi bi-list"></i>
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex flex-grow-1 justify-content-center">

            <Image src="/images/logo.svg" style={{height:"100px"}}/>

          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists,
          etc.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SiteNavigation;
