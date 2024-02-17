import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SignIn from './Components/SignIn';
import Register from './Components/register';
import Guard from './Components/guard';
import Apply from './Components/apply';
import Warden from './Components/warden';
import EditProfile from './Components/EditProfile'
import RegisterAsWarden from './Components/registerAsWarden'
import RegisterAsGuard from './Components/registerAsGuard'

function App() {
  return (
      <Routes>
        <Route path='' element={<SignIn />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/Warden' element={<RegisterAsWarden />} />
        <Route path='/register/Guard' element={<RegisterAsGuard />} />
        <Route path='/guard' element={<Guard />} />
        <Route path='/apply' element={<Apply />} />
        <Route path='/EditProfile' element={<EditProfile />} />
        <Route path='/warden' element={<Warden />} />
      </Routes>
  );
}

export default App;
