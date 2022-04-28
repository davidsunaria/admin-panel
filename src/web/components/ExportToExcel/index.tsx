import React, { useCallback, useEffect, useState } from "react";
//@ts-ignore
import * as FileSaver from "file-saver";
import { useStoreActions, useStoreState } from "react-app-store";
import * as XLSX from "xlsx";

export const ExportToExcel: React.FC<{
  payload: any;
  type?: String;
  class_name?: string;
}> = ({ payload, type, class_name }) => {
  
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  //Actions
  const getExportedExcelData = useStoreActions(
    (actions) => actions.user.getExportedExcelData
  );
  const flushExcelData = useStoreActions(
    (actions) => actions.user.flushExcelData
  );
  const exportedExcelData = useStoreState(
    (state) => state.user.exportedExcelData
  );

  //console.log("exportuser",exportedUsers)

  const inititalState = useCallback((type, item) => {
    switch (type) {
      case "users":
        return {
          FirstName: item?.first_name || "-",
          LastName: item?.last_name || "-",
          Email: item?.email || "-",
          Username: item?.username || "-",
          Status: item?.active === 1 ? "Active" : "Inactive",
          Premium: item?.is_premium === 1 ? "Yes" : "No",
          BlockByAdmin: item?.is_blocked_by_admin === 1 ? "Yes" : "No",
         
        };
      case "events":
        return {
          Name: item?.name || "-",
          Owner: `${item?.creator_of_event?.first_name} ${item?.creator_of_event?.last_name}`,
          "Associated group": item?.event_group?.name || "-",
          Address: item?.address || "-",
          Capacity: item?.capacity || "-",
          "Capacity Type": item?.capacity_type || "-",
          Status: item?.status === 1 ? "Active" : "Inactive",
          BlockByAdmin: item?.is_blocked_by_admin === 1 ? "Yes" : "No",
        };
      case "groups":
        return {
          Name: item?.name || "-",
          Owner: `${item?.creator_of_group?.first_name} ${item?.creator_of_group?.last_name}`,
          Purpose: item?.category || "-",
          Address: item?.address || "-",
          "Restricted Mode": item?.restriction_mode || "-",
          Status: item?.status === 1 ? "Active" : "Inactive",
          BlockByAdmin: item?.is_blocked_by_admin === 1 ? "Yes" : "No",
        };
      default:
        return {};
    }
  }, []);

  useEffect(() => {
    if (exportedExcelData?.length ) {
      let newArray: any[] = [];
      exportedExcelData?.map((item: any) => {
        // here i am  extracting only userId and title
        let obj = inititalState(type, item);
        newArray?.push(obj);
      });
      const ws = XLSX.utils.json_to_sheet(newArray);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, type + fileExtension);

      flushExcelData();
    }
  }, [exportedExcelData, type]);

  const exportDataToExcel = useCallback(async (type, payload) => {
    if (type === "users") {
      let formData = {
        q: payload?.q,
        status: payload?.status,
        is_premium: payload?.is_premium,
      };
      await getExportedExcelData({ url: "user/export", payload: formData });
    }

    if (type === "groups") {
      let formData = {
        q: payload?.q,
        status: payload?.status,
      };
      await getExportedExcelData({ url: "group/export", payload: formData });
    }

    if (type === "events") {
      let formData = {
        q: payload.q,
        status: payload.status,
        group_id: payload.group_id ? payload.group_id : "",
      };
      await getExportedExcelData({ url: "event/export", payload: formData });
    }
  }, []);

  // useEffect(() => {
  //   flushExcelData();
  // }, [])
  return (
    //<button className={className} onClick={(e) => exportToCSV(apiData, fileName)}>Export</button>
    <button
      type={"button"}
      className={class_name || ""}
      onClick={() => exportDataToExcel(type, payload)}
    >
      Export
    </button>
  );
};
