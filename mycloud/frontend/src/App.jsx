import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FileManagerPage from './pages/FileManagerPage';
import AdminPanel from './pages/AdminPanel';
import WelcomePage from './pages/WelcomePage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/files" element={<FileManagerPage />} />
//         <Route path="/admin" element={<AdminPanel />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
//
// export default App;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} /> {/* Новая страница */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/files" element={<FileManagerPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Перенесли сюда */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;