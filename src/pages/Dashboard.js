import { Card, Checkbox, Col, Form, Input, Row } from "antd";
import React from "react";
import Assessments from "../components/dashboard/Assessments";
import QuickAddAssessment from "../components/dashboard/QuickAddAssessment";
import TopNewAssessments from "../components/dashboard/TopNewAssessments";

function Dashboard(props) {
  return (
    <>
      <Row gutter={20}>
        <Col span={12}>
          <QuickAddAssessment />
        </Col>
        <Col span={12}>
          <TopNewAssessments />
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Assessments />
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
