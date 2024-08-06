import React, { useContext } from "react";
import { Button, Col, Divider, Row, Form, Input, notification, Typography } from "antd";
import { loginApi } from "../../util/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Context/AuthContext";
import { ArrowLeftOutlined, ArrowUpOutlined, IdcardOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import background from '/background.jpg'

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);


  const onFinish = async (values) => {
    const { email, password } = values;
    const res = await loginApi(email, password);
    if (res && res.status === 'ok') {
      localStorage.setItem("access_token", res.access_token);

      notification.success({
        message: "Login user successfully",
        showProgress: true,
        // description: "Success",
      });
      setAuth({
        isAuthenticated: true,
        user: {
          _id: res?.user?._id,
          email: res?.user?.email,
          user_name: res?.user?.name || '',
          role: res?.user?.role,
          avatar: res?.user?.avatar ?? "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
        },
      });
      
        navigate("/");
     
    } else {
      notification.error({
        message: "Login user failed",
        description: res?.message ?? "Error",
        showProgress: true,
      });
    }
  };

  return (
    <div style={{ backgroundImage: `url(${background})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', minWidth: '100%', }}>
    <Row justify={"center"} align={"middle"} style={{ height: '100%'}} >
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#fff",
          }}
        >
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
          >
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              Đăng nhập
            </Typography.Title>
            <Form.Item
              label="Email"
              name="email"
              prefix={<UserOutlined className="site-form-item-icon" />}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/')}>
              <ArrowLeftOutlined /> Quay lại trang chủ
            </span>
            <div style={{ textAlign: 'center' }}>
              Bạn chưa có tài khoản. <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/register')}>Đăng ký</span>
            </div>
          </Form>
        </fieldset>
      </Col>
    </Row>
  </div>
  );
};

export default LoginPage;
