//Create.js
import React from 'react';
import { useState, useEffect } from 'react';
import {db} from '../firebase-config';
import { collection, orderBy, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import '../css/Create.css';

export default function CreatePay() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [workdays, setWorkdays] = useState(0); // Add state variable for workdays
  const [overtime, setOvertime] = useState(0); // Add state variable for overtime
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const employeesRef = query(collection(db, "employees"), orderBy("ID", "asc"));
  const recordsRef = query(collection(db, "records"), orderBy("period", "asc"));
  const deductionsRef = query(collection(db, "deductions"), orderBy("ID", "asc"));
  
  const getData = async () => {
      try {
        const employeesTest = await getDocs(employeesRef);
      const employeesData = employeesTest.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setEmployees(employeesData);

      const recordsTest = await getDocs(recordsRef);
      const recordsData = recordsTest.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecords(recordsData);

      const deductionsTest = await getDocs(deductionsRef);
      const deductionsData = deductionsTest.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDeductions(deductionsData);
      } catch (error) {
      }
    }
  
    const handleEmployeeIdChange = (e) => {
      const selectedId = e.target.value;
      const selectedEmployeeData = employees.find((employee) => employee.ID === parseInt(selectedId));
      setSelectedEmployee(selectedEmployeeData);
    };

    const createPayroll = async () => {
      const id = (selectedEmployee.ID+"10"+(records.length+1));
      const dedTotes = deductions.reduce((total, deduction) => {
        if (selectedEmployee.deductions) {
          return total + deduction.amount;
        } else {
          return total;
        }
      }, 0);
      const payTotes = ((Number(selectedEmployee.hourShift)*Number(workdays))+Number(overtime))*Number(selectedEmployee.hourWage);
      const amntTotes = payTotes - dedTotes;
      if (selectedEmployee == null) {
        alert("Please Input a valid employee ID");
      } else {
        await addDoc(collection(db, "records"), {ID: id, name: selectedEmployee.name, pay: amntTotes, period: serverTimestamp(), details: "Total pay of "+payTotes+" and deduction of "+dedTotes, status: Boolean(false)});
        alert("Payroll record created!");
      }
    }

  useEffect(() => {
    getData();
  },[]);
  return (
    <>
    <form className='create-container'>
        <div className="input-container">
            <div>
                <label for="employee_id">ID:</label><br></br>
                <label for="name">Name:</label><br></br>
                <label for="workdays">Days Worked:</label><br></br>
                <label for="overtime">Overtime hours:</label><br></br>
            </div>
            <div>
                <input id="employee_id" name="employee_id" type="text" placeholder="SELECT EMPLOYEE ID FIRST" list='id_options'autoComplete="off"required onChange={handleEmployeeIdChange}></input>
                <datalist id='id_options'>
                {employees.map((d) => {  
                    return (
                      <option value={String(d.ID)}></option>
                      );
      })} 
                </datalist>
                <input id="name" name="name" type="text" autoComplete="off"required value={selectedEmployee ? selectedEmployee.name : ''} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}></input>
                <input id="workdays" name="workdays" type="number" min="1" placeholder="Number in days" autoComplete="off"required onChange={(e) => setWorkdays(e.target.value)}></input>
            <input id="overtime" name="overtime" type="number" placeholder="Number in hours" autoComplete="off"required onChange={(e) => setOvertime(e.target.value)}></input>
            </div>
        </div>
        <div className="container-buttons">
                <button onClick={() => createPayroll()}>NEXT</button>
                <button type="reset">CLEAR</button>
        </div>
    </form>
    </>
  );
}