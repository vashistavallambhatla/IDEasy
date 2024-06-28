import './App.css'
import { CodingPage } from './components/CodingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from './components/Landing';
import  AuthModal  from './Modals/AuthModal';
import { RecoilRoot } from 'recoil';
import { Topbar } from './components/Topbar';


function App() {
  
  return (
    <RecoilRoot>
    <BrowserRouter>
    <Topbar></Topbar>
      <Routes>
        <Route path="/getin" element={<AuthModal/>}></Route>
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
