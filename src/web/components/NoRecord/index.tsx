import React from "react";
interface INoRecord {
  colspan: any;
}
const NoRecord: React.FC<INoRecord> = ({colspan}): JSX.Element => {
  return (
    <>
      <tr>
        <td colSpan={colspan} className="text-center">
          No record found
        </td>
      </tr>
    </>
  );
};
export default NoRecord;
