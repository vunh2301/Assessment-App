import {
  Avatar,
  Button,
  Card,
  Pagination,
  Popconfirm,
  Progress,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
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
import { randomHexColor } from "../../utils";

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
        id='body-view'
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
                <Space>
                  <Tooltip title={entity.type}>
                    <Avatar size={52} src={avatar} />
                  </Tooltip>
                  <div>
                    <h4 style={{ margin: 0 }}>
                      {entity.firstname} {entity.lastname}
                    </h4>
                    <span style={{ margin: 0 }}>
                      <Tooltip title='Đi tới bài đánh giá'>
                        <a
                          href={`https://link.a247.vn/${entity.short}`}
                          target='_blank'>
                          {entity.type} <LinkOutlined />
                        </a>
                      </Tooltip>
                    </span>
                  </div>
                </Space>
              );
            },
          },
          {
            title: "Email",
            sorter: (a, b) => a.email > b.email,
            dataIndex: "email",
            render: email => (
              <span style={{ fontSize: "13px", color: "#5f6368" }}>
                {email}
              </span>
            ),
          },
          // {
          //   title: "Tags",
          //   dataIndex: "tags",
          //   render: (_, { tags }) => (
          //     <>
          //       {tags
          //         ? tags.map(tag => {
          //             let color = randomHexColor();
          //             return (
          //               <Tag color={color} key={tag}>
          //                 {tag.toUpperCase()}
          //               </Tag>
          //             );
          //           })
          //         : ""}
          //     </>
          //   ),
          // },
          {
            title: "Ngày tạo",
            dataIndex: "created",
            sorter: (a, b) => a.created - b.created,
            align: "center",
            width: "180px",
            render: created => {
              return (
                <h4 style={{ fontSize: "13px", color: "#5f6368", margin: 0 }}>
                  {moment().diff(moment(created), "hours") >= 24
                    ? moment(created).format("ll")
                    : moment(created).fromNow()}
                </h4>
              );
            },
          },
          {
            title: "Hết hạn",
            dataIndex: "expired",
            align: "center",
            width: "120px",
            render: (_, { created, status }) => {
              if (status === "Completed") {
                return (
                  <span style={{ fontSize: "13px", color: "#5f6368" }}>
                    Hoàn thành
                  </span>
                );
              } else {
                return (
                  <h4 style={{ fontSize: "13px", color: "#1677ff", margin: 0 }}>
                    Còn {moment(created).add(30, "d").diff(moment(), "days")}{" "}
                    ngày
                  </h4>
                );
              }
            },
          },
          {
            title: "Kết quả",
            dataIndex: "report",
            align: "center",
            width: "125px",
            render: (_, entity) => (
              <>
                {entity.report && entity.report.download ? (
                  <h4>
                    <a href={entity.report.download} target='_blank'>
                      Tải báo cáo <CloudDownloadOutlined />
                    </a>
                  </h4>
                ) : (
                  <Progress
                    type='circle'
                    percent={Math.floor(
                      entity.report && entity.report.current
                        ? entity.report.current
                        : 0
                    )}
                    width={50}
                    style={{
                      marginRight: 8,
                    }}
                  />
                )}
                {/* {entity.firstname} {entity.lastname}{" "}
                <a href={`https://a247.vn/${entity.short}`} target='_blank'>
                  <CloudDownloadOutlined />
                </a> */}
              </>
            ),
          },
          {
            title: "Trạng thái",
            align: "center",
            width: "130px",

            sorter: (a, b) => a.status > b.status,
            dataIndex: "status",
            render: (_, entity) => (
              <>
                <Tag color={statusColor(entity.status)}>{entity.status}</Tag>
                {entity.status === "Created" || entity.status === "Sented" ? (
                  <Popconfirm
                    title='Bạn muốn xoá?'
                    onConfirm={() => handleDelete(entity._id)}>
                    <Button
                      size='small'
                      type='primary'
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                ) : (
                  ""
                )}
                <br />
                <span style={{ fontSize: "12px", color: "#5f6368" }}>
                  {moment().diff(moment(entity.updated), "hours") >= 24
                    ? moment(entity.updated).format("ll")
                    : moment(entity.updated).fromNow()}
                </span>
              </>
            ),
          },
        ]}
        dataSource={asessments}
        pagination={{
          total: asessments.length,
          pageSizeOptions: [10, 20, 50, 100, 200],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </Card>
  );
}

export default Assessments;
