import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CreatePay from './pages/Create';
import Records from './pages/Records';
import AboutUs from './pages/About';

function App() {
  
  return (
    <div className="App">
      <Router>
        <nav className= "navbar">
          <Link to={'/'} className='navbar-logo'><i className='fab fa-firstdraft' /></Link>
          <ul className='nav-menu'>
            <li className='nav-item'><Link to={'/'} className='nav-links'>Home</Link></li>
            <li className='nav-item'><Link to={'/admin'} className='nav-links'>Admin</Link></li>
            <li className='nav-item'><Link to={'/create'} className='nav-links'>Create Payroll</Link></li>
            <li className='nav-item'><Link to={'/records'} className='nav-links'>Payrolls</Link></li>
            <li className='nav-item'><Link to={'/about-us'} className='nav-links'>AboutUs</Link></li>
          </ul> 
        </nav>
        <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/create' element={<CreatePay />} />
          <Route path='/records' element={<Records />} />
          <Route path='/about-us' element={<AboutUs />} />
        </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
