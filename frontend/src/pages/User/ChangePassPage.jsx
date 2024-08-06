import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Typography } from "antd";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/Context/AuthContext";
import { updatePasswordUser } from "../../util/api";

const ChangePassPage = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const onFinish = async (values) => {
    if (values.oldPassword === values.password) {
      notification.error({
        message: "Mật khẩu mới không được trùng với mật khẩu cũ",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await updatePasswordUser({
        old_password: values.oldPassword,
        new_password: values.password,
        user_id: auth?.user?._id
      });
      if(result && result.data.status != 'error') {
        notification.success({
          message: "Cập nhật mật khẩu thành công",
        });
      } else {
        notification.error({
          message: result.data.message || result.message,
        });
      }
     
    } catch (err) {

      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Typography.Title title="Đổi mật khẩu" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Form
          name="change-pass"
          onFinish={onFinish}
          disabled={loading}
          style={{ width: 500 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
          initialValues={{
            oldPassword: "",
            password: "",
            confirm: "",
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
              {
                min: 6,
                message: "Password phải lớn hơn 6 ký tự!",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              {
                required: true,
                message: "Nhập password!",
              },
              {
                min: 6,
                message: "Password phải lớn hơn 6 ký tự!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Nhập xác nhận password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password chưa khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              size="large"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
              size="large"
              style={{ marginBottom: 10 }}
              loading={loading}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ChangePassPage;
