import React, { useCallback, useEffect, useState, useMemo } from 'react'
//@ts-ignore
import * as FileSaver from "file-saver";
import { useStoreActions, useStoreState } from 'react-app-store';
import * as XLSX from "xlsx";


export const ExportToExcel: React.FC<{payload: any, type?: String, class_name?: string}> = ( {payload, type, class_name} ) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  //Actions
  const getExportedUsers = useStoreActions(actions => actions.user.getExportedUsers);
  const exportedUsers = useStoreState(state => state.user.exportedUsers);
  const [isBtnClicked, setIsBtnClicked] = useState<Boolean>(false);
  useEffect(() => {
    if (exportedUsers?.length && isBtnClicked === true) {

      let newArray: any[] = [];
      exportedUsers?.map((item: any) => {
        // here i am  extracting only userId and title
        let obj = {
          FirstName: item.first_name, LastName: item.last_name, Username: item.username,
          Email: item.email, Status: item.active === 1 ? "Active" : "Inactive",
          "BlockByAdmin": item.is_blocked_by_admin === 1 ? "Yes" : "No", Premium: item.is_premium === 1 ? "Yes" : "No"
        };
        // after extracting what I need, I am adding it to newArray
        newArray?.push(obj);
      });

      const ws = XLSX.utils.json_to_sheet(newArray);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, type + fileExtension);
      setIsBtnClicked(false);
    }
  }, [exportedUsers, type, isBtnClicked]);

  const exportData = useCallback(async(type, payload) => {
    setIsBtnClicked(true);
    if (type === "users") {
      let formData = {
        q: payload?.q,
        status: payload?.status,
        is_premium: payload?.is_premium,
      }
      await getExportedUsers({ url: "user/export", payload: formData });
    }
  }, []);


  return (
    //<button className={className} onClick={(e) => exportToCSV(apiData, fileName)}>Export</button>
    <button type={"button"} className={class_name || ""} onClick={() => exportData(type, payload)}>Export</button>
  );
};