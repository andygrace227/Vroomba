from threading import Thread, Lock
from queue import Queue
import threading
from time import sleep
from VroombaCtrl import VroombaAction, VroombaActionReturnValue
from VroombaCtrl.IVroombaProgram import IVroombaProgram
from VroombaInterface import Roomba
from datetime import time
import inspect

# The "Operating System" of the roomba
# Kind of like a scheduler for the robot.

# Exposes some queue operations that make the robot easier

"""
An annotation to make exposing APIs easier
"""
def exposeAPI(func):
    func._isExposedAPI = True
    func._signature = inspect.signature(func)
    return func

class VroombaCtrl:

    def __init__(self):
        self.programs = []
        self.roomba = {}
        self.robotActionQueues = Queue()
        self.managementQueue = Queue()
        self.robotLock = Lock()
        self.MAX_LOOP_TIME = 15
        self.PROGRAM_RUN_TIME = 50
        self.shutDown = False
        self.mainThread = None

    @exposeAPI
    def attach_roomba(self, r : Roomba):
        self.roomba = r

    @exposeAPI
    def shutdown(self):
        self.shutDown = True
        self.main_thread.join()

    @exposeAPI
    def add_program(self, p : IVroombaProgram):
        self.programs.append(p)

    def getTimeWithMs(self):
        return time.time() * 1000
    
    def attemptRoombaAction(self, command : VroombaAction):
        try: 
            method = ""
            if (self.roomba.exposedAPIs[command.action]):
                method = self.roomba.exposedAPIs[command.action]
            
            elif (self.exposedAPIs[command.action]):
                method = self.exposedAPIs[command.action]
            arguments = []
            parameters = [key for key in method["signature"].parameters]
            parameters.pop(0)
            for parameterName in parameters:
                paramaterAnnotation = method["signature"].parameters[parameterName].annotation
                tempArg = (command.actions.get(parameterName))
                if (paramaterAnnotation == float):
                    arguments.append(float(tempArg))
                elif (paramaterAnnotation == int):
                    arguments.append(int(tempArg))
                else:
                    arguments.append(tempArg)
            returnValue = method["method"](*arguments)
            self.programs[command.caller].return_value( VroombaActionReturnValue(command.id, returnValue))

        except Exception as e:
            print("Invalid action attempted:" + e)
        
    def main_loop(self):
        self.robotLock.acquire()
        startTime = self.getTimeWithMs()

        # Send actions to the roomba
        while (self.getTimeWithMs - startTime < self.MAX_LOOP_TIME):
            i = self.robotActionQueue.get_nowait()
            if type(i) != None:
                if type(i) == VroombaAction:
                    self.attemptRoombaAction(i)
            else:
                break
        # Clear out ended programs
        for p in self.programs:
            if p.is_program_ended == True:
                self.programs.remove(p)
        
        # Start the programs that aren't running
        for p in self.programs:
            if p.is_program_running == False:
                p.start_thread(self.roomba, self.robotActionQueues, self.robotLock)
        
        self.robotLock.release()

    def main_thread(self):
        while(self.shutDown == True):
            self.main_loop()
            sleep(self.PROGRAM_RUN_TIME / 1000);

    @exposeAPI
    def start_main_thread(self):
        self.mainThread = threading.Thread(target=self.main_thread, args=(self))
        self.main_thread.start()