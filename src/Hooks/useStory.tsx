
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useStory = () => {
    
    const {data: stories, isLoading, refetch} = useQuery({
        queryKey: ["stories"],
        queryFn: async() => {
            const {data} = await axios.get("/api/getStories");
            return data;
        }
    })
    return {stories, isLoading, refetch}
};

export default useStory;