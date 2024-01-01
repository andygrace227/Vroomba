import LiveDrive from "./pages/LiveDrive/LiveDrive";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Config from "./Config"
import { useRef } from "react";
import Home from "./pages/Home/Home";
import SiteNavigation from "./shared/components/SiteNavigation/SiteNavigation";
function App() {

  return (
      
   <BrowserRouter>
   <Routes>
       <Route path="/" element={<SiteNavigation/>}> {/* 👈 Renders at /app/ */}
         <Route index element={<Home/>}/>
         <Route path="livedrive" element={<LiveDrive/>}/>
       </Route>
   </Routes>
     
   </BrowserRouter>
  );
}

export default App;
