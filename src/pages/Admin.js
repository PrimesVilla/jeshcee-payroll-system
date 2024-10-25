//Admin.js
import React from 'react';
import { useState, useEffect } from 'react';
import {db} from '../firebase-config';
import {addDoc, collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy} from "firebase/firestore";
import '../css/Admin.css';

export default function Admin() {
  const [employees, setEmployees] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [editEmployees, setEditEmployees] = useState(null);
  const [editDeductions, setEditDeductions] = useState(null);

  

  //Employee Table CRUD
  const employeesEditClick = (index) => {
    setEditEmployees(index);
  }
  
  const employeesCellEdit = (newValue, dataIndex) => {
    setEmployees(prevData => {
      const newData = [...prevData];
      newData[dataIndex] = { ...newData[dataIndex], ...newValue };
      return newData;
    });
  };

  const createEmployee = async () => {
    await addDoc(collection(db, "employees"), {ID: Number(employees.length+100), name: 'name', hourWage: Number(null), hourShift: Number(null), deductions: false})
    getEmployees();
  }

  const getEmployees = async () => {
    try {
      const data = await getDocs(query(collection(db, "employees"), orderBy("ID", "asc")));
      const recordsData = data.docs.map((doc) => ({
        ...doc.data(),
         id: doc.id,
        }))
      setEmployees(recordsData);
    } catch (error) {
    }
  }

  const updateEmployee = async (id,ID, name, hourWage,hourShift, deductions) => {
    setEditEmployees(null);
    const newFields = {"ID" : Number(ID), "name" :name, "hourWage": Number(hourWage),"hourShift": Number(hourShift), "deductions": Boolean(deductions)};
    await updateDoc(doc(db, "employees", id), newFields);
    getEmployees();
  }

  const deleteEmployee = async (id) => {
    await deleteDoc(doc(db, "employees", id));
    getEmployees();
  }

  //Deductions Table CRUD
  const deductionsEditClick = (index) => {
    setEditDeductions(index);
  }
  
  const deductionsCellEdit = (newValue, dataIndex) => {
    setDeductions(prevData => {
      const newData = [...prevData];
      newData[dataIndex] = { ...newData[dataIndex], ...newValue };
      return newData;
    });
  };

  const createDeductions = async () => {
    await addDoc(collection(db, "deductions"), {ID:Number(deductions.length+1),name: 'name', amount: Number(null)})
    getDeductions();
  }

  const getDeductions = async () => {
    try {
      const data = await getDocs(query(collection(db, "deductions"), orderBy("ID", "asc")));
      const recordsData = data.docs.map((doc) => ({
        ...doc.data(),
         id: doc.id,
        }))
      setDeductions(recordsData);
    } catch (error) {
    }
  }

  const updateDeductions = async (id,name,amount) => {
    setEditDeductions(null);
    const newFields = {"name" : name, "amount": Number(amount)};
    await updateDoc(doc(db, "deductions", id), newFields);
    getDeductions();
  }

  const deleteDeductions = async (id) => {
    await deleteDoc(doc(db, "deductions", id));
    getDeductions();
  }


  useEffect(() => {
    getEmployees();
    getDeductions();
  }, []);
  return (
    <>
      <div className='admin-container'>
        <div>
        <div><h2>DEDUCTIONS</h2></div>
        <table>
        <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deductions.map((d, i) => (
              <tr key={i}>
                <td>
                  {editDeductions === i ? (
                    <input type="text" value={d.name} onChange={(e) => deductionsCellEdit({ name: e.target.value }, i)} />
                  ) : (
                    d.name
                  )}
                </td>
                <td>
                  {editDeductions === i ? (
                    <input type="text" value={d.amount} onChange={(e) => deductionsCellEdit({ amount: e.target.value }, i)} />
                  ) : (
                    d.amount
                  )}
                </td>
                <td className='button-container'>
                  {editDeductions === i ? (
                    <button className="saveBtn" onClick={() => updateDeductions(d.id,d.name,d.amount)}>Save</button>
                  ) : (
                    <button className="editBtn" onClick={() => deductionsEditClick(i)}>Edit</button>
                  )}
                  
                  <button className="deleteBtn" onClick={() => deleteDeductions(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="addBtn" onClick={() => createDeductions()}>ADD</button>
        </div>
        <div>
        <h2>EMPLOYEE DETAILS </h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Wage Per Hour</th>
              <th>Hour Per Shift</th>
              <th>Deductions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((d, i) => (
              <tr key={i}>
                <td>
                  {editEmployees === i ? (
                    <input type="text" value={d.ID} onChange={(e) => employeesCellEdit({ ID: e.target.value }, i)} />
                  ) : (
                    d.ID
                  )}
                </td>
                <td>
                  {editEmployees === i ? (
                    <input type="text" value={d.name} onChange={(e) => employeesCellEdit({ name: e.target.value }, i)} />
                  ) : (
                    d.name
                  )}
                </td>
                <td>
                  {editEmployees === i ? (
                    <input type="text" value={d.hourWage} onChange={(e) => employeesCellEdit({ hourWage: e.target.value }, i)} />
                  ) : (
                    d.hourWage
                  )}
                </td>
                <td>
                  {editEmployees === i ? (
                    <input type="text" value={d.hourShift} onChange={(e) => employeesCellEdit({ hourShift: e.target.value }, i)} />
                  ) : (
                    d.hourShift
                  )}
                </td>
                <td>
                  {editEmployees === i ? (
                    <input type="text" value={d.deductions} onChange={(e) => employeesCellEdit({ deductions: e.target.value }, i)} />
                  ) : (
                    String(d.deductions)
                  )}
                </td>
                <td className='button-container'>
                  {editEmployees === i ? (
                    <button className="saveBtn" onClick={() => updateEmployee(d.id,d.ID,d.name,d.hourWage,d.hourShift,d.deductions)}>Save</button>
                  ) : (
                    <button className="editBtn" onClick={() => employeesEditClick(i)}>Edit</button>
                  )}
                  
                  <button className="deleteBtn" onClick={() => deleteEmployee(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="addBtn" onClick={() => createEmployee()}>ADD</button>
        </div>
      </div>
    </>
  );
}