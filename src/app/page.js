"use client";

import React, { useEffect, useState } from "react";
import Papa from 'papaparse';
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function Home() {
  const [CSVData, setCSVData] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const { data } = await parseCsv(file);

        // Filter out rows where 'Month' (or any key column) is empty
        const filteredData = data.filter(row => row.Month && row.EmployeeCode && row.EmpName);

        console.log("Filtered CSV Data:", filteredData);
        setCSVData(filteredData);
      } catch (error) {
        console.error("Error parsing CSV:", error);
      }
    }
  };

  const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true, // Skip completely empty lines
        complete: (result) => {
          resolve(result);
        },
        error: (error) => {
          reject(error.message);
        },
      });
    });
  };

  const submitToFirebase = async () => {
    try {
      for (const dataItem of CSVData) {
        if (Object.values(dataItem).every(value => value.trim() !== '')) {
          await addDoc(collection(db, "master"), dataItem);
        }
      }
      alert("Data uploaded successfully!");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-start space-y-10 text-black mx-10">
        <h1 className={`${poppins.className} text-3xl font-bold mt-10`}>
          Upload CSV
        </h1>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        <div className={`${poppins.className} relative overflow-x-auto mt-10`}>
          <table className="min-w-full text-sm text-left">
            <thead className="text-sm border border-gray-800">
              <tr>
                <th scope="col" className="px-2 py-2">Month</th>
                <th scope="col" className="px-2 py-2">Sr. No.</th>
                <th scope="col" className="px-2 py-2">Employee Code</th>
                <th scope="col" className="px-2 py-2">Emp Name</th>
                <th scope="col" className="px-2 py-2">Final Location</th>
                <th scope="col" className="px-2 py-2">Final Region</th>
                <th scope="col" className="px-2 py-2">Final Department</th>
                <th scope="col" className="px-2 py-2">Final Designation</th>
                <th scope="col" className="px-2 py-2">Final Position</th>
                <th scope="col" className="px-2 py-2">Final Customer</th>
                <th scope="col" className="px-2 py-2">Co. Name</th>
                <th scope="col" className="px-2 py-2">UI - HR</th>
                <th scope="col" className="px-2 py-2">Gender</th>
                <th scope="col" className="px-2 py-2">Present</th>
                <th scope="col" className="px-2 py-2">OT Hrs.</th>
                <th scope="col" className="px-2 py-2">Total Mandays</th>
                <th scope="col" className="px-2 py-2">Attendance Cycle</th>
                <th scope="col" className="px-2 py-2">Days Type</th>
                <th scope="col" className="px-2 py-2">Paid Days</th>
                <th scope="col" className="px-2 py-2">Actual Manning</th>
                <th scope="col" className="px-2 py-2">Actual Billed CTC</th>
                <th scope="col" className="px-2 py-2">Other Cost viz. OT, Incentive</th>
                <th scope="col" className="px-2 py-2">Actual Billed Svc. Chrg.</th>
                <th scope="col" className="px-2 py-2">Total Billed Cost</th>
                <th scope="col" className="px-2 py-2">Cost Type</th>
                <th scope="col" className="px-2 py-2">Remarks</th>
                <th scope="col" className="px-2 py-2">Invoice No.</th>
                <th scope="col" className="px-2 py-2">Drivers/DA</th>
                <th scope="col" className="px-2 py-2">WH/TRP</th>
                <th scope="col" className="px-2 py-2">Location Status</th>
              </tr>
            </thead>
            <tbody>
              {CSVData.map((item, index) => (
                <tr key={index} className="border border-gray-800">
                  <td className="px-2 py-2 truncate">{item.Month}</td>
                  <td className="px-2 py-2 truncate">{index + 1}</td>
                  <td className="px-2 py-2 truncate">{item.EmployeeCode}</td>
                  <td className="px-2 py-2 truncate">{item.EmpName}</td>
                  <td className="px-2 py-2 truncate">{item.FinalLocation}</td>
                  <td className="px-2 py-2 truncate">{item.FinalRegion}</td>
                  <td className="px-2 py-2 truncate">{item.FinalDepartment}</td>
                  <td className="px-2 py-2 truncate">{item.FinalDesignation}</td>
                  <td className="px-2 py-2 truncate">{item.FinalPosition}</td>
                  <td className="px-2 py-2 truncate">{item.FinalCustomer}</td>
                  <td className="px-2 py-2 truncate">{item.CompanyName}</td>
                  <td className="px-2 py-2 truncate">{item.UIHR}</td>
                  <td className="px-2 py-2 truncate">{item.Gender}</td>
                  <td className="px-2 py-2 truncate">{item.Present}</td>
                  <td className="px-2 py-2 truncate">{item.OTHrs}</td>
                  <td className="px-2 py-2 truncate">{item.TotalMandays}</td>
                  <td className="px-2 py-2 truncate">{item.AttendanceCycle}</td>
                  <td className="px-2 py-2 truncate">{item.DaysType}</td>
                  <td className="px-2 py-2 truncate">{item.PaidDays}</td>
                  <td className="px-2 py-2 truncate">{item.ActualManning}</td>
                  <td className="px-2 py-2 truncate">{item.ActualBilledCTC}</td>
                  <td className="px-2 py-2 truncate">{item.OtherCost}</td>
                  <td className="px-2 py-2 truncate">{item.ActualBilledSvcCharge}</td>
                  <td className="px-2 py-2 truncate">{item.TotalBilledCost}</td>
                  <td className="px-2 py-2 truncate">{item.CostType}</td>
                  <td className="px-2 py-2 truncate">{item.Remarks}</td>
                  <td className="px-2 py-2 truncate">{item.InvoiceNo}</td>
                  <td className="px-2 py-2 truncate">{item.DriversDA}</td>
                  <td className="px-2 py-2 truncate">{item.WHTRP}</td>
                  <td className="px-2 py-2 truncate">{item.LocationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div
            type="submit"
            onClick={submitToFirebase}
            className="cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border border-gray-800 rounded-full hover:text-white group hover:bg-gray-600"
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
          </div>


          
        </div>
      </div>
    </div>
  );
}
