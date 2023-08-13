from PyRoombaAdapter import PyRoombaAdapter


class Roomba:

    def __init__(self, adapter : PyRoombaAdapter, debug = True):
        self.adapter = adapter
        self.relPosition = [0.0,0.0]
        self.driveInfo = [0.0,0.0]
        self.vacuumState = {"side": False, "roller": False, "fan": False}
        self.obstacleSources = []
        self.obstacleInformation = []
        self.tankMode = False
        self.debug = debug
        

    def _updateRoombaFanState(self):
        self.adapter.send_moters_cmd(main_brush_on=self.vacuumState['roller'], 
                                     main_brush_direction_is_ccw=True, 
                                     side_brush_direction_is_inward=True, 
                                     side_brush_on=self.vacuumState["side"], 
                                     vacuum_on=self.vacuumState['fan'] )

    def _updateRoombaRegularDriveState(self):
        self.adapter.move(self.driveInfo[0],self.driveInfo[1])

    def _updateRoombaDirectDriveState(self):
        self.adapter.send_drive_direct(self.driveInfo[1], self.driveInfo[0])

    def _updateRoombaDriveState(self):
       
        if self.tankMode:
            self._updateRoombaDirectDriveState()
        else:
            self._updateRoombaRegularDriveState()

    def normal_drive(self, velocity, rotation):
        self.tankMode = False
        self.driveInfo = [velocity, rotation]
        self._updateRoombaDriveState()

    def tank_drive(self, left, right):
        self.tankMode = True
        self.driveInfo = [left, right]
        self._updateRoombaDriveState()

    def activateFan(self):
        self.vacuumState["fan"] = True
        self._updateRoombaFanState()

    def deactivateFan(self):
        self.vacuumState["fan"] = False
        self._updateRoombaFanState()

    def activateRoller(self):
        self.vacuumState["roller"] = True
        self._updateRoombaFanState()

    def deactivateRoller(self):
        self.vacuumState["roller"] = False
        self._updateRoombaFanState()

    def activateSide(self):
        self.vacuumState["side"] = True
        self._updateRoombaFanState()

    def deactivateSide(self):
        self.vacuumState["side"] = False
        self._updateRoombaFanState()
    
    def addObstacleSource(self, obstacleSource):
        self.obstacleSources.append(obstacleSource)

    def calculateObstacles(self):
        self.obstacleInformation = []
        for i in range(0, len(self.obstacleSources)):
            self.obstacleInformation.append(self.obstacleSources[i].calculate(self))

    def beep(self, note, duration):
        self.adapter.send_song_cmd(0, 1, [note], [duration])
        self.adapter.send_play_cmd(0)

    def getRobotBumpAndWheelSensors(self) -> list[int]:
        return self.adapter.request_bump_and_wheels()
    
    def getRobotProximitySensorsSummary(self) -> list[int]:
        return self.adapter.request_light_bumper_summary()

    
    

    
