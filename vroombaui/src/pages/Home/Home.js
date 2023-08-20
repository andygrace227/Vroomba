import { Col, Container, Row } from "react-bootstrap";
import Status from "./Status";

function Home(props) {
  return (
    <Container fluid className="home-container">
      <Row>
        <Col sm="12" md="4" lg="4">
          <Status/>
        </Col>
        <Col sm="12" md="4" lg="4">
          Map?
        </Col>
        <Col sm="12" md="4" lg="4">
          Quick Actions
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
