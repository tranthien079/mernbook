import React, { useContext, useEffect } from 'react'
import Messages from './Messages'
import MessageInput from './MessageInput'
import { MessageOutlined } from '@ant-design/icons';
import useConversation from '../../zustand/useConversation';
import { AuthContext } from '../Context/AuthContext';

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation(); 

    useEffect(() => {
        // clean up unmounted messages
        return () => setSelectedConversation(null)
    }, [setSelectedConversation])

    return (
        <div className='flex-1 flex flex-col'>
            {!selectedConversation ? <NoChatSelected /> : (
                <>
                    <div className='bg-slate-300 px-4 py-2 mb-2'>
                        <span className='label-text'>To:</span>
                        <span className='text-gray-900 font-bold'>{selectedConversation.name}</span>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    )
}
const NoChatSelected = () => {
    const { auth } = useContext(AuthContext);
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-500 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👏 {auth?.user?.user_name} 💖💖💖</p>
                <p>Select a chat to start messaging</p>
                <MessageOutlined className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    )
}
export default MessageContainer