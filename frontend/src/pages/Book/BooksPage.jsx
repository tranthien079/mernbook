import React, { useEffect, useRef, useState } from "react";
import {
    DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusCircleFilled,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Row, Col, Button, Flex, Input, Form, Drawer, Space, message, Upload, InputNumber, Popconfirm, Tooltip, Pagination, Table, Image } from "antd";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../../src/firebase';
import { getBookApi, updateBookApi, deleteBookApi, createBookApi } from '../../util/bookApi'
import SelectAuthor from "../../components/SelectAuthor/SelectAuthor";
import Highlighter from "react-highlight-words";

const BooksPage = () => {
    const [addForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] =  useState();
    const [loading, setLoading] = useState(false);
    const [bookList, setBookList] = useState([]);
    const [selectedBookHandle, setSelectedBookHandle] = useState(null);
    const [selectedAuthorId, setSelectedAuthorId] = useState(null);
    const [reload, setReload] = useState(true);

    const [searchKey, setSearchKey] = useState('');
    const [limit, setLimit] = useState(0);
    const [page, setPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);

    //search table for keywords
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
  

    // handle form add and edit book
    const onFinish = async (values) => {
        try {
        if (selectedBookHandle) {
            // Update the book
            const updatedBook = {
            ...values,
            image: imageUrl,
            };
            await updateBookApi(selectedBookHandle._id,updatedBook);
            message.success('Book updated successfully');
        } else {
            // Create a new book
            const newBook = {
            ...values,
            image: imageUrl,
            };
            await createBookApi(newBook);
            message.success('Book created successfully');
        }
        fetchBook(); // Refresh the book list
        onClose(); // Close the drawer and reset fields
        } catch (error) {
        message.error('Failed to save the book');
        console.error(error);
        }
    };

    // Open Drawer
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        addForm.resetFields();
        setImageUrl(null);
        setSelectedBookHandle(null);
    };

    // fetch Book
    const fetchBook = async () => {
        try {
        setLoading(true);
        const res = await getBookApi(limit,  page - 1 , searchKey);
        console.log(res)
        if (res.status === 'ok') {
        const data = res.data.map(book => ({
            ...book,
            author_name: book.author_id?.name ?? 'null', 
        }));
        setBookList(data);
        setTotalBooks(res.total);
        }
        } catch (error) {
        console.error(error)
        } finally {
        setLoading(false);
        }
    };

    //Click button delete book
    const handleDelete = async (book) => {
        try {
        await deleteBookApi(book._id);
        message.success('Book deleted successfully');
        fetchBook(); 
        } catch (error) {
        message.error('Failed to delete the book');
        console.error(error);
        }
    };
    //Click button edit book
    const handleEdit = (book) => {
        setSelectedBookHandle(book);
        setImageUrl(book.image);
        addForm.setFieldsValue({
        title: book.title,
        price: book.price,
        link: book.link,
        description: book.description,
        author_id: book.author_id._id,
        });
        setOpen(true);
    };
    
    const handleAuthorChange = (value) => {
        setSelectedAuthorId(value);
    };

    useEffect(() => {
        fetchBook();
    }, [searchKey, limit, page]);
  
    //Upload Image to Firebase
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

      const columns = [
        {
          title: "Id",
          dataIndex: "_id",
          key: '_id',
          // responsive: ['md'],
          ...getColumnSearchProps('_id'),
        },
        {
            title: "Image",
            dataIndex: "image",
            key: 'image',
            // responsive: ['md'],
            render: (image) => {
                return (
                  <Image src={image} alt="image" width={100}/>
                );
              },
          },
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
          // responsive: ['md'],
          ...getColumnSearchProps('title'),
        },
        {
          title: "Link",
          dataIndex: "link",
          key: "link",
          // responsive: ['md'],
          ...getColumnSearchProps('link'),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            // responsive: ['md'],
            ...getColumnSearchProps('price'),
          },
        {
        title: "Author",
        dataIndex: "author_name",
        key: "author_name",
        // responsive: ['md'],
          ...getColumnSearchProps('author_name'),
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
    <>
     <div
        style={{
          padding: "10px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        >
        <Flex   gap="middle" vertical>
            <h2>Book List</h2>
        </Flex>

        <Button type="primary"  icon={<PlusCircleFilled />}  onClick={showDrawer}>
          Add Book
        </Button>
      </div>
      <Table
        dataSource={bookList}
        columns={columns}
        bordered
        rowKey={"_id"}
        size="small"
        scroll={{
          x: 1000,
        }}
        loading={loading}
    
      />
      <Drawer
         title={selectedBookHandle ? "Edit Book" : "Add Book"}
         width={720}
         onClose={onClose}
         open={open}
         styles={{
           body: {
             paddingBottom: 80,
           },
         }}
        //  extra={
        //    <Space>
        //      <Button onClick={onClose}>Cancel</Button>
        //      <Button onClick={onClose} type="primary">
        //        Submit
        //      </Button>
        //    </Space>
        //  }
      >
        <Form
          form={addForm}
          onFinish={onFinish}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          labelAlign="left"
        >
          <Form.Item 
           name="image"
           label="Avatar"
           valuePropName="fileList"
           getValueFromEvent={(e) => {
             if (Array.isArray(e)) {
               return e;
             }
             return e && e.fileList;
           }}
          //  rules={[
          //    {
          //      required: true,
          //      message: 'Please upload an avatar!',
          //    },
          //  ]}
          >
            <Upload
              name="image"
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
            name="title"
            label="Book name"
            rules={[
              {
                required: true,
                message: "Please enter the book name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Book link"
            rules={[
              {
                required: true,
                message: "Please enter the book link!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please enter the price!",
              },
           
            ]}
          >
            <InputNumber prefix="VND" min={1}  onChange={() => {}}  style={{
        width: '100%',
      }}/>
          </Form.Item>
          <Form.Item
            name="author_id"
            label="Author"
            rules={[
              {
                required: true,
                message: "Please enter author!",
              },
            ]}
          >
             <SelectAuthor handleChange={handleAuthorChange} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter the description!",
              },
            ]}
          >
            <Input.TextArea rows={5} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button onClick={() => setOpen(false)}>
                Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                Save
                </Button>
            </div>
        </Form>
      </Drawer>
    </>
  )
}

export default BooksPage