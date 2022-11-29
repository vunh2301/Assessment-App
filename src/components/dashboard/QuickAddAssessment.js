import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Empty,
  Form,
  Input,
  Radio,
  Row,
  Segmented,
  Spin,
} from "antd";
import { SendOutlined, SettingOutlined } from "@ant-design/icons";
import ShortUniqueId from "short-unique-id";
import QRCode from "qrcode";
import { RealmContext } from "../../context/realmProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  insertAssessment,
  insertAssessments,
  updateAssessments,
} from "../../redux/asessmentsSlice";
import { inviteFormat, ObjectId } from "../../utils";
import moment from "moment";
const generateQR = async (text) => {
  try {
    console.log(await QRCode.toDataURL(text));
  } catch (err) {
    console.error(err);
  }
};
const uid = new ShortUniqueId({
  dictionary: "alphanum_lower",
  length: 5,
});

function QuickAddAssessment(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [assessmentState, setAssessmentState] = useState();
  const [assessmentType, setAssessmentType] = useState([]);
  const { mongo, user, app } = useContext(RealmContext);
  const [advanced, setAdvanced] = useState(null);

  const dispatch = useDispatch();
  const handleChange = (changedValues, allValues) => {
    //console.log({ changedValues, allValues });

    if (allValues.type.length > 0) {
      var types = [];
      allValues.type.forEach((type) => {
        types.push({
          type,
          short: uid(),
        });
      });
      setAssessmentType(types);
    }
    setAssessmentState(inviteFormat({ ...allValues, types }));
  };
  const handleFinish = async (values) => {
    setLoading(true);
    const entities = [];
    for (const i in assessmentType) {
      var target = 0;
      switch (assessmentType[i].type) {
        case "DISC":
          target = 30;
          break;
        case "Motivators":
          target = 10;
          break;
      }
      entities.push({
        ...values,
        title: `${values.firstname} ${values.lastname} - ${assessmentType[i].type[i]}`,
        type: assessmentType[i].type,
        owner: user.id,
        short: assessmentType[i].short,
        language: "Vietnamese",
        status: "Created",
        report: {
          current: 0,
          target,
        },
        created: new Date(),
        updated: new Date(),
      });
    }

    //console.log(entities);
    const { payload } = await dispatch(insertAssessments({ mongo, entities }));
    //console.log(payload);

    //console.log("assessmentState", assessmentState);
    await user.functions.sendmail({
      from: "Assessment 2x47 <reports@a247.vn>",
      to: values.email,
      cc: values.emailCC,
      subject: "Bài đánh giá Assessment 2x47",
      html: assessmentState,
    });
    await dispatch(
      updateAssessments({
        mongo,
        ids: payload.map(({ _id }) => ObjectId(_id)),
        update: { status: "Sented", updated: new Date() },
      })
    );
    form.resetFields();
    setAssessmentState(null);

    setLoading(false);
  };
  return (
    <Spin spinning={loading}>
      <Row gutter={20}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h3>Thông tin khách hàng:</h3>
          <Form
            form={form}
            layout="vertical"
            name="quickAddAssessment"
            onFinish={handleFinish}
            onValuesChange={handleChange}
            initialValues={{
              email: "",
              type: [],
              language: "Vietnamese",
            }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Vui lòng nhập địa chỉ email!",
                },
              ]}
            >
              <Input placeholder="Địa chỉ Email" allowClear />
            </Form.Item>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Họ và Tên lót!",
                    },
                  ]}
                >
                  <Input placeholder="Họ và Tên lót" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Tên!",
                    },
                  ]}
                >
                  <Input placeholder="Tên" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="language" style={{ display: "none" }}>
              <Radio.Group>
                <Radio value="Vietnamese">Vietnamese</Radio>
                <Radio value="English" disabled>
                  English
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="type"
              rules={[
                {
                  required: true,
                  message: "Vui chọn loại Đánh giá!",
                },
              ]}
            >
              <Checkbox.Group>
                <Row>
                  <Col span={8}>
                    <Checkbox value="DISC" style={{ lineHeight: "32px" }}>
                      DISC
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Motivators" style={{ lineHeight: "32px" }}>
                      Motivators
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox
                      value="Sale IQ Plus"
                      style={{ lineHeight: "32px" }}
                    >
                      Sale IQ Plus
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="EIQ 2" style={{ lineHeight: "32px" }}>
                      EIQ 2
                    </Checkbox>
                  </Col>
                  <Col span={16}>
                    <Checkbox
                      value="Learning Styles"
                      style={{ lineHeight: "32px" }}
                    >
                      Learning Styles
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Collapse activeKey={advanced} ghost>
              <Collapse.Panel
                showArrow={false}
                header={null}
                key="advanced"
                forceRender
              >
                <Form.Item
                  name="emailCC"
                  rules={[
                    {
                      type: "email",
                      message: "Vui lòng nhập địa chỉ email!",
                    },
                  ]}
                >
                  <Input placeholder="Địa chỉ Email CC" allowClear />
                </Form.Item>
              </Collapse.Panel>
            </Collapse>
            <Form.Item>
              <Button
                icon={<SettingOutlined />}
                onClick={() => {
                  if (advanced === null) {
                    setAdvanced(["advanced"]);
                  } else {
                    setAdvanced(null);
                  }
                }}
              >
                Nâng cao
              </Button>
              <Button
                style={{ float: "right" }}
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
              >
                Gửi bài đánh giá
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h3>Nội dung email: </h3>
          <Card>
            {assessmentState ? (
              <div dangerouslySetInnerHTML={{ __html: assessmentState }} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}

export default QuickAddAssessment;
