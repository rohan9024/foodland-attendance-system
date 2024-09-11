"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/component/navbar";
import { getDocs, collection } from "firebase/firestore"; // Ensure Firebase imports are correct
import { Poppins } from "next/font/google";
import { db } from "../../../firebase";

const poppins = Poppins({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

function Page() {
  const [masterRecords, setMasterRecords] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    if (!fetch) {
      const fetchFromFirestore = async () => {
        try {
          // Fetch master records
          const masterSnapshot = await getDocs(collection(db, "master"));
          const masterData = masterSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMasterRecords(masterData);

          // Fetch attendance records
          const attendanceSnapshot = await getDocs(collection(db, "attendance"));
          const attendanceData = attendanceSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAttendanceRecords(attendanceData);

          console.log(masterData, attendanceData);

          setFetch(true);
        } catch (error) {
          console.error("Error fetching records: ", error);
        }
      };

      fetchFromFirestore();
    }
  }, [fetch]);

  const findMasterRecord = (code) => {
    return masterRecords.find((record) => record.EmployeeCode === code);
  };

  const isRecordValid = (attendanceRecord) => {
    const masterRecord = findMasterRecord(attendanceRecord.EmployeeCode);
    if (!masterRecord) return false; 

    return (
      masterRecord.EmpName === attendanceRecord.EmpName && masterRecord.FinalRegion === attendanceRecord.Location 
    );
  };

  return (
    <>
      <Navbar />

      <div className={`${poppins.className} mx-20 my-20`}>
        <h1 className="text-3xl font-bold mt-10">Attendance Records</h1>
        <div className="w-1/2 mt-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((item, index) => (
                <tr
                  key={index}
                  className={!isRecordValid(item) ? "bg-red-200" : "bg-green-200"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.EmployeeCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.EmpName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Page;
