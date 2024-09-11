"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Poppins } from "next/font/google";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/component/navbar";

const poppins = Poppins({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function Home() {
  const [CSVData, setCSVData] = useState([]);
  const [attendanceCSV, setAttendanceCSV] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [recordsObj, setRecords] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const { data } = await parseCsv(file);

        // Filter out rows where 'Month' (or any key column) is empty
        const filteredData = data.filter(
          (row) => row.Month && row.EmployeeCode && row.EmpName
        );

        console.log("Filtered CSV Data:", filteredData);
        setCSVData(filteredData);
      } catch (error) {
        console.error("Error parsing CSV:", error);
      }
    }
  };
  const handleAttendanceUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const { data } = await parseCsv(file);

        setAttendanceCSV(data);
      } catch (error) {
        console.error("Error parsing CSV:", error);
      }
    }
  };

  const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => resolve(result),
        error: (error) => reject(error.message),
      });
    });
  };

  const submitToFirebase = async () => {
    try {
      for (const dataItem of CSVData) {
        await addDoc(collection(db, "master"), dataItem);
      }
      alert("Data uploaded successfully!");
    } catch (error) {
      alert(error);
    }
  };

  const submitAttendance = async () => {
    try {
      for (const dataItem of attendanceCSV) {
        await addDoc(collection(db, "attendance"), dataItem);
      }
      alert("Data uploaded successfully!");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (!fetch) {
      const fetchFromFirestore = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "master"));
          const records = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log(records);
          setRecords(records);
          setFetch(true);
        } catch (error) {
          console.error("Error fetching records: ", error);
        }
      };

      fetchFromFirestore();
    }
  }, [fetch]);
  const [fetchedAttendance, setFetchedAttendance] = useState([]);

  useEffect(() => {
    if (!fetch) {
      const fetchFromFirestore = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "attendance"));
          const records = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFetchedAttendance(records);
          setFetch(true);
        } catch (error) {
          console.error("Error fetching records: ", error);
        }
      };

      fetchFromFirestore();
    }
  }, [fetch]);

  return (
    <>
      <Navbar />
      <div>
        <div className="flex flex-col justify-start space-y-10 text-black mx-20">
          <h1 className={`${poppins.className} text-3xl font-bold mt-10`}>
            Upload Master CSV
          </h1>
          <input type="file" accept=".csv" onChange={handleFileUpload} />

          <div
            className={`${poppins.className} relative overflow-x-auto mt-10 `}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Emp Name</TableHead>
                  <TableHead>Final Location</TableHead>
                  <TableHead>Final Region</TableHead>
                  <TableHead>Final Department</TableHead>
                  <TableHead>Final Designation</TableHead>
                  <TableHead>Final Position</TableHead>
                  <TableHead>Final Customer</TableHead>
                  <TableHead>Co. Name</TableHead>
                  <TableHead>UI - HR</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>OT Hrs.</TableHead>
                  <TableHead>Total Mandays</TableHead>
                  <TableHead>Attendance Cycle</TableHead>
                  <TableHead>Days Type</TableHead>
                  <TableHead>Paid Days</TableHead>
                  <TableHead>Actual Manning</TableHead>
                  <TableHead>Actual Billed CTC</TableHead>
                  <TableHead>Other Cost viz. OT, Incentive</TableHead>
                  <TableHead>Actual Billed Svc. Chrg.</TableHead>
                  <TableHead>Total Billed Cost</TableHead>
                  <TableHead>Cost Type</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Drivers/DA</TableHead>
                  <TableHead>WH/TRP</TableHead>
                  <TableHead>Location Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CSVData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.Month}</TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.EmployeeCode}</TableCell>
                    <TableCell>{item.EmpName}</TableCell>
                    <TableCell>{item.FinalLocation}</TableCell>
                    <TableCell>{item.FinalRegion}</TableCell>
                    <TableCell>{item.FinalDepartment}</TableCell>
                    <TableCell>{item.FinalDesignation}</TableCell>
                    <TableCell>{item.FinalPosition}</TableCell>
                    <TableCell>{item.FinalCustomer}</TableCell>
                    <TableCell>{item.CompanyName}</TableCell>
                    <TableCell>{item.UIHR}</TableCell>
                    <TableCell>{item.Gender}</TableCell>
                    <TableCell>{item.Present}</TableCell>
                    <TableCell>{item.OTHrs}</TableCell>
                    <TableCell>{item.TotalMandays}</TableCell>
                    <TableCell>{item.AttendanceCycle}</TableCell>
                    <TableCell>{item.DaysType}</TableCell>
                    <TableCell>{item.PaidDays}</TableCell>
                    <TableCell>{item.ActualManning}</TableCell>
                    <TableCell>{item.ActualBilledCTC}</TableCell>
                    <TableCell>{item.OtherCost}</TableCell>
                    <TableCell>{item.ActualBilledSvcCharge}</TableCell>
                    <TableCell>{item.TotalBilledCost}</TableCell>
                    <TableCell>{item.CostType}</TableCell>
                    <TableCell>{item.Remarks}</TableCell>
                    <TableCell>{item.InvoiceNo}</TableCell>
                    <TableCell>{item.DriversDA}</TableCell>
                    <TableCell>{item.WHTRP}</TableCell>
                    <TableCell>{item.LocationStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={submitToFirebase}
              className="relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border border-gray-800 rounded-full hover:text-white group hover:bg-gray-600"
            >
              <span className="absolute left-0 block w-full h-0 transition-all bg-black text-white opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
              <span className="relative">Submit</span>
            </button>
          </div>
        </div>

        <div
          className={`${poppins.className} relative overflow-x-auto mt-10 mx-20 my-20 text-black`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Sr. No.</TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Emp Name</TableHead>
                <TableHead>Final Location</TableHead>
                <TableHead>Final Region</TableHead>
                <TableHead>Final Department</TableHead>
                <TableHead>Final Designation</TableHead>
                <TableHead>Final Position</TableHead>
                <TableHead>Final Customer</TableHead>
                <TableHead>Co. Name</TableHead>
                <TableHead>UI - HR</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>OT Hrs.</TableHead>
                <TableHead>Total Mandays</TableHead>
                <TableHead>Attendance Cycle</TableHead>
                <TableHead>Days Type</TableHead>
                <TableHead>Paid Days</TableHead>
                <TableHead>Actual Manning</TableHead>
                <TableHead>Actual Billed CTC</TableHead>
                <TableHead>Other Cost viz. OT, Incentive</TableHead>
                <TableHead>Actual Billed Svc. Chrg.</TableHead>
                <TableHead>Total Billed Cost</TableHead>
                <TableHead>Cost Type</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Drivers/DA</TableHead>
                <TableHead>WH/TRP</TableHead>
                <TableHead>Location Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recordsObj.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Month}</TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.EmployeeCode}</TableCell>
                  <TableCell>{item.EmpName}</TableCell>
                  <TableCell>{item.FinalLocation}</TableCell>
                  <TableCell>{item.FinalRegion}</TableCell>
                  <TableCell>{item.FinalDepartment}</TableCell>
                  <TableCell>{item.FinalDesignation}</TableCell>
                  <TableCell>{item.FinalPosition}</TableCell>
                  <TableCell>{item.FinalCustomer}</TableCell>
                  <TableCell>{item.CompanyName}</TableCell>
                  <TableCell>{item.UIHR}</TableCell>
                  <TableCell>{item.Gender}</TableCell>
                  <TableCell>{item.Present}</TableCell>
                  <TableCell>{item.OTHrs}</TableCell>
                  <TableCell>{item.TotalMandays}</TableCell>
                  <TableCell>{item.AttendanceCycle}</TableCell>
                  <TableCell>{item.DaysType}</TableCell>
                  <TableCell>{item.PaidDays}</TableCell>
                  <TableCell>{item.ActualManning}</TableCell>
                  <TableCell>{item.ActualBilledCTC}</TableCell>
                  <TableCell>{item.OtherCost}</TableCell>
                  <TableCell>{item.ActualBilledSvcCharge}</TableCell>
                  <TableCell>{item.TotalBilledCost}</TableCell>
                  <TableCell>{item.CostType}</TableCell>
                  <TableCell>{item.Remarks}</TableCell>
                  <TableCell>{item.InvoiceNo}</TableCell>
                  <TableCell>{item.DriversDA}</TableCell>
                  <TableCell>{item.WHTRP}</TableCell>
                  <TableCell>{item.LocationStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col justify-start space-y-10 text-black mx-20">
          <h1 className={`${poppins.className} text-3xl font-bold mt-10`}>
            Upload Attendance CSV
          </h1>
          <input type="file" accept=".csv" onChange={handleAttendanceUpload} />

          <div className={`${poppins.className} w-1/2  mt-10`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceCSV.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.EmployeeCode}</TableCell>
                    <TableCell>{item.EmpName}</TableCell>
                    <TableCell>{item.Location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div
            onClick={submitAttendance}
            class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border border-gray-800 rounded-full hover:text-white group hover:bg-gray-600"
          >
            <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
            <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span class="relative">Submit</span>
          </div>
        </div>

        <div className="mx-20 my-20">
          <h1 className={`${poppins.className} text-3xl font-bold mt-10 `}>
            Attendance Records
          </h1>
          <div className={`${poppins.className} w-1/2 mt-10`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchedAttendance.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.EmployeeCode}</TableCell>
                    <TableCell>{item.EmpName}</TableCell>
                    <TableCell>{item.Location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
