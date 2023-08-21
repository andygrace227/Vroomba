import { useEffect, useRef } from "react";
import RoombaMap from "../../shared/components/RoombaMap";
import Config from "../../Config";
import RoombaAPI from "../../api/RoombaAPI";
import useRoombaPosition from "../../shared/useRoombaPosition";

function LiveDrive() {
  const keysPressed = useRef([]);
  const position = useRoombaPosition(1000);

  useEffect(() => {
    let roombaAPI = new RoombaAPI(Config.SERVER_IP);
    
    const estop = () => {
      roombaAPI.eStop();
    };

    const sendMoveCommand = () => {
      console.log(keysPressed.current);

      let velocity = 0;
      let angle = 0;
      let vacuumOn = 0;
      let sideOn = 0;
      let fullOn = 0;
      for (var s of keysPressed.current) {
        if (s == "a") angle += 1;
        if (s == "d") angle -= 1;
        if (s == "w") velocity += 0.25;
        if (s == "s") velocity -= 0.25;
        if (s == "e") vacuumOn = 1;
        if (s == "q") sideOn = 1;
        if (s == "f") fullOn = 1;
      }
      roombaAPI.driveNormal(velocity, angle);
      if (sideOn) {
        roombaAPI.toggleSide();
      }
      if (vacuumOn) {
        roombaAPI.toggleVacuum();
      }
      if (fullOn) {
        roombaAPI.activateFullMode();
      }
    };

    const registerKeyPress = (e) => {
      e.preventDefault();
      if (e.key == " ") {
        estop();
      } else {
        var kp = keysPressed.current;
        if (kp.includes(e.key) == false) {
          kp.push(e.key);
          keysPressed.current = kp;
          sendMoveCommand();
        }
      }
    };

    const unregisterKeyPress = (e) => {
      console.log("fired");
      var oldKeysPressed = keysPressed.current;
      oldKeysPressed = oldKeysPressed.filter((s) => s != e.key);
      keysPressed.current = oldKeysPressed;
      sendMoveCommand();
    };
    window.addEventListener("keydown", registerKeyPress);
    window.addEventListener("keyup", unregisterKeyPress);

    return () => {
      window.removeEventListener("keydown", registerKeyPress);
      window.removeEventListener("keyup", unregisterKeyPress);
    };
  });

  return (
    <>
      <RoombaMap width={500} height={500} x={position[0]} y={position[1]} heading={position[2]}></RoombaMap>
    </>
  );
}

export default LiveDrive;
