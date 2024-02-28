import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import {collection, getDocs} from "firebase/firestore";
import {useState, useEffect} from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Admin from './components/pages/Admin';
import CreatePay from './components/pages/Create';
import Records from './components/pages/Records';
import AboutUs from './components/pages/About';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyBuf4evzyZgFaKq58qz1MOsZ4sBkpCoStQ",
  authDomain: "jeschee-payroll-system.firebaseapp.com",
  projectId: "jeschee-payroll-system",
  storageBucket: "jeschee-payroll-system.appspot.com",
  messagingSenderId: "848441398003",
  appId: "1:848441398003:web:0795a2f8b8bf890e609d86",
  measurementId: "G-2W26Y34PZ8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [records, setRecords] = useState([]);
  const recordsCollectionRef = collection(db, "records");

  useEffect(() => {
    const getRecords = async () => {
      const data = await getDocs(recordsCollectionRef);
      console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
      setRecords(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }

    getRecords()
  }, [])

  return (
    <div className="App">
      <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact component={Home} />
        <Route path='/admin' component={Admin} />
        <Route path='/create' component={CreatePay} />
        <Route path='/records' component={Records} />
        <Route path='/about-us' component={AboutUs} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
