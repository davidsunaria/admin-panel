import React, { FC, Fragment } from "react";
interface ITableHeader {
  fields: Array<{ key: string, value: string }>;
}
const TableHeader: FC<ITableHeader> = (data) => {
  return (
    <Fragment>
      <thead>
        <tr>
          {data && data.fields.length > 0 &&
            data.fields.map((val: any, index: number) => (
              <th key={index} scope="col">{val?.value}</th>
            ))}
        </tr>
      </thead>
    </Fragment>
  )
}

export default TableHeader;