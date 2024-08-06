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
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import {
  getAuthorApi,
  deleteAuthorApi,
  createAuthorApi,
  updateAuthorApi,
} from "../../util/athorApi";
import SelectUser from '../../components/SelectUser/SelectUser';

const AuthorPage = () => {
  const [authorList, setAuthorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleUserChange = (value) => {
    setSelectedUserId(value);
  };
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

  const fetchAuthor = async () => {
    setLoading(true);
    const res = await getAuthorApi();
    if (res.status === 'ok') {
      const data = res.data.map(author => ({
        ...author,
        user_name: author.user_id?.name ?? 'null', 
      }));
      setAuthorList(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, []);

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedAuthor(record);
    setIsEditModalVisible(true);
  };

  const handleAddSave = async (values) => {
    const res = await createAuthorApi({ ...values, user_id: selectedUserId });
    if (res && res?.data?.status !== 'error') {
      message.success("Author created successfully");
      fetchAuthor();
      setIsAddModalVisible(false);
      addForm.resetFields();
    } else {
      message.error(res?.data?.message || res?.message);
    }
  };

  const handleDelete = async (record) => {
    const res = await deleteAuthorApi(record._id);
    if (res) {
      message.success("Author deleted successfully");
      setAuthorList(authorList.filter((author) => author._id !== record._id));
    } else {
      message.error("Failed to delete author");
    }
  };

  const handleEditSave = async (values) => {
    const res = await updateAuthorApi(selectedAuthor._id, values);
    if (res) {
      message.success("Author updated successfully");
      setAuthorList(
        authorList.map((author) =>
          author._id === selectedAuthor._id ? { ...author, ...values } : author
        )
      );
      fetchAuthor();
      setIsEditModalVisible(false);
    } else {
      message.error("Failed to update author");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: '_id',
      ...getColumnSearchProps('_id'),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name'),
    },
    {
      title: "User name",
      dataIndex: "user_name",
      key: "user_name",
      ...getColumnSearchProps('user_name'),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this author?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
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
        <h2>Author List</h2>
        <Button type="primary" icon={<PlusCircleFilled />} onClick={handleAdd}>
          Add author
        </Button>
      </div>
      <Table
        dataSource={authorList}
        columns={columns}
        bordered
        rowKey={"_id"}
        size="small"
        loading={loading}
        scroll={{
          x: 1000,
        }}
      />

      {selectedAuthor && (
        <Modal
          title="Edit Author"
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          <Form
            initialValues={{
                ...selectedAuthor,
                user_id: selectedAuthor?.user_id?._id
            }}
            onFinish={handleEditSave}
            key={selectedAuthor._id}
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
            name="user_id"
            label="User"
            rules={[
                {
                    required: true,
                    message: "Please select a user!",
                },
                ]}
            >
                <SelectUser onChange={handleUserChange} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                Save
                </Button>
            </div>
          </Form>
        </Modal>
      )}

      <Modal
        title="Add Author"
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
            name="user_id"
            label="User"
            rules={[
              {
                required: true,
                message: "Please select a user!",
              },
            ]}
          >
          <SelectUser onChange={handleUserChange} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button onClick={() => setIsAddModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthorPage;
