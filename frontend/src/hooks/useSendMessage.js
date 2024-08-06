import { useState } from "react";
import useConversation from '../zustand/useConversation';
import { sendMessageTo } from '../util/messageApi';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const res = await sendMessageTo(selectedConversation._id, { message });
            setMessages([...messages, res]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return { sendMessage, loading };
}

export default useSendMessage;

