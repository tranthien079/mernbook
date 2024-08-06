import { useEffect, useState } from "react"
import useConversation from "../zustand/useConversation";
import { getMessages as getMessagesUser } from "../util/messageApi";
const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const {messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const res = await getMessagesUser(selectedConversation._id);
                setMessages(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if(selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessages])

    return { loading, messages };
}

export default useGetMessages;