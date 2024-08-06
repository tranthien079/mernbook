import React, { useEffect, useRef, useState } from "react";
import {
  Space,
  Table,
  Modal,
  Button,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Tooltip,
  Flex,
  Tag,
  Typography,
  Select
} from "antd";
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusCircleFilled } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { getUserApi, deleteUserApi, updateUserApi, createUserApi } from "../../util/api";

const UserPage = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addForm] = Form.useForm();
  const { Option } = Select;
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const fetchUser = async () => {
    setLoading(true);
    const res = await getUserApi();
    if (!res?.message) {
      setUserList(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsEditModalVisible(true);
  };

  const handleAddSave = async (values) => {
    const { name, email, password, role } = values;
    const res = await createUserApi(name, email, password, role);
    if (res) {
      message.success("User created successfully");
      fetchUser();
      setIsAddModalVisible(false);
      addForm.resetFields(); // Clear form fields
    } else {
      message.error("Failed to create user");
    }
  };

  const handleDelete = async (record) => {
    const res = await deleteUserApi(record._id);
    if (res) {
      message.success("User deleted successfully");
      setUserList(userList.filter((user) => user._id !== record._id));
    } else {
      message.error("Failed to delete user");
    }
  };

  const handleEditSave = async (values) => {
    const res = await updateUserApi(selectedUser._id, values);
    if (res) {
      message.success("User updated successfully");
      setUserList(
        userList.map((user) =>
          user._id === selectedUser._id ? { ...user, ...values } : user
        )
      );
      setIsEditModalVisible(false);
    } else {
      message.error("Failed to update user");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: '_id',
      // responsive: ['md'],
      ...getColumnSearchProps('_id'),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // responsive: ['md'],
      ...getColumnSearchProps('name'),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // responsive: ['md'],
      ...getColumnSearchProps('email'),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      // responsive: ['md'],
      filters: [
        {
          text: 'admin',
          value: 'admin',
        },
        {
          text: 'user',
          value: 'user',
        },
     
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.role.startsWith(value),
      render: (role) => {
        const tagColor = role === 'admin' ? 'red' : 'success';
        return (
          <Tag color={tagColor}>
            <Typography.Text>
              {role.toUpperCase()}
            </Typography.Text>
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      // fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xác nhận"
            cancelText="Hủy bỏ"
          >
            <Tooltip title="Xóa">
              <Button type="primary" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          padding: "10px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>User List</h2>
        <Button type="primary"  icon={<PlusCircleFilled />}  onClick={handleAdd}>
          Add User
        </Button>
      </div>
      <Table
        dataSource={userList}
        columns={columns}
        bordered
        rowKey={"_id"}
        size="small"
        loading={loading}   
        scroll={{
          x: 1000,
        }}
      />
        {selectedUser && (
          <Modal
            title="Edit User"
            visible={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            <Form
              initialValues={selectedUser}
              onFinish={handleEditSave}
              key={selectedUser._id}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              labelAlign="left"
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please enter the email!",
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[
                  {
                    required: true,
                    message: "Please enter the role!",
                  },
                ]}
              >
                <Select placeholder="Select a user">
                    <Option key="admin" value="admin">
                    </Option>
                    <Option key="user" value="user">
                    </Option>
                </Select>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button onClick={() => setIsEditModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form> {/* Closing tag for Form */}
          </Modal>
        )}


      <Modal
        title="Add User"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={addForm}
          onFinish={handleAddSave}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          labelAlign="left"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter the name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter the email!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please enter the role!",
              },
            ]}
          >
            {/* <Input /> */}
            <Select placeholder="Select a user">
                <Option key="admin" value="admin">
                </Option>
                <Option key="user" value="user">
                </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter the password!",
              },
            ]}
          >
            <Input.Password />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button onClick={() => setIsAddModalVisible(false)}>
                Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                Save
                </Button>
            </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
