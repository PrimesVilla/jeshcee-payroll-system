//Home.js
import React from 'react';
import '../css/Home.css';
import {Link} from 'react-router-dom';


export default function Home() {
  return (
    <>
        <div className='homeContainer'>
        <div className='contain-main'>
        <h1>
            Jeshcee <br></br>
            <span>
                Pharmacy
            </span>
        </h1>
        <p>
            The Jeshcee Pharmacy Payroll system is designed to help the small pharmacy family business in aiding calculation and salary distributions amongst is workers. Click the "Get Started" button to create a payroll.
 
        </p>

          <Link to={'/create'} className="button">Get Started</Link>
        </div>
        <div className='home-logo'>

        </div>
        </div>
    </>
  );
}