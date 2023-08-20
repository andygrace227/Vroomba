import { useState, useEffect, useRef } from "react";
import RoombaMap from "../../shared/components/RoombaMap";
import Config from "../../Config";


function LiveDrive() {

    const [roombaPosition, setRoombaPosition] = useState([0,0,0]);
    const keysPressed = useRef([])

  const estop = () => {
    fetch(Config.SERVER_IP + "/estop")
  }

  const sendMoveCommand = () => {
    var velocity = 0;
    var angle = 0;      
    for(var s of keysPressed.current){
      if(s == "a") angle += 1;
      if(s == "d") angle -= 1;
      if(s == "w") velocity += 0.25;
      if(s == "s") velocity -= 0.25;
    }
    fetch(Config.SERVER_IP + "/drive?velocity=" + velocity + "&angle=" + angle)
  }

  const registerKeyPress = (e) => {
    e.preventDefault();
    if (e.key == " "){
      estop()
    }
    else{
      var kp = keysPressed.current;
      if (kp.includes(e.key) == false){
        kp.push(e.key);
        keysPressed.current = kp;
        sendMoveCommand()
      }
    }
  }

  const unregisterKeyPress = (e) => {
    var oldKeysPressed = keysPressed.current;
    oldKeysPressed = oldKeysPressed.filter(s => s != e.key);

    keysPressed.current = oldKeysPressed;
    sendMoveCommand()
  }

  window.addEventListener("keydown", registerKeyPress)
  window.addEventListener("keyup", unregisterKeyPress)


    const getRoombaPositionFromAPI = async () => {
      var coords = []
      var response = await fetch(Config.SERVER_IP + "/getPosition")
        .then(response => response.json())
        .catch(error =>  {return {x:0,y:0,heading:0};});
      coords[0] = response.x;
      coords[1] = response.y;
      coords[2] = response.heading;
      console.log(coords);
      setRoombaPosition(e => coords);
    }

    useEffect( () => {
        const interval = setInterval(() => {
            getRoombaPositionFromAPI();
            
        }, 100);


        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <>Welcome to Vroomba.</>
            <RoombaMap width={500} height={500} x={roombaPosition[0]} y={roombaPosition[1]} heading={roombaPosition[2]} ></RoombaMap>
        </>
    );
  }
  
export default LiveDrive;
  