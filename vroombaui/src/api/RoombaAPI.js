
class RoombaAPI{

    constructor(url) {
        this.roombaApiUrl = url + "/api";
        this.isConnected = false;
        this.position = [];
        this.actuatorStatus = {vac:false, side: false};
    }

    async generalFetch(path, parameters, dumpar ) {
        let response = await fetch(this.roombaApiUrl + '/' + path + '?' + new URLSearchParams(parameters),
            {
                method: "POST",
                mode: "cors", 
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(data => data.json())
            .catch("eror")
        return response;
    }

    driveNormal(velocity, angle) {
        let moveObj = {"velocity": velocity, "rotation": angle};
        this.generalFetch("normalDrive",moveObj, "fda");
        
    }

    toggleVacuum(){
        if (this.actuatorStatus["vac"] == false){
            this.generalFetch("activateRoller", {}, "");
            this.generalFetch("activateFan", {}, "");
        }
        else {
            this.generalFetch("deactivateRoller", {}, "");
            this.generalFetch("deactivateFan", {}, "");
        }
        this.actuatorStatus["vac"] = !this.actuatorStatus["vac"];
    }

    toggleSide() {
        if (this.actuatorStatus["side"] == false){
            this.generalFetch("activateSide", {}, "");
        }
        else {
            this.generalFetch("deactivateSide", {}, "");
        }
        this.actuatorStatus["side"] = !this.actuatorStatus["side"];
    }

    async getPosition() {
        this.position = await this.generalFetch("getPosition", {}, (data) => {this.isConnected = false}); 
    }

    eStop() {
        this.generalFetch("shutdown", {},(data) => {this.isConnected = false} );
    }

    activateFullMode() {
        this.generalFetch("activateFullMode", {},(data) => {this.isConnected = false} );
    }






}

export default RoombaAPI;