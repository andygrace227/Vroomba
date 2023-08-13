"""
    Play Darth Vader song
"""
from time import sleep

from PyRoombaAdapter import PyRoombaAdapter 

PORT = "/dev/tty.usbserial-B0010JYM"
adapter = PyRoombaAdapter(PORT)

adapter.change_mode_to_full()
adapter.reset()
adapter.change_mode_to_passive()

# # adapter.send_song_cmd(0, 76,
# #                       [69, 69, 69, 65, 72, 69, 65, 72, 69],
# #                       [20, 20, 20, 15, 5, 20, 15, 5, 80]
# #                       )
# # adapter.send_play_cmd(0)
# sleep(10.0)