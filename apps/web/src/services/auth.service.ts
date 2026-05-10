import api from './api';
import { User, CommunityPost } from '../types';

export const login = (username: string, password: string) =>
  api.post<any>('/auth/login', { username, password }).then(r => r.data.data as { token: string; user: User });

export const signup = (data: object) =>
  api.post<any>('/auth/signup', data).then(r => r.data.data as { token: string; user: User });

export const getProfile = () =>
  api.get<any>('/users/me').then(r => r.data.data as User);

export const updateProfile = (data: Partial<User>) =>
  api.patch<any>('/users/me', data).then(r => r.data.data as User);

export const getSearch = (q: string, type?: string) =>
  api.get<any>('/search', { params: { q, type } }).then(r => r.data.data);

export const getCommunityPosts = (page = 1) =>
  api.get<any>('/community/posts', { params: { page } }).then(r => r.data.data as CommunityPost[]);

export const createCommunityPost = (data: { content: string; tripId?: string }) =>
  api.post<any>('/community/posts', data).then(r => r.data.data as CommunityPost);

export const getAdminStats = () =>
  api.get<any>('/admin/stats').then(r => r.data.data);
