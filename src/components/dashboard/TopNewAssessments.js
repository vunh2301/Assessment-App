import { Card, Table } from "antd";
import React, { useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  selectAssessments,
  selectTopNewAssessments,
} from "../../redux/asessmentsSlice";

function TopNewAssessments(props) {
  const asessments = useSelector(selectTopNewAssessments);
  useEffect(() => {}, [asessments]);
  return (
    <Card>
      <h3>Credits: 9,999 / 10,000</h3>
      {/* <Table
        bordered
        size='small'
        rowKey='_id'
        columns={[
          { title: "Title", dataIndex: "email" },
          {
            title: "Date",
            dataIndex: "created",
            render: created => moment(created).format("ll"),
          },
          { title: "Status", dataIndex: "status" },
        ]}
        dataSource={asessments}
      /> */}
    </Card>
  );
}

export default TopNewAssessments;
