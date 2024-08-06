import React from "react";
import { Button, Checkbox, Col, Form, Input, Row,Typography, notification } from "antd";
import { createUserApi } from "../../util/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, IdcardOutlined ,UserOutlined ,LockOutlined   } from "@ant-design/icons";
import background from '/background.jpg'

const RegisterPage = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { name, email, password, role = "user" } = values;

    const res = await createUserApi(name, email, password,role);

    if (res && res?.data?.status !== 'error') {
      notification.success({
        message: "Create user successfully",
        showProgress: true,
      });
      navigate("/login");
    } else {
      notification.error({
        message: "Create user failed",
        description: res?.data?.message,
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
              margin: "5px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor:"#fff"
            }}
          >
           
            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
                <Typography.Title level={2} style={{ textAlign: "center" }}>
                  Đăng ký
                </Typography.Title>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                ]}
              >
                <Input 
                prefix={<IdcardOutlined  className="site-form-item-icon" />}
                
                />
              </Form.Item>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên!",
                  },
                ]}
              >
                <Input 
                prefix={<UserOutlined className="site-form-item-icon" />}
                
                />
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
                <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                
                />
              </Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đăng ký
                </Button>
              <span style={{ color: 'blue', cursor: 'pointer'}} onClick={() => navigate('/')}><ArrowLeftOutlined/> Quay lại trang chủ</span>
                <div style={{ textAlign: 'center' }}>
                  Bạn đã có tài khoản. <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/login')}>Đăng nhập</span>
                </div>
            </Form>
          </fieldset>
        </Col>
      </Row>
    </div>
  );
  
};

export default RegisterPage;
