import { Button } from "antd";
import React, { useContext } from "react";
import { RealmContext } from "../context/realmProvider";

function Login(props) {
  const { login } = useContext(RealmContext);
  const handleLogin = () => {
    login("emailPassword", "ceo@wowmultimedia.vn", "050506Thyvu");
  };
  return (
    <div style={{ padding: "20px" }}>
      <Button type='primary' onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}

export default Login;
