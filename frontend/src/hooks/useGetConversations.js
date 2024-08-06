import { useEffect, useState } from "react";
import { getUserSideBar } from "../util/api";

const useGetConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getConversations = async() => {
            setLoading(true);
          try {
            const res= await getUserSideBar();
            setConversations(res);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
        getConversations();

    }, [])
    return { loading, conversations }

}

export default useGetConversations;