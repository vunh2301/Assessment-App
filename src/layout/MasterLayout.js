import { Button, ConfigProvider, DatePicker, Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../components/login/Login";
import { RealmContext } from "../context/realmProvider";
import { fetchAssessments } from "../redux/asessmentsSlice";

function MasterLayout(props) {
  const { logout, isLoggedIn, mongo, user } = useContext(RealmContext);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchAssessments({ mongo, user }));
    }
  }, [user]);
  if (isLoggedIn) {
    return (
      <div>
        <Header style={{ padding: "20px", textAlign: "right" }}>
          <small>(10,000) Credit </small>
          <Button
            type='primary'
            onClick={() => {
              logout();
            }}>
            Logout
          </Button>
        </Header>
        <Layout style={{ padding: "20px" }}>
          <Outlet />
        </Layout>

        <p style={{ padding: "20px", textAlign: "center" }}>
          © 2022 WoW Multimedia.
        </p>
      </div>
    );
  } else {
    return <Login />;
  }
}

export default MasterLayout;
