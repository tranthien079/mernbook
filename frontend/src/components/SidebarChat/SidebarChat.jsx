import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import LogoutButton from './LogoutButton'

const SidebarChat = () => {
  return (
    <div className='md:w-1/3 lg:w-1/4 border-r p-4 flex flex-col'>
        <SearchInput />
        <div className='divider px-3'>

        </div>
        <Conversations />
        <LogoutButton />
    </div>
  )
}

export default SidebarChat