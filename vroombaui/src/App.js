import MainPage from "./pages/main/MainPage";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Config from "./Config"
import { useRef } from "react";
function App() {

  const keysPressed = useRef([])

  const estop = () => {
    fetch(Config.SERVER_IP + "/estop")
  }

  const sendMoveCommand = () => {
    var velocity = 0;
    var angle = 0;
    console.log(keysPressed.current)
      
    for(var s of keysPressed.current){
      if(s == "a") angle += 1;
      if(s == "d") angle -= 1;
      if(s == "w") velocity += 0.25;
      if(s == "s") velocity -= 0.25;
    }
    fetch(Config.SERVER_IP + "/drive?velocity=" + velocity + "&angle=" + angle)
  }

  const registerKeyPress = (e) => {
    e.preventDefault();
    if (e.key == " "){
      estop()
    }
    else{
      var kp = keysPressed.current;
      if (kp.includes(e.key) == false){
        kp.push(e.key);
        keysPressed.current = kp;
        sendMoveCommand()
      }
    }
  }

  const unregisterKeyPress = (e) => {
    var oldKeysPressed = keysPressed.current;
    oldKeysPressed = oldKeysPressed.filter(s => s != e.key);

    keysPressed.current = oldKeysPressed;
    sendMoveCommand()
  }

  window.addEventListener("keydown", registerKeyPress)
  window.addEventListener("keyup", unregisterKeyPress)

  return (
      
   <BrowserRouter>
   <Routes>
       <Route path="/"> {/* 👈 Renders at /app/ */}
         <Route index element={<MainPage/>}/>
         
       </Route>
   </Routes>
     
   </BrowserRouter>
  );
}

export default App;
