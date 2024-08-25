import './App.css';
import { Dashboard } from './pages/Dashboard';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthChecker from './components/AuthChecker'; // Import the new component

function App() {
  return (
    <BrowserRouter>
      <AuthChecker>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthChecker>
    </BrowserRouter>
  );
}

export default App;
