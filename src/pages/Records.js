import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, orderBy, query, doc } from "firebase/firestore";
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
      }));
      setRecords(recordsData);
    } catch (error) {
      console.error("Error fetching records: ", error);
    }
  };

  useEffect(() => {
    getRecords();
  }, [getRecords]); // Add getRecords to the dependency array

  const handleReleasePayroll = async (recordId) => {
    try {
      await updateDoc(doc(db, "records", recordId), { "status": true });
      getRecords(); // Refresh records after updating
    } catch (error) {
      console.log("Error releasing payroll: ", error);
    }
  };

  return (
    <>
      <div className='tableContainer'>
        <h2 className='records'>PAYROLL</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((data) => {
              const date = data.period.toDate();
              const formattedDate = date.toLocaleDateString();
              return (
                <tr key={data.id}>
                  <td>{data.ID}</td>
                  <td>{data.name}</td>
                  <td>{data.pay}</td>
                  <td>{formattedDate}</td>
                  <td>{data.details}</td>
                  <td>
                    {data.status ? (
                      'Released!'
                    ) : (
                      <button onClick={() => handleReleasePayroll(data.id)} className='releaseBtn'>Release Payroll</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}