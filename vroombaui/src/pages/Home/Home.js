import { Col, Container, Row, Button } from "react-bootstrap";
import Status from "./Status";
import RoombaCard from "../../shared/components/RoombaCard";
import RoombaMap from "../../shared/components/RoombaMap";
function Home(props) {
  let roombaX = 0;
  let roombaY = 0;
  let roombaH = 0;
  if (props.roombaPosX) {
    roombaX = props.roombaPosX;
    roombaY = props.roombaPosY;
    roombaH = props.roombaPosH;
  }

  return (
    <Container fluid className="home-container">
      <Row>
        <Col></Col>
        <Col sm="12" md="8" lg="6">
          <Row>
            <Col sm="12" md="12" lg="12">
              <RoombaCard>
                <Status />
              </RoombaCard>
            </Col>
          </Row>
          <Row>
            <Col sm="12" md="12" lg="12">
              <RoombaCard>
                <div className="text-center fw-bold display-6">Quick Actions</div>
                
                <Row>
                  <Col lg="4" md="6" sm="12" className="d-grid gap-2">
                    <div className="text-center fw-bold">Cleaning</div> 
                    <Button className="fw-bold" primary> Quick Clean </Button>
                    <Button className="fw-bold" primary> Full Clean </Button>
                    <Button className="fw-bold" primary> Remote Control </Button>
                  </Col>
                  <Col lg="4" md="6" sm="12" className="d-grid gap-2">
                    <div className="text-center fw-bold">Mapping</div> 
                    <Button className="fw-bold" primary> Automap </Button>
                  </Col>
                  <Col lg="4" md="6" sm="12" className="d-grid gap-2">
                    <div className="text-center fw-bold">Mapping</div> 
                    <Button className="fw-bold" primary> Automap </Button>
                  </Col>
                </Row>


              </RoombaCard>
            </Col>
          </Row>
          <Row>
            <Col sm="12" md="12" lg="12">
              <RoombaCard>
                <div className="text-center fw-bold display-6">Live Location</div>
                <div style={{ height: "50vh" }}>
                  <RoombaMap autoFit x={roombaX} y={roombaY} heading={roombaH} />
                </div>
              </RoombaCard>
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default Home;
