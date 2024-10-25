import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, orderBy, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import '../css/Create.css';

export default function CreatePay() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [workdays, setWorkdays] = useState(0);
  const [overtime, setOvertime] = useState(0);
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
      console.error("Error fetching data: ", error);
    }
  };

  const handleEmployeeIdChange = (e) => {
    const selectedId = e.target.value;
    const selectedEmployeeData = employees.find((employee) => employee.ID === parseInt(selectedId));
    setSelectedEmployee(selectedEmployeeData);
  };

  const createPayroll = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedEmployee) {
      alert("Please Input a valid employee ID");
      return;
    }

    const id = `${selectedEmployee.ID}10${records.length + 1}`;
    const dedTotes = deductions.reduce((total, deduction) => {
      return selectedEmployee.deductions ? total + deduction.amount : total;
    }, 0);
    
    const payTotes = ((Number(selectedEmployee.hourShift) * Number(workdays)) + Number(overtime)) * Number(selectedEmployee.hourWage);
    const amntTotes = payTotes - dedTotes;

    try {
      await addDoc(collection(db, "records"), {
        ID: id,
        name: selectedEmployee.name,
        pay: amntTotes,
        period: serverTimestamp(),
        details: `Total pay of ${payTotes} and deduction of ${dedTotes}`,
        status: false
      });
      alert("Payroll record created!");
    } catch (error) {
      console.error("Error creating payroll record: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <form className='create-container' onSubmit={createPayroll}>
        <div className="input-container">
          <div>
            <label htmlFor="employee_id">ID:</label><br />
            <label htmlFor="name">Name:</label><br />
            <label htmlFor="workdays">Days Worked:</label><br />
            <label htmlFor ="overtime">Overtime hours:</label><br />
          </div>
          <div>
            <input
              id="employee_id"
              name="employee_id"
              type="text"
              placeholder="SELECT EMPLOYEE ID FIRST"
              list='id_options'
              autoComplete="off"
              required
              onChange={handleEmployeeIdChange}
            />
            <datalist id='id_options'>
              {employees.map((d) => (
                <option key={d.ID} value={String(d.ID)}></option>
              ))}
            </datalist>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="off"
              required
              value={selectedEmployee ? selectedEmployee.name : ''}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
            />
            <input
              id="workdays"
              name="workdays"
              type="number"
              min="1"
              placeholder="Number in days"
              autoComplete="off"
              required
              onChange={(e) => setWorkdays(e.target.value)}
            />
            <input
              id="overtime"
              name="overtime"
              type="number"
              placeholder="Number in hours"
              autoComplete="off"
              required
              onChange={(e) => setOvertime(e.target.value)}
            />
          </div>
        </div>
        <div className="container-buttons">
          <button type="submit">NEXT</button>
          <button type="reset">CLEAR</button>
        </div>
      </form>
    </>
  );
}