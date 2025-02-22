import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Chatbot from './Components/Chatbot';

function App() {
  return (
   <div>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={< Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<Chatbot />} />
    </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
