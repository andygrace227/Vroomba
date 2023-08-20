from VroombaInterface.PyRoombaAdapter import PyRoombaAdapter
import math
import inspect


"""
An annotation to make exposing APIs easier
"""
def exposeAPI(func):
    func._isExposedAPI = True
    func._signature = inspect.signature(func)
    return func



class Roomba:
    """
    A class representing a Roomba robot. 
    
    Uses PyRoombaAdapter as a driver to communicate with the hardware.

    :param adapter : A PyRoombaAdapter

    """

    PI_OVER_2 = math.pi / 2

    DEG_2_RAD = math.pi / 180

    def __init__(self, adapter : PyRoombaAdapter):
        self.adapter = adapter
        self.relPosition = [0.0,0.0]
        self.heading = 0.0
        self.driveInfo = [0.0,0.0]
        self.vacuumState = {"side": False, "roller": False, "fan": False}
        self.obstacleSources = []
        self.obstacleInformation = []
        self.tankMode = False
        self.exposedAPIs = {}
        self._registerExposedAPIs()

    def _registerExposedAPIs(self):
        for i in dir(self.__class__):
            if hasattr(getattr(self, i), "_isExposedAPI"):
                methodDict = {}
                methodDict["name"] = i
                methodDict["signature"] = getattr(getattr(self, i),"_signature")
                methodDict["method"] = getattr(self, i) 
                self.exposedAPIs[i]=(methodDict)

        
    @exposeAPI
    def getHeading(self):
        return self.heading

    @exposeAPI
    def getPosition(self):
        return [self.relPosition[0], self.relPosition[1], self.heading]

    @exposeAPI
    def getObstacleInformation(self):
        return self.obstacleInformation
    
    @exposeAPI
    def activateFullMode(self):
        self.adapter.change_mode_to_full()
        return True
    
    @exposeAPI
    def shutdown(self):
        self.adapter.turn_off_power()
        return True
    
    @exposeAPI
    def activatePassiveMode(self):
        self.adapter.change_mode_to_passive()
        return True

    @exposeAPI
    def activateSafeMode(self):
        self.adapter.change_mode_to_safe()
        return True
    

    def _updateRoombaFanState(self):
        """
        Update the roomba's fan state.
        
        This is called when the fans, rollers, or side brushes are (de)activated
        """
        self.adapter.send_moters_cmd(main_brush_on=self.vacuumState['roller'], 
                                     main_brush_direction_is_ccw=True, 
                                     side_brush_direction_is_inward=True, 
                                     side_brush_on=self.vacuumState["side"], 
                                     vacuum_on=self.vacuumState['fan'] )

    def _updateHeading(self):
        deltaDegrees = self._getAngleTurnedSinceLastSent()
        self.heading += deltaDegrees * self.DEG_2_RAD

    def updatePosition(self):
        if self.tankMode == False:
            velocity = self.driveInfo[0]
            radius = 0
            if self.driveInfo[0] == 0:
                velocity = math.fabs(self.driveInfo[1]) * (self.adapter.WHEEL_SPAN / 2.0)
                if self.driveInfo[1] >= 0:
                    radius = 1
                else:  # default is 'CCW' (turning left)
                    radius = -1
            if self.driveInfo[1] != 0:
                radius = velocity / self.driveInfo[1]
            
            # Now we have the radius of the circle. So we get the distance of the robot
            distanceAlongArc = self._getDistanceMovedSinceLastSent() / 1000

            if radius != 0:
                
                # calculatedCircleCoords = [radius * math.cos(calculatedCircleAngleRadians),
                #                           radius * math.sin(calculatedCircleAngleRadians)]

                orthogonal = self.heading + self.PI_OVER_2
                newPos = [radius * math.cos(orthogonal), radius * math.sin(orthogonal)]
                newPos[0] += self.relPosition[0]
                newPos[1] += self.relPosition[1]


                circleAngleRadians = distanceAlongArc / radius
                if radius < 0 :
                    circleAngleRadians *= -1
                
                deltaAng = circleAngleRadians + self.heading - self.PI_OVER_2
                newPos[0] += radius * math.cos(deltaAng)
                newPos[1] += radius * math.sin(deltaAng)
                self.relPosition = newPos


            else:
                self.relPosition[0] += distanceAlongArc * math.cos(self.heading)
                self.relPosition[1] += distanceAlongArc * math.sin(self.heading)

            self._updateHeading()

            


    def _updateRoombaRegularDriveState(self):
        """
        Update the roomba's motor instructions.

        This method will interpret driveInfo as velocity and yaw
        """

        self.adapter.move(self.driveInfo[0],self.driveInfo[1])

    def _updateRoombaDirectDriveState(self):
        """
        Update the roomba's motor instructions.

        This method will interpret driveInfo as leftWheelSpeed, rightWheelSpeed 
        """
        self.adapter.send_drive_direct(self.driveInfo[1], self.driveInfo[0])

    def _updateRoombaDriveState(self):
        """
        Update the roomba's motor instructions with the appropriate command
        """
       
        if self.tankMode:
            self._updateRoombaDirectDriveState()
        else:
            self._updateRoombaRegularDriveState()

    @exposeAPI
    def normalDrive(self, velocity : float, rotation : float):
        """
        Drive with velocity and yaw

        :param velocity: The speed of the roomba

        :param rotation: The angle in which the roomba should go.
        """

        self.tankMode = False
        self.driveInfo = [velocity, rotation]
        self._updateRoombaDriveState()

    @exposeAPI
    def tank_drive(self, left, right):
        self.tankMode = True
        self.driveInfo = [left, right]
        self._updateRoombaDriveState()

    @exposeAPI
    def activateFan(self):
        self.vacuumState["fan"] = True
        self._updateRoombaFanState()

    @exposeAPI
    def deactivateFan(self):
        self.vacuumState["fan"] = False
        self._updateRoombaFanState()

    @exposeAPI
    def activateRoller(self):
        self.vacuumState["roller"] = True
        self._updateRoombaFanState()

    @exposeAPI
    def deactivateRoller(self):
        self.vacuumState["roller"] = False
        self._updateRoombaFanState()

    @exposeAPI
    def activateSide(self):
        self.vacuumState["side"] = True
        self._updateRoombaFanState()

    @exposeAPI
    def deactivateSide(self):
        self.vacuumState["side"] = False
        self._updateRoombaFanState()
    
    @exposeAPI
    def addObstacleSource(self, obstacleSource):
        self.obstacleSources.append(obstacleSource)

    @exposeAPI
    def calculateObstacles(self):
        self.obstacleInformation = []
        for i in range(0, len(self.obstacleSources)):
            self.obstacleInformation.append(self.obstacleSources[i].calculate(self))

    @exposeAPI
    def beep(self, note : int, duration : int):
        self.adapter.send_song_cmd(0, 1, [note], [duration])
        self.adapter.send_play_cmd(0)

    @exposeAPI
    def getRobotBumpAndWheelSensors(self) -> list[int]:
        return self.adapter.request_bump_and_wheels()
    
    @exposeAPI
    def getRobotProximitySensorsSummary(self) -> list[int]:
        return self.adapter.request_light_bumper_summary()
    
    def _getDistanceMovedSinceLastSent(self):
        return self.adapter.request_distance()
    
    def _getAngleTurnedSinceLastSent(self):
        return self.adapter.request_angle()


    
    

    
