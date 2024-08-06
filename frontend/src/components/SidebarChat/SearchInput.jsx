import React, { useState } from 'react'
import useConversation from '../../zustand/useConversation';
import useGetConversations from '../../hooks/useGetConversations';
import { message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!search) return;
    if(search.length < 3) {
      return message.error('Search must be at least 3 characters!');
    } 

    const conversation = conversations.find(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if(conversation) {
      setSelectedConversation(conversation);
      setSearch('');
    } else {
      return message.error('No such user found!');
    }
  }
  return (
    <form className='flex items-center gap-2 w-full ' onSubmit={handleSubmit}>
        <input type="text" name="" placeholder='Search in here...' id=" " className='input input-bordered rounded-full focus:outline-none w-full' 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
            <SearchOutlined  className='w-6 h-6 outline-none' />
        </button>
    </form>
  )
}

export default SearchInput