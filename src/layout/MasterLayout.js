import { Button } from "antd";
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Login from "../components/Login";
import { RealmContext } from "../context/realmProvider";

function MasterLayout(props) {
  const { logout, isLoggedIn } = useContext(RealmContext);

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
        <Outlet />
        <h3>Footer</h3>
      </div>
    );
  } else {
    return <Login />;
  }
}

export default MasterLayout;
