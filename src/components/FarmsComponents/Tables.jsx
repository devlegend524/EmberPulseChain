import React, { useRef } from "react";
import { useTable } from "uikit";
import { motion } from "framer-motion";
import Row from "./Table/Row";

export default function FarmTables(props) {
  const tableWrapperEl = useRef();

  const { data, columns, userDataReady } = props;
  const { rows } = useTable(columns, data, {
    sortable: true,
    sortColumn: "farm",
  });

  return (
    <div
      ref={tableWrapperEl}
      className="overflow-visible "
    >
      <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
      <table className="border-collapse rounded-sm mx-auto w-full main_bg">
        <tbody>
          {rows.map((row) => {
            return (
              <Row
                {...row.original}
                userDataReady={userDataReady}
                key={`table-row-${row.id}`}
              />
            );
          })}
        </tbody>
      </table>
      </motion.div>
    </div>
  );
}
