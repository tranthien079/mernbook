import React, { useState, useContext, } from 'react';
import {
  BookOutlined,
  ContactsOutlined,
    GithubOutlined,
    GoogleOutlined,
    HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Flex, Image, Layout, Menu, Space, Tag, theme, Typography } from 'antd';
import { Link, useNavigate, Outlet, useLocation  } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import TYPE_EMPLOYEE from '../../util/userType';
const { Header, Sider, Content } = Layout;
const LayoutAdmin = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    ...(auth.isAuthenticated && auth.user.role === TYPE_EMPLOYEE.admin
      ? [
          {
            key: "user",
            label: <Link to="/user">User</Link>,
            icon: <UsergroupAddOutlined />,
          },
          {
            key: "author",
            label: <Link to="/author">Author</Link>,
            icon: <ContactsOutlined />,
          },
          {
            key: "book",
            label: <Link to="/book">Book</Link>,
            icon: <BookOutlined />,
          },
        ]
      : []),
    ...(auth.isAuthenticated && 
       [TYPE_EMPLOYEE.admin, TYPE_EMPLOYEE.user].includes(auth.user.role)
      ? [
          {
            key: "profile",
            label: <Link to="/profile">Profile</Link>,
            icon: <UserOutlined />,
          },
          {
            key: "chat",
            label: <Link to="/chat">Chat</Link>,
            icon: <MessageOutlined />,
          },
        ]
      : []),
    ...(auth.isAuthenticated
      ? [
          {
            key: "settings",
            label: `Welcome ${auth?.user?.email ?? " "}`,
            icon: <SettingOutlined />,
            children: [
              {
                key: "gg",
                label: <Link to="#">Google</Link>,
                icon: <GoogleOutlined />,
              },
              {
                key: "git",
                label: <Link to="#">Github</Link>,
                icon: <GithubOutlined />,
              },
            ],
          },
          {
            key: "logout",
            label: (
              <Link
                onClick={() => {
                  localStorage.clear("access_token");
                  navigate("/login");
                  setAuth({
                    isAuthenticated: false,
                    user: {
                      email: "",
                      user_name: "",
                      role: ""
                    },
                  });
                }}
              >
                Đăng xuất
              </Link>
            ),
            icon: <LogoutOutlined />,
          },
        ]
      : [
          {
            key: "login",
            label: <Link to="/login">Đăng nhập</Link>,
            icon: <LoginOutlined />,
          },
        ]),
  ];
  return (
    <Layout>
         <Sider 
      theme="light" 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      // breakpoint="lg"
      //   // collapsedWidth="0"
      //   onBreakpoint={(broken) => {
      //     // console.log(broken);
      //   }}
      //   onCollapse={(collapsed, type) => {
      //     // console.log(collapsed, type);
      //   }}
      >
      <div
          style={{
            height: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography.Title
            level={5}
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Role
          </Typography.Title>
          {collapsed ? null : (
            <Tag color='success'>
              <Typography.Text>
                {auth?.user?.role}
              </Typography.Text>
            </Tag>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[currentPath]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
        <Flex justify='space-between' >
            <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}/>
          { auth.isAuthenticated &&  
            <Flex style={{ marginRight: 20 }} align="center" gap={20}>
                <Button
                  type="text"
                  style={{ paddingLeft: 30 }}
                  // onClick={() => navigate("/profile")}
                  icon={
                      (
                      <img
                        style={{
                          borderRadius: "50%",
                          position: "absolute",
                          left: 5,
                          top: 3,
                          height: 25,
                          width: 25,
                          objectFit: "cover",
                        }}
                        src={auth?.user?.avatar}
                      />
                    )
                  }
                >
                 {auth?.user.user_name ?? " "}
                </Button>
              </Flex> }

        </Flex>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '80vh',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
            <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;