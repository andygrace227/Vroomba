import { useState, useEffect, useRef } from "react";
import RoombaMap from "../../shared/components/RoombaMap";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }


function MainPage() {

    const [roombaPosition, setRoombaPosition] = useState([0,0,0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoombaPosition(arr => [arr[0],arr[1], arr[2] + (Math.PI / 180)]);
            setRoombaPosition(arr => [Math.cos(arr[2]) + 1,Math.sin(arr[2]), arr[2]])
        }, 16);


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
  