import { Button, ConfigProvider, DatePicker, Layout, Space, Spin } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import Login from "../components/login/Login";
import { RealmContext } from "../context/realmProvider";
import {
  fetchAssessments,
  getUser,
  selectUser,
} from "../redux/asessmentsSlice";

function MasterLayout(props) {
  const { logout, isLoggedIn, mongo, user } = useContext(RealmContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      dispatch(getUser({ mongo, user }));
      dispatch(fetchAssessments({ mongo, user })).then(() => {
        setLoading(false);
      });
    }
  }, [user]);
  if (isLoggedIn) {
    return (
      <Spin spinning={loading} size='large'>
        <Header
          style={{
            height: "64px",
            background: "#222",
            color: "white",
          }}>
          <div
            style={{
              display: "inline-block",
              height: "64px",
              padding: "18px 0 18px 20px",
            }}>
            <img
              style={{ height: "100%" }}
              src='/images/a247logo.webp'
              alt=''
            />
          </div>
          <Space style={{ float: "right", padding: "12px" }}>
            <div
              style={{
                display: "inline-block",
                marginRight: "20px",
                textAlign: "right",
              }}>
              <h3 style={{ margin: 0 }}>{currentUser.fullname}</h3>
              <small>
                <strong>
                  {Intl.NumberFormat("en-US").format(currentUser.credit)}
                </strong>{" "}
                Credit{" "}
              </small>
            </div>
            <Button
              type='primary'
              icon={<LogoutOutlined />}
              onClick={() => {
                logout();
              }}>
              Thoát
            </Button>
          </Space>
        </Header>
        <Layout style={{ padding: "20px" }}>
          <Outlet />
        </Layout>

        <p style={{ padding: "20px", textAlign: "center" }}>
          © 2022 WoW Multimedia.
        </p>
      </Spin>
    );
  } else {
    return <Login />;
  }
}

export default MasterLayout;
