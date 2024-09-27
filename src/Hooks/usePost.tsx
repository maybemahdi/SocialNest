
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const usePost = () => {

    const { data: posts, isLoading, refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const { data } = await axios.get("/api/getPosts");
            return data;
        },
    })
    return { posts, isLoading, refetch }
};

export default usePost;