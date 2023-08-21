import { useState, useEffect } from "react";
import RoombaAPI from "../api/RoombaAPI";
import Config from "../Config";


function useRoombaPosition(updateFrequency){
    const [position, setPosition] = useState([0,0,0]);

    useEffect( () => {
        let api = new RoombaAPI(Config.SERVER_IP);

        async function getPosition(){
            await api.getPosition();
            setPosition(api.position);
        }

        const interval = setInterval(() => {
            getPosition();
        }, updateFrequency);

        return () => clearInterval(interval)

    });

    return position;
}

export default useRoombaPosition;