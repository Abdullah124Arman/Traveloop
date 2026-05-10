import { useEffect, useState } from 'react';
import { getCommunityPosts, createCommunityPost } from '../services/auth.service';
import { CommunityPost } from '../types';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    getCommunityPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const post = await createCommunityPost({ content });
      setPosts(prev => [post, ...prev]);
      setContent('');
      toast.success('Post shared!');
    } catch { toast.error('Failed to post'); }
    finally { setPosting(false); }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Community</h1>

      {/* Post composer */}
      <form onSubmit={handlePost} className="rounded-xl border p-4 mb-6 flex gap-3"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden"
          style={{ background: 'var(--primary)' }}>
          {user?.photoUrl
            ? <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
            : `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your travel experience..."
            rows={2}
            className="w-full px-3 py-2 rounded-xl border text-sm resize-none"
            style={{ background: 'var(--surface-3)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={posting || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: posting ? 'var(--border)' : 'var(--primary)' }}>
              <Send size={14} /> {posting ? 'Posting...' : 'Share'}
            </button>
          </div>
        </div>
      </form>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-4xl mb-2">🌐</p>
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border p-5 flex gap-4"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden"
                style={{ background: 'var(--primary)' }}>
                {post.user.photoUrl
                  ? <img src={post.user.photoUrl} alt="" className="w-full h-full object-cover" />
                  : `${post.user.firstName[0]}${post.user.lastName[0]}`}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                    {post.user.firstName} {post.user.lastName}
                  </p>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>@{post.user.username}</span>
                </div>
                {post.trip && (
                  <p className="text-xs mb-2" style={{ color: 'var(--primary)' }}>
                    ✈️ {post.trip.name}{post.trip.place ? ` · ${post.trip.place}` : ''}
                  </p>
                )}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{post.content}</p>
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
