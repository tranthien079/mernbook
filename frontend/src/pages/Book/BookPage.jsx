import React, { useEffect, useRef, useState } from "react";
import {
    DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusCircleFilled,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Row, Col, Button, Flex, Input, Form, Drawer, Space, message, Upload, InputNumber, Popconfirm, Tooltip, Pagination, Spin } from "antd";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../../src/firebase';
import { getBookApi, updateBookApi, deleteBookApi, createBookApi } from '../../util/bookApi'
import SelectAuthor from "../../components/SelectAuthor/SelectAuthor";

const BookPage = () => {
  const { Search } = Input;
  const { Meta } = Card;
  const [addForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] =  useState();
  const [loading, setLoading] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [selectedBookHandle, setSelectedBookHandle] = useState(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [reload, setReload] = useState(true);
  
  // search book handle
  const [searchKey, setSearchKey] = useState('');
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  
  const handleResearch = () => {
    setReload(!reload);
    setSearchKey("");
  };

  const handlePageChange = (currentPage) => {
      setPage(currentPage);
  };

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

  const handleSearch = (value) => {
    setSearchKey(value);
    setPage(1); 
  }

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
             <Flex>
              <Tooltip title="Khôi phục">
                <Button onClick={handleResearch}>
                  <ReloadOutlined />
                </Button>
              </Tooltip>
              <Search
                  placeholder="Tìm kiếm theo tên sách"
                  onSearch={handleSearch}
                  enterButton
                />
             </Flex>
        </Flex>

        <Button type="primary"  icon={<PlusCircleFilled />}  onClick={showDrawer}>
          Add Book
        </Button>
      </div>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <Row gutter={[16,16]} >
          {bookList && bookList.length > 0 ? (
            bookList.map((book, index) => (
              <Col key={index} xs={12} sm={12} md={8} lg={4}>
                <Card
                  cover={
                    <img
                      alt="example"
                      src={book?.image || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                      style={{
                        width: '100%',
                        height: '100px', 
                        objectFit: 'cover'
                      }}
                    />
                  }
                  actions={[
                    <Tooltip title="Edit" key="edit">
                      <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(book)} />
                    </Tooltip>,
                    <Popconfirm
                      key="delete"
                      title="Bạn có chắc chắn xóa?"
                      onConfirm={() => handleDelete(book)}
                      okText="Xác nhận"
                      cancelText="Hủy bỏ"
                    >
                      <Tooltip title="Xóa">
                        <Button type="primary" icon={<DeleteOutlined />} danger />
                      </Tooltip>
                    </Popconfirm>
                  ]}
                >
                  <Meta 
                    title={book.title} 
                    description={book.description} 
                  />
                  <div style={{ padding: '8px 0' }}>
                    <span>Giá: {book.price} đ</span>
                    <p>Tác giả: {book.author_name}</p>
                    <p>Link: {book.link}</p>
                  </div>  
                </Card>
              </Col>
            ))
          ) : (
            <h1 style={{ textAlign:'center' }}></h1>
          )}
      </Row>
        </Spin>
        {/* Pagination */}
        <Pagination
        current={page}
        pageSize={limit}
        total={totalBooks}
        onChange={handlePageChange}
        style={{ marginTop: '20px', textAlign: 'center' }}
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
  );
};


export default BookPage;
