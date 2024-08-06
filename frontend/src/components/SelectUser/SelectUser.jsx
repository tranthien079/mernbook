import { Select } from "antd";
import React, { useState, useEffect } from "react";
import { getUserApi } from "../../util/api";

const SelectUser = ({ value, onChange  }) => {
  const [userList, setUserList] = useState([]);

  const fetchUser = async () => {
    const res = await getUserApi();
    if (!res?.message) {
      setUserList(res);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const { Option } = Select;


  return (
    <Select placeholder="Select a user" onChange={onChange}  value={value}>
      {userList.map((user) => (
        <Option key={user._id} value={user._id}>
          {user.name}
        </Option>
      ))}
    </Select>
  );
};

export default SelectUser;
