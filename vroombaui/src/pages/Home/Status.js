import { Row,Col } from "react-bootstrap";



const NIGHT_STRING = "Hey there, night owl!";
const MORNING_STRING = "Morning!";
const AFTERNOON_STRING = "Good afternoon!";
const EVENING_STRING = "Good evening!";

const CHECKING_ROOMBA_STATUS = "Attempting to connect...";
const ROOMBA_CONNECTED = "Connected to Vroomba."
const ROOMBA_NOT_CONNECTED = "Not connected to Vroomba."

function isBetween(input, one, two) {
    return one <= input && input <= two;
}

function generateWelcomeString() {
    const hour = new Date( Date.now()).getHours();
    let welcomeString = NIGHT_STRING;
    if (isBetween(hour, 5, 12)) {
        welcomeString = MORNING_STRING;
    }
    else if (isBetween(hour, 12, 17)) {
        welcomeString = AFTERNOON_STRING;
    }
    else if (isBetween(hour, 17, 20)) {
        welcomeString = EVENING_STRING;
    }
    return welcomeString;
}




function Status(props) {
    
    let welcomeString = generateWelcomeString();
    

    return (
        <>
        <Row>
            <Col className="text-center display-6" sm="12">
                {welcomeString}
            </Col>
        </Row>
        
        </>
    )
    
    




}

export default Status;