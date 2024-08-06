import { Button, Flex, Form, Input, message, Upload } from "antd";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/Context/AuthContext";
import { updateUserByEmailApi } from "../../util/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import app from '../../../src/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [imageUrl, setImageUrl] =  useState(auth?.user?.avatar);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = async ({ file }) => {
    if (file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (file.originFileObj) {
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file.originFileObj);
        const downloadURL = await getDownloadURL(storageRef);
        setImageUrl(downloadURL);
        message.success('Avatar uploaded successfully');
      } catch (error) {
        message.error('Failed to upload avatar');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const updateInfo = async (values) => {
    try {
      setLoading(true);
      const updatedUser = {
        ...values,
        avatar: imageUrl || auth.user.avatar,
      };
      const res = await updateUserByEmailApi(auth?.user?.email, updatedUser);
      if (res) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res?.data?.email,
            user_name: res?.data?.name,
            role: res?.data?.role,
            avatar: res?.data?.avatar || "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
          }
        });
        message.success("User updated successfully");
      }
    } catch (error) {
      message.error("Failed to update user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Flex justify='space-between'>
        <h2>Cập nhật tài khoản</h2>
        <Link to="/change-password">Đổi mật khẩu</Link>
      </Flex>
      <Flex justify="center" align="center">
        <Form
          initialValues={{
            name: auth?.user?.user_name,
            email: auth?.user?.email,
            role: auth?.user?.role,
            avatar: auth?.user?.avatar,
          }}
          onFinish={updateInfo}
          style={{ width: 500 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
        >
          <Form.Item label="Avatar">
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              accept="image/png,image/jpeg,image/jpg"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar"  style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              { type: "email", message: "Vui lòng nhập đúng format!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Vui lòng nhập role" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default ProfilePage;
