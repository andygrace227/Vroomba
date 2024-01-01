from VroombaCtrl import VroombaActionReturnValue
from VroombaInterface.Roomba import Roomba
from abc import ABC, abstractmethod
from VroombaCtrl.VroombaAction import VroombaAction
from threading import Lock
from queue import Queue

class IVroombaProgram(ABC):
    def __init__(self):
        pass

    # Start the thread
    # Programs are modelled as one thread, held by the ctrler, and another that infinite loops and breaks once end_thread is called
    # It can also break on its own, in which case the program must have is_program_ended return false.
    # Programs can read from the Roomba directly, but must write any actions to the robot queue.
    @abstractmethod
    def start_thread(self, robot : Roomba, robotQueue: Queue, robotQueueLock : Lock ):
        pass

    # End the program
    @abstractmethod
    def end_thread(self):
        pass

    # Pass a value from the control program to this one
    @abstractmethod
    def return_value(self, rval : VroombaActionReturnValue):
        pass

    # Detect if the program has ended.
    @abstractmethod
    def is_program_ended(self) -> bool:
        pass

    # Detect if the program is running.
    @abstractmethod
    def is_program_running(self) -> bool:
        pass

