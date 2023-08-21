import logging
import time

from flask import jsonify
from flask import request

from VroombaAPI import app
from VroombaInterface import RoombaMode



@app.route('/listapi')
def listAllAPIs():
    try:
        robot = app.config["ROOMBA"]
        str = "";
        for api in robot.exposedAPIs:
            print(api)
            parameters = [key for key in robot.exposedAPIs[api]["signature"].parameters]
            parameters.pop(0)
            str += '{} '.format(robot.exposedAPIs[api]['name'])
            print("hello")
            parameterStr = ''
            for i in parameters:
                parameterStr += '{}, '.format(i)
                print("hey")
            str += '({})\n'.format(parameterStr)
            print("hiho")
        
        return jsonify(str)
    
    except Exception as e:
        return jsonify("Invalid Request: " + repr(e))



@app.route('/api', defaults={'path': ''})
@app.route('/api/<path:path>',  methods=['GET', 'POST'])
def accessAPI(path):
    try:
        robot = app.config["ROOMBA"]
        method = robot.exposedAPIs[path]
        arguments = []
        parameters = [key for key in method["signature"].parameters]
        parameters.pop(0)

        for parameterName in parameters:
            paramaterAnnotation = method["signature"].parameters[parameterName].annotation
            
            tempArg = (request.args.get(parameterName))
            if (paramaterAnnotation == float):
                arguments.append(float(tempArg))
            elif (paramaterAnnotation == int):
                arguments.append(int(tempArg))
            else:
                arguments.append(tempArg)


        returnValue = method["method"](*arguments)
        return jsonify(returnValue)

    except Exception as e:
        return jsonify("Invalid Request: " + repr(e))

