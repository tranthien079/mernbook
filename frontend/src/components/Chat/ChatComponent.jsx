import React from 'react'
import SidebarChat from '../SidebarChat/SidebarChat'
import MessageContainer from '../MessageContainer/MessageContainer'

const ChatComponent = () => {
  return (
    <div className='border-solid border-2 border-dark flex sm:h-[450px] md:h-[550px] w-full rounded-lg overflow-hidden  bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <SidebarChat />
        <MessageContainer />
    </div>
  )
}

export default ChatComponent