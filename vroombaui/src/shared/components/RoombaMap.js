import { useEffect, useState, useRef } from "react";
import Config from "../../Config";

function RoombaMap(props) {
  // x in meters,y in meters,heading in radians
  
  var roombaPosition = [props.x, props.y, props.heading];
  // center x in meters, center y in meters, scale in pixels per meter, dpi factor
  const [viewport, setViewport] = useState([0, 0, 100, 2]);
  const [mouseInfo, setMouseInfo] = useState({ drag: false, x: 0, y: 0, origViewX: 0, origViewY: 0 });
  const canvasRef = useRef(null);

  let initArr = [200, 200];

  if (props.height && props.width) {
    initArr = [props.height, props.width];
  }

  const size = useRef(initArr);

  const changeZoom = (e) => {
    e.preventDefault();
    setViewport((arr) => [arr[0], arr[1],  Math.min(Math.max(arr[2] - e.deltaY * 0.05, 40), 500), arr[3]]);
    draw();
  };

  const changePosition = (e) => {
    setMouseInfo((prev) => {
      if (prev["drag"] == true) {
        setViewport((arr) => {
          return [
            arr[3] * (prev.origViewX - (e.clientX - prev.x) / arr[2]),
            arr[3] * (prev.origViewY - (prev.y - e.clientY) / arr[2]),
            arr[2],
            arr[3]
          ];
        });
      }
      return prev;
    });
    draw();
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
    draw();
  };

  const endDrag = (e) => {
    setMouseInfo((prevState) => {
      let newState = { ...prevState };
      newState.drag = false;
      newState.x = e.clientX;
      newState.y = e.clientY;
      return newState;
    });
    draw();
  };

  var canvas = (
    <canvas
      ref={canvasRef}
      width={size.current[1]}
      height={size.current[0]}
      onMouseDown={startDrag}
      onMouseUp={endDrag}
      onMouseMove={changePosition}
    ></canvas>
  );


  const draw = () => {
    const canvas = canvasRef.current;
    if (props.autoFit) {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = 2 * canvas.offsetWidth;
      canvas.height = 2 * canvas.offsetHeight;
    }
    const ctx = canvas.getContext("2d");
    const screen = [canvas.width, canvas.height];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderRoomba(ctx, roombaPosition, viewport, screen);
    renderGrid(ctx, viewport, screen);
  };


  useEffect(() => {
    let canvas = canvasRef.current;
    canvas.addEventListener("wheel", changeZoom, {passive:false}) 
    return () => {
      canvas.removeEventListener('wheel', changeZoom);
    }
   }, [viewport])

  useEffect(() => {

    draw();
  }, [props.x, props.y, props.heading]);

  return canvas;
}

function translateCoords(coords, viewport, screen) {
  // From the unit to the screen... how fun.
  var viewport_translation = [viewport[2] * (coords[0] - viewport[0]), viewport[2] * (coords[1] - viewport[1])];
  return [viewport_translation[0] + screen[0] / 2, -1.0 * viewport_translation[1] + screen[1] / 2];
}

function pixelToRealSpace(pixel, viewport, screen) {
  // Screen to unit :/ 

  let xPosition = (((2 * pixel[0]) - screen[0]) / viewport[2]) + viewport[0]
  let yPosition = ((-1.0 * ((2 * pixel[1]) - screen[1])) /  viewport[2]) + viewport[1]


  return [xPosition, yPosition];
}


function renderRoomba(ctx, position, viewport, screen) {
  ctx.lineCap = "round";
  ctx.beginPath();
  var heading = position[2];
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
  // Figure out which meters are on the screen.
  let topLeft = pixelToRealSpace([0,0], viewport, screen);
  let bottomRight = pixelToRealSpace(screen, viewport, screen);


  let horizontalStart = Math.floor(topLeft[0] - 1);
  let horizontalEnd = Math.ceil(bottomRight[0] + 1);

  let verticalStart = Math.floor(topLeft[1] + 1);
  let verticalEnd = Math.ceil(bottomRight[1] - 1);

  console.log("Verts:" + verticalStart + " " + verticalEnd);

  ctx.lineWidth = 0.5;

  for (let i = horizontalStart; i < horizontalEnd; i++) {
    ctx.beginPath();
    ctx.moveTo(...translateCoords([i, verticalStart ], viewport, screen));
    ctx.lineTo(...translateCoords([i, verticalEnd], viewport, screen));
    ctx.stroke();
  }
  for (let j = verticalStart; j > verticalEnd; j--) {
    ctx.beginPath();
    ctx.moveTo(...translateCoords([horizontalStart, j], viewport, screen));
    ctx.lineTo(...translateCoords([horizontalEnd, j], viewport, screen));
    ctx.stroke();
  }
}

export default RoombaMap;
