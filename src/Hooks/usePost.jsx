// usePost.jsx

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

const usePost = () => {
  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`/api/getPosts?page=${pageParam}&limit=5`);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  return { posts, isLoading, fetchNextPage, hasNextPage, refetch };
};

export default usePost;
