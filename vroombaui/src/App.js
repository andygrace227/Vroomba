import MainPage from "./pages/main/MainPage";
import { BrowserRouter,Routes, Route } from "react-router-dom";

function App() {
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
