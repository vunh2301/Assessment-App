import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
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
import { ObjectId } from "../../utils";
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
  const loading = useSelector(state => state.assessments.status === "loading");
  const [form] = Form.useForm();
  const { mongo, user } = useContext(RealmContext);
  const dispatch = useDispatch();
  const handleFinish = async values => {
    const entities = [];
    for (const i in values.type) {
      entities.push({
        ...values,
        title: `${values.firstname} ${values.lastname} - ${values.type}`,
        type: values.type[i],
        owner: ObjectId(user.id),
        short: uid(),
        status: "Created",
        created: new Date(),
      });
    }

    //console.log(entities);
    const { payload } = await dispatch(insertAssessments({ mongo, entities }));
    console.log(payload);
    await dispatch(
      updateAssessments({
        mongo,
        ids: payload.map(({ _id }) => ObjectId(_id)),
        entities: { status: "Sented" },
      })
    );
    // values.assessment_type.forEach(assessment_type => {
    //   const short = uid();
    //   const entity = {
    //     ...values,
    //     assessment_type: assessment_type,
    //     status: "Created",
    //     short,
    //   };
    //   console.log(entity);
    //   dispatch(insertAssessment({ mongo, user, entity }));
    // });
  };
  return (
    <Card id='main'>
      <Spin spinning={loading}>
        <h3>Tạo bài test</h3>
        <Form
          size='large'
          form={form}
          layout='vertical'
          name='quickAddAssessment'
          onFinish={handleFinish}
          initialValues={{
            email: "",
            type: ["DISC"],
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
            <Input placeholder='Email' />
          </Form.Item>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name='firstname'>
                <Input placeholder='First Name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='lastname'>
                <Input placeholder='Last Name' />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name='language'>
            <Radio.Group>
              <Radio value='Vietnamese'>Vietnamese</Radio>
              <Radio value='English'>English</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='type'>
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
                  <Checkbox value='Sale IQ Plus' style={{ lineHeight: "32px" }}>
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
            <Button style={{ float: "right" }} type='primary' htmlType='submit'>
              Tạo bài test
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}

export default QuickAddAssessment;
