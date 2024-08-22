import './App.css'
import {S3Uploader} from './components/S3Uploader'
import { Signup } from './pages/Signup'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signup/>}/>
            <Route path="/dashboard" element={<S3Uploader/>}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
