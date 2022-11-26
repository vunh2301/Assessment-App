import { Card, Checkbox, Col, Form, Input, Row } from "antd";
import React from "react";
import Assessments from "../components/dashboard/Assessments";
import QuickAddAssessment from "../components/dashboard/QuickAddAssessment";
import TopNewAssessments from "../components/dashboard/TopNewAssessments";

function Dashboard(props) {
  return (
    <>
      <Card>
        <QuickAddAssessment />
      </Card>
      <Row style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Assessments />
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
