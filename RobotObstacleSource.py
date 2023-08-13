from IObstacleSource import ObstacleSource
import Roomba
import math

class RobotObstacleSource(ObstacleSource):

    def __init__(self):
        self.ROOMBA_RADIUS = 170
        self.LIGHT_RADIUS = 180

    def calculate(self, robot : Roomba) -> list:
        # Process the light sensors first
        light_bumper_info = robot.getRobotProximitySensorsSummary()
        bumper_info = robot.getRobotBumpAndWheelSensors()
        obstacleList = []

        for i in range(0, 6):
            # Start angle is approx 60 from the robot
            # 60 +- covered by light sensors, evenly spaced
            # Every sensor 20 degrees apart
            if light_bumper_info[i] == 1:
                angle = ((60 - (20 * i)) * math.pi)/180
                obstacleList.append([self.LIGHT_RADIUS * math.cos(angle),
                                     self.LIGHT_RADIUS * math.sin(angle)])
                
                robot.beep(i + 50, 10)

        if bumper_info[0] == 1 and bumper_info[1] == 1:
            obstacleList.append([self.ROOMBA_RADIUS, 0])
            robot.beep(31, 20)
        
        elif bumper_info[0] == 1:
            obstacleList.append([0,self.ROOMBA_RADIUS])

        elif bumper_info[1] == 1:
            obstacleList.append([0, -1.0 * self.ROOMBA_RADIUS])
        
        return obstacleList




