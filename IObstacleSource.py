import Roomba
from abc import ABC, abstractmethod

class ObstacleSource(ABC):
    def __init__(self):
        pass
    @abstractmethod
    def calculate(self, robot : Roomba) -> list[list[float]]:
        pass;