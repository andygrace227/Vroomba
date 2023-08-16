import { useEffect, useState, useRef } from "react";

function RoombaMap(props) {
  // x in meters,y in meters,heading in radians

  var roombaPosition = [props.x, props.y, props.heading];
  // center x in meters, center y in meters, scale in pixels per meter
  const [viewport, setViewport] = useState([1, 0, 250]);
  const [mouseInfo, setMouseInfo] = useState({ drag: false, x: 0, y: 0, origViewX: 0, origViewY:0});
  const canvasRef = useRef(null);

  const changeZoom = (e) => {
    setViewport((arr) => [arr[0], arr[1], Math.min(Math.max(arr[2] - e.deltaY * 0.05, 40), 500)]);
  };

  const changePosition = (e) => {
    setMouseInfo((prev)=>{
        if (prev["drag"] == true) {
            setViewport((arr) => {
                return [prev.origViewX - (( e.clientX - prev.x) / arr[2]), prev.origViewY - ((prev.y - e.clientY) / arr[2]), arr[2]]});
        }
        return prev;
    })
    
  };

  const startDrag = (e) => {
    setMouseInfo((prevState) => {
      let newState = { ...prevState };
      newState.drag = true;
      newState.x = e.clientX;
      newState.y = e.clientY;
      newState.origViewX = viewport[0];
      newState.origViewY = viewport[1];
      return newState;
    });
  };

  const endDrag = (e) => {
    setMouseInfo((prevState) => {
    let newState = { ...prevState };
    newState.drag = false;
    newState.x = e.clientX;
    newState.y = e.clientY;
    return newState;
    });
  };

  var canvas = (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      onWheel={changeZoom}
      onMouseDown={startDrag}
      onMouseUp={endDrag}
      onMouseMove={changePosition}
    ></canvas>
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const screen = [canvas.width, canvas.height];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderRoomba(ctx, roombaPosition, viewport, screen);
    renderGrid(ctx, viewport, screen);
  }, [props.x, props.y, props.heading]);

  return canvas;
}

function translateCoords(coords, viewport, screen) {
  // From the unit to the screen... how fun.
  var viewport_translation = [viewport[2] * (coords[0] - viewport[0]), viewport[2] * (coords[1] - viewport[1])];
  return [viewport_translation[0] + screen[0] / 2, -1.0 * viewport_translation[1] + screen[1] / 2];
}

function scaleNumber(num, viewport) {
  return viewport[2] * num;
}

function renderRoomba(ctx, position, viewport, screen) {
  ctx.lineCap = "round";
  ctx.beginPath();
  var heading = Math.PI / 2 + position[2];
  var sscoords = translateCoords([position[0], position[1]], viewport, screen);
  var hscoords = translateCoords(
    [position[0] + 0.34 * Math.cos(heading), position[1] + 0.34 * Math.sin(heading)],
    viewport,
    screen
  );

  ctx.lineWidth = 10;

  ctx.arc(
    sscoords[0],
    sscoords[1],
    viewport[2] * 0.34,
    -1.0 * heading + (5 * Math.PI) / 4 - Math.PI,
    -1.0 * heading - (5 * Math.PI) / 4 - Math.PI
  );
  ctx.stroke();

  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(sscoords[0], sscoords[1]);
  ctx.lineTo(hscoords[0], hscoords[1]);
  ctx.stroke();
}

function renderGrid(ctx, viewport, screen) {
  ctx.lineWidth = 0.5;

  for (var i = -10; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(...translateCoords([i, -10], viewport, screen));
    ctx.lineTo(...translateCoords([i, 10], viewport, screen));
    ctx.stroke();
  }
  for (var j = -10; j < 10; j++) {
    ctx.beginPath();
    ctx.moveTo(...translateCoords([-10, j], viewport, screen));
    ctx.lineTo(...translateCoords([10, j], viewport, screen));
    ctx.stroke();
  }
}

export default RoombaMap;
