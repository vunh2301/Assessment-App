import { Avatar, Button, Card, Table, Tag, Tooltip } from "antd";
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
  return (
    <Card>
      <Table
        bordered
        size='small'
        rowKey='_id'
        columns={[
          {
            title: "Assessment",
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
                  <Tooltip title='Assessment Link'>
                    <a href={`https://a247.vn/${entity.short}`}>
                      <LinkOutlined />
                    </a>
                  </Tooltip>{" "}
                  <br />{" "}
                  <small>
                    <strong>Email: </strong>
                    {entity.email}
                  </small>
                </>
              );
            },
          },
          //{ title: "Email", dataIndex: "email" },
          // {
          //   title: "Ngày tạo",
          //   dataIndex: "created",
          //   render: created => moment(created).format("ll"),
          // },
          {
            title: "Báo cáo",
            dataIndex: "report",
            render: (_, entity) => (
              <>
                {entity.title}{" "}
                <a href={`https://a247.vn/${entity.short}`}>
                  <CloudDownloadOutlined />
                </a>
              </>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, entity) => (
              <>
                <Tag color='#108ee9'>{entity.status}</Tag>{" "}
                {entity.status === "Created" ? (
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
                <small>{moment(entity.created).format("ll")}</small>
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
