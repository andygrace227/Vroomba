import logging
import threading
import resource
import time
# from VroombaInterface import Roomba, PyRoombaAdapter, RobotObstacleSource, RoombaMode
from VroombaInterface.PyRoombaAdapter import PyRoombaAdapter
from VroombaInterface.Roomba import Roomba
from VroombaInterface.RobotObstacleSource import RobotObstacleSource
from VroombaInterface.RoombaMode import RoombaMode
from VroombaAPI import app
import sys


DEFAULT_ROOMBA_PORT = "/dev/tty.usbserial-B0010JYM"
DEFAULT_WEB_PORT = 3001

def webserver(mode, roomba, wport):
    app.config['MODE'] = mode
    app.config['ROOMBA'] = roomba
    # It isn't safe to use the reloader in a thread
    app.run(host='0.0.0.0' , port=wport, debug=True, use_reloader=False)





def main():
    print("Welcome to Vroomba Web Server.")
    
    mode = RoombaMode.PASSIVE
    adapter = None
    while adapter == None:
        port = input(f"What port is your roomba on? (Enter nothing for default: {DEFAULT_ROOMBA_PORT})" )
        if port.strip() == "":
            port = DEFAULT_ROOMBA_PORT
        print("Attempting to connect to Roomba...")
        try:
            adapter = PyRoombaAdapter(port)
        except Exception as e:
            print(e)
            print("Couldn't connect to roomba on specified port. Try again.")
    
    print("Device connected! Defining Roomba object.")
    roomba = Roomba(adapter)
    roomba.addObstacleSource(RobotObstacleSource())

    webPort = input(f"What port should the API run on? (Enter nothing for default: {DEFAULT_WEB_PORT})" )
    if webPort.strip() == "":
        webPort = DEFAULT_WEB_PORT
    else: 
        webPort = int(webPort)
    
    print("Starting API server...")
    serverThread = threading.Thread(target=webserver, args=(mode, roomba, webPort))
    serverThread.start()

    print("Server started! ")

    while (mode != RoombaMode.KILLSWITCH) :
        time.sleep(0.02)
        roomba.updatePosition()
        roomba.calculateObstacles()

    serverThread.join()
    print("Ending server...")
    adapter.change_mode_to_passive()
    print("Roomba back in default mode.")

if __name__ == "__main__":
    main()