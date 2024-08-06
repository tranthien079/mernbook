import React, { useState } from 'react'
import useSendMessage from '../../hooks/useSendMessage'
import { SendOutlined } from '@ant-design/icons'

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const { sendMessage, loading } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
     await sendMessage(message);
      setMessage('');
  }
  
  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
          <div className='px-4 my-3'>
          <div className='w-full relative'>
              <input 
              type="text" 
              className='border text-sm rounded-lg block w-full p-2.5 bg-gray-100 border-gray-300 text-dark' 
              placeholder='Send message to...' 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              />
              <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3 text-dark text-3xl'>
                { loading ? <div className='loading loading-spinner'></div> : <SendOutlined className='' />}
              </button>
          </div>
      </div>
    </form>
  )
}

export default MessageInput