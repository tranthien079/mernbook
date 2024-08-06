import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext';
import useConversation from '../../zustand/useConversation';
import { extractTime } from '../../util/extractTime';

const Message = ({message}) => {
    const { auth } = useContext(AuthContext);
    const { selectedConversation } = useConversation(); 
    const fromMe = message.senderId == auth.user._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    const avatar = fromMe ? auth.user.avatar : selectedConversation?.avatar;
    const bubbleBgColor = fromMe ? 'bg-blue-500' : '';
    const shakeClass = message.shouldShake ? "shake" : "";

    return (
    <div className={`chat ${chatClassName}`}>
        <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
                <img   alt="Tailwind CSS chat bubble component"
                    src={avatar}
                />
            </div>
        </div>
        <div className={`chat-bubble text-dark ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
    </div>
  )
}

export default Message