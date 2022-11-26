import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Radio,
  Row,
  Spin,
} from "antd";
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
const generateQR = async text => {
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

  const dispatch = useDispatch();
  const handleChange = (changedValues, allValues) => {
    //console.log({ changedValues, allValues });

    if (allValues.type.length > 0) {
      var types = [];
      allValues.type.forEach(type => {
        types.push({
          type,
          short: uid(),
        });
      });
      setAssessmentType(types);
    }
    setAssessmentState(inviteFormat({ ...allValues, types }));
  };
  const handleFinish = async values => {
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
        <Col span={12}>
          <h3>Thông tin khách hàng:</h3>
          <Form
            size='large'
            form={form}
            layout='vertical'
            name='quickAddAssessment'
            onFinish={handleFinish}
            onValuesChange={handleChange}
            initialValues={{
              email: "",
              type: [],
              language: "Vietnamese",
            }}>
            <Form.Item
              name='email'
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Vui lòng nhập địa chỉ email!",
                },
              ]}>
              <Input placeholder='Địa chỉ Email' />
            </Form.Item>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name='firstname'
                  rules={[
                    {
                      required: true,
                    },
                  ]}>
                  <Input placeholder='Họ và Tên lót' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='lastname'
                  rules={[
                    {
                      required: true,
                    },
                  ]}>
                  <Input placeholder='Tên' />
                </Form.Item>
              </Col>
            </Row>
            {/* <Form.Item name='language'>
            <Radio.Group>
              <Radio value='Vietnamese'>Vietnamese</Radio>
              <Radio value='English'>English</Radio>
            </Radio.Group>
          </Form.Item> */}
            <Form.Item
              name='type'
              rules={[
                {
                  required: true,
                },
              ]}>
              <Checkbox.Group>
                <Row>
                  <Col span={8}>
                    <Checkbox value='DISC' style={{ lineHeight: "32px" }}>
                      DISC
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value='Motivators' style={{ lineHeight: "32px" }}>
                      Motivators
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox
                      value='Sale IQ Plus'
                      style={{ lineHeight: "32px" }}>
                      Sale IQ Plus
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value='EIQ 2' style={{ lineHeight: "32px" }}>
                      EIQ 2
                    </Checkbox>
                  </Col>
                  <Col span={16}>
                    <Checkbox
                      value='Learning Styles'
                      style={{ lineHeight: "32px" }}>
                      Learning Styles
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item>
              <Button
                style={{ float: "right" }}
                type='primary'
                htmlType='submit'>
                Gửi bài đánh giá
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <h3>Nội dung email:</h3>
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
