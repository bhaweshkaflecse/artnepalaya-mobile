import { api } from './api';

export interface UserSnippet {
  _id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Post {
  _id: string;
  authorId: UserSnippet;
  media: { url: string; type: 'image' | 'video'; cloudinaryId: string }[];
  description?: string;
  tags: { _id: string; name: string }[];
  stats: { saves: number; likes: number };
  isLikedByMe?: boolean; // Hydrated by backend
  isSavedByMe?: boolean; // Hydrated by backend
  createdAt: string;
}

export const postService = {
  getFeatured: async (): Promise<Post[]> => {
    const response = await api.get('/posts/featured');
    return response.data.data;
  },
  
  // Hardcoded to page 1, limit 20 to strictly enforce MVP constraint
  getFeed: async (): Promise<Post[]> => {
    const response = await api.get('/posts/feed?page=1&limit=20');
    return response.data.data;
  },

  toggleSave: async (postId: string) => {
    const response = await api.post(`/interactions/posts/${postId}/save`);
    return response.data;
  },

  toggleLike: async (postId: string) => {
    const response = await api.post(`/interactions/posts/${postId}/like`);
    return response.data;
  }
};