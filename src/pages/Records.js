//Records.js
import React from 'react';
import { useState, useEffect } from 'react';
import {db} from '../firebase-config';
import {collection, getDocs, updateDoc, orderBy, query, doc} from "firebase/firestore";
import '../css/Records.css';

export default function Records() {
  const [records, setRecords] = useState([]);
  const recordsCollectionRef = query(collection(db, "records"), orderBy("period", "desc"));
  const getRecords = async () => {
      try {
        const data = await getDocs(recordsCollectionRef);
        const recordsData = data.docs.map((doc) => ({
          ...doc.data(),
           id: doc.id,
          }))
        setRecords(recordsData);
      } catch (error) {
      }
    }

  useEffect(() => {
    

    getRecords();
  }, []);


  const handleReleasePayroll = async (recordId) => {
    try {
      await updateDoc(doc(db, "records", recordId), {"status" : Boolean(true)});
      getRecords();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='tableContainer'>
      <h2 className='records'>PAYROLL</h2>
      <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Details</th>
            <th>Status</th>
        </tr>
      {records.map((data) => {
        const date = data.period.toDate();
        const formattedDate = date.toLocaleDateString();
        return (
          <tr>
            <td>{data.ID}</td>
            <td>{data.name}</td>
            <td>{data.pay}</td>
            <td>{formattedDate}</td>
            <td>{data.details}</td>
            <td>
            {data.status ? (
                    'Realeased!'
                  ) : (
                    <button onClick={() => handleReleasePayroll(data.id)} className='releaseBtn'>Release Payroll</button>
                  )}
            </td>
          </tr>
          );
      })} 
      </table>
      </div>
    </>
  );
}