

class RoombaAlgorithm:
    """
    An interface that describes an algorithm used for mapping.
    """

    def requiresMapping() -> bool:
        pass
    
    def loadSavedMapData()