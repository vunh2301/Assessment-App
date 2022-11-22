import { Button, ConfigProvider, DatePicker, Layout } from "antd";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../components/Login";
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
      <div style={{ padding: "20px" }}>
        <Button
          type='primary'
          onClick={() => {
            logout();
          }}>
          Logout
        </Button>
        <h3>Credit: 10,000</h3>
        <Layout style={{ padding: "20px" }}>
          <Outlet />
        </Layout>

        <h3>Footer</h3>
      </div>
    );
  } else {
    return <Login />;
  }
}

export default MasterLayout;
