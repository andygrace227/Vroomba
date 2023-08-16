import logging
import time

from flask import jsonify
from flask import request

from VroombaAPI import app
from VroombaInterface import RoombaMode

print("Hey")

@app.route('/getPosition', methods=['GET'], endpoint='getPosition')
def getPosition():
    robot = app.config['ROOMBA']
    robotCoords = {"x":robot.relPosition[0],"y": robot.relPosition[1],"heading": robot.heading}
    return jsonify(robotCoords)

@app.route('/getObstacles', methods=['GET'], endpoint='getObstacles')
def getObstacles():
    robot = app.config['ROOMBA']
    return jsonify(robot.obstacleInformation)


@app.route('/estop', methods=['GET'], endpoint='shutdown')
def shutdown():
    app.config['mode'] = RoombaMode.RoombaMode.KILLSWITCH
    robot = app.config['ROOMBA']
    robot.adapter.turn_off_power()
    return jsonify({"kill": "confirmed"})


@app.route('/setrcmode',  methods=['GET'], endpoint='changeToRCMOde')
def changeToRCMode():
    app.config['mode'] = RoombaMode.RoombaMode.RCMODE
    robot = app.config['ROOMBA']
    robot.adapter.change_mode_to_full()
    return jsonify({"mode": "rcmode"})

@app.route('/drive', methods=['GET'], endpoint='drive')
def drive():
    velstr = request.args.get("velocity")
    angstr = request.args.get("angle")
    print(velstr)
    print(angstr)
    
    velocity = float(velstr)
    angle = float(angstr)
    robot = app.config['ROOMBA']
    robot.normalDrive(velocity, angle)
    return jsonify({"status":"success"})
    



