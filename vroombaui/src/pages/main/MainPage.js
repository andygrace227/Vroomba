import { useState, useEffect, useRef } from "react";
import RoombaMap from "../../shared/components/RoombaMap";
import Config from "../../Config";
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }


function MainPage() {

    const [roombaPosition, setRoombaPosition] = useState([0,0,0]);


    const getRoombaPositionFromAPI = async () => {
      var coords = []
      var response = await fetch(Config.SERVER_IP + "/getPosition")
        .then(response => response.json())
        .catch(error =>  {return {x:0,y:0,heading:0};});
      coords[0] = response.x;
      coords[1] = response.y;
      coords[2] = response.heading;
      setRoombaPosition(e => coords);
    }

    useEffect( () => {
        const interval = setInterval(() => {
            getRoombaPositionFromAPI();
            
        }, 1000);


        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <>Welcome to Vroomba.</>
            <RoombaMap width={500} height={500} x={roombaPosition[0]} y={roombaPosition[1]} heading={roombaPosition[2]} ></RoombaMap>
        </>
    );
  }
  
export default MainPage;
  