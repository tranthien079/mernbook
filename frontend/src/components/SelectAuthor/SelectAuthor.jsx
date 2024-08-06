import { Select } from "antd";
import React, { useState, useEffect } from "react";
import { getAuthorApi } from "../../util/athorApi";

const SelectAuthor = ({ value, onChange }) => {
  const [authorList, setAuthorList] = useState([]);
  const { Option } = Select;

  const fetchAuthor = async () => {
    const res = await getAuthorApi();
    if (res) {
      setAuthorList(res.data);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, []);

  return (
    <Select 
      placeholder="Select an Author" 
      onChange={onChange} 
      value={value} // Ensure the value prop is passed here
    >
      {authorList.map((author) => (
        <Option key={author._id} value={author._id}>
          {author.name}
        </Option>
      ))}
    </Select>
  );
};

export default SelectAuthor;