import { Avatar, Button, Card, Progress, Table, Tag, Tooltip } from "antd";
import {
  CloudDownloadOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAssessment,
  selectAssessments,
} from "../../redux/asessmentsSlice";
import "moment/locale/vi";
import { RealmContext } from "../../context/realmProvider";

function Assessments(props) {
  const { mongo } = useContext(RealmContext);
  const asessments = useSelector(selectAssessments);
  const dispatch = useDispatch();
  const handleDelete = id => {
    dispatch(deleteAssessment({ mongo, id }));
  };
  const statusColor = status => {
    switch (status) {
      case "Created":
        return "#999";
      case "Sented":
        return "#2db7f5";
      case "Opened":
      case "Doing":
        return "#108ee9";
      case "Completed":
        return "#87d068";
    }
    return "#2db7f5";
  };
  return (
    <Card>
      <Table
        rowKey='_id'
        columns={[
          {
            title: "Bài đánh giá",
            dataIndex: "type",
            render: (_, entity) => {
              var avatar = null;
              switch (entity.type) {
                case "DISC": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge6.jpg";
                  break;
                }
                case "Motivators": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge5.jpg";
                  break;
                }
                case "Sale IQ Plus": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge1.jpg";
                  break;
                }
                case "EIQ 2": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge4.jpg";
                  break;
                }
                case "Learning Styles": {
                  avatar =
                    "https://actioncoachassessments.com/UploadArea/269/badge2.jpg";
                  break;
                }
              }
              return (
                <>
                  <Tooltip title={entity.type}>
                    <Avatar src={avatar} />
                  </Tooltip>{" "}
                  {entity.type} - {entity.language}{" "}
                  <Tooltip title='Liên kết bài đánh giá'>
                    <a
                      href={`https://link.a247.vn/${entity.short}`}
                      target='_blank'>
                      <LinkOutlined />
                    </a>
                  </Tooltip>{" "}
                  <br />{" "}
                  {/* <small>
                    <strong>Email: </strong>
                    {entity.email}
                  </small> */}
                </>
              );
            },
          },
          { title: "Email", dataIndex: "email" },
          {
            title: "Ngày tạo",
            dataIndex: "created",
            render: created => moment(created).format("DD/MM/YYYY"),
          },
          {
            title: "Kết quả",
            dataIndex: "report",
            render: (_, entity) => (
              <>
                <Progress
                  type='circle'
                  percent={entity.percent ? entity.percent : 0}
                  width={50}
                  style={{
                    marginRight: 8,
                  }}
                />
                {/* {entity.firstname} {entity.lastname}{" "}
                <a href={`https://a247.vn/${entity.short}`} target='_blank'>
                  <CloudDownloadOutlined />
                </a> */}
              </>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, entity) => (
              <>
                <Tag color={statusColor(entity.status)}>{entity.status}</Tag>{" "}
                {entity.status !== "Completed" ? (
                  <Button
                    size='small'
                    type='primary'
                    danger
                    onClick={() => {
                      handleDelete(entity._id);
                    }}
                    icon={<DeleteOutlined />}
                  />
                ) : (
                  ""
                )}
                <br />
                <small>{moment(entity.updated).format("ll")}</small>
              </>
            ),
          },
        ]}
        dataSource={asessments}
      />
    </Card>
  );
}

export default Assessments;
