
import math
import pygame
from VroombaInterface import PyRoombaAdapter, Roomba, RobotObstacleSource

DAMPENING_FACTOR = 0.5
DEADZONE = 0.15
clock = pygame.time.Clock()

def deadzone_correct(input):
    if abs(input) < DEADZONE:
        return 0.0
    return input

def processVideoGameAnalogLogicNormalMode(roomba, event):
    value = event.value
    
    # Control the steering with the analog stick.
    if event.axis == 0:
        if roomba.driveInfo[0] >= 0:
            value = -1.0 * value
        roomba.driveInfo[1] = deadzone_correct(value)
    
    # Control forwards motion
    if event.axis == 5:
        value += 1
        value *= .5
        roomba.driveInfo[0] = deadzone_correct(value)

    # Control rear motion
    if event.axis == 4:
        value += 1
        value *= -0.5
        roomba.driveInfo[0] = deadzone_correct(value)

def processVideoGameControllerLogic(roomba, event):
    # Events from the triggers and sticks
    if event.type == pygame.JOYAXISMOTION:
        processVideoGameAnalogLogicNormalMode(roomba, event)
        
    if event.type == pygame.JOYBUTTONDOWN:
        if event.button == 0:
            if roomba.vacuumState["fan"]:
                roomba.deactivateFan()
            else:
                roomba.activateFan()
        if event.button == 1:
            if roomba.vacuumState["side"]:
                roomba.deactivateSide()
            else:
                roomba.activateSide()
        if event.button == 3:
            if roomba.vacuumState["roller"]:
                roomba.deactivateRoller()
            else:
                roomba.activateRoller()
        if event.button == 2:
            return False

    return True



def main():
    
    pygame.init()
    joysticks = []
    clock = pygame.time.Clock()
    keepGoing = True

    # for al the connected joysticks
    for i in range(0, pygame.joystick.get_count()):
        # create an Joystick object in our list
        joysticks.append(pygame.joystick.Joystick(i))
        # initialize the appended joystick (-1 means last array item)
        joysticks[-1].init()
        # print a statement telling what the name of the controller is
        print ("Detected joystick "),joysticks[-1].get_name(),"'"

    # Set up the roomba
    PORT = "/dev/tty.usbserial-B0010JYM"
    adapter = PyRoombaAdapter(PORT)
    adapter.change_mode_to_full()
 
    roomba = Roomba(adapter)
    roomba.addObstacleSource(RobotObstacleSource())

    while(keepGoing):
        for event in pygame.event.get():
            keepGoing = processVideoGameControllerLogic(roomba, event)
        
        if len(roomba.obstacleInformation) != 0:
            roomba.beep(65,5)

        roomba._updateRoombaDriveState()
        roomba.calculateObstacles()
        clock.tick(60)


    adapter.change_mode_to_passive()

if __name__ == "__main__":
    main()
