import { useState } from 'react';
import { usePlants } from '../../context/PlantContext.js';
import './PlantCommunity.css';

interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  plantId?: string;
  plantName?: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: CommunityComment[];
  createdAt: string;
  type: 'showcase' | 'question' | 'tip' | 'milestone';
}

interface CommunityComment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes: number;
}

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'PlantLover123',
    plantId: 'monstera-1',
    plantName: 'Monstera Deliciosa',
    title: 'My Monstera finally got its first fenestration! 🌿',
    content: 'After 8 months of care, my baby monstera finally developed its first split leaf! The key was consistent bright indirect light and weekly watering. So excited to see more splits coming!',
    images: [],
    tags: ['monstera', 'milestone', 'fenestration'],
    likes: 24,
    comments: [
      {
        id: 'c1',
        userId: 'user2',
        username: 'GreenThumb',
        content: 'Congratulations! That\'s such an exciting milestone. Your care routine sounds perfect!',
        createdAt: '2024-01-15T10:30:00Z',
        likes: 3
      }
    ],
    createdAt: '2024-01-15T09:00:00Z',
    type: 'milestone'
  },
  {
    id: '2',
    userId: 'user2',
    username: 'GreenThumb',
    title: 'Help! Brown spots on my fiddle leaf fig leaves 😰',
    content: 'I\'ve noticed these brown spots appearing on my fiddle leaf fig. They started small but are getting bigger. I water once a week and it gets bright indirect light. Could this be overwatering or something else?',
    images: [],
    tags: ['fiddle-leaf-fig', 'help', 'brown-spots', 'disease'],
    likes: 8,
    comments: [
      {
        id: 'c2',
        userId: 'user3',
        username: 'PlantDoctor',
        content: 'This looks like bacterial leaf spot. Try reducing watering frequency and improve air circulation around the plant.',
        createdAt: '2024-01-14T15:45:00Z',
        likes: 12
      },
      {
        id: 'c3',
        userId: 'user1',
        username: 'PlantLover123',
        content: 'I had the same issue! Cutting back on watering and using filtered water helped mine recover.',
        createdAt: '2024-01-14T16:20:00Z',
        likes: 5
      }
    ],
    createdAt: '2024-01-14T14:00:00Z',
    type: 'question'
  },
  {
    id: '3',
    userId: 'user3',
    username: 'PlantDoctor',
    title: '💡 Pro Tip: DIY Humidity Tray for Tropical Plants',
    content: 'Here\'s a simple way to increase humidity for your tropical plants: Fill a shallow tray with pebbles and water, then place your plant pot on top (not touching the water). As water evaporates, it creates a humid microclimate around your plant!',
    images: [],
    tags: ['tip', 'humidity', 'tropical-plants', 'diy'],
    likes: 45,
    comments: [
      {
        id: 'c4',
        userId: 'user4',
        username: 'NewbiePlanter',
        content: 'This is genius! I\'ve been struggling with low humidity. Definitely trying this!',
        createdAt: '2024-01-13T12:15:00Z',
        likes: 2
      }
    ],
    createdAt: '2024-01-13T11:00:00Z',
    type: 'tip'
  }
];

export function PlantCommunity() {
  const { plants } = usePlants();
  const [posts, setPosts] = useState<CommunityPost[]>(SAMPLE_POSTS);
  const [showNewPost, setShowNewPost] = useState(false);
  const [filter, setFilter] = useState<'all' | 'showcase' | 'question' | 'tip' | 'milestone'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [searchTerm, setSearchTerm] = useState('');

  // New post form state
  const [newPost, setNewPost] = useState({
    type: 'showcase' as CommunityPost['type'],
    plantId: '',
    title: '',
    content: '',
    tags: [] as string[],
    customTag: ''
  });

  const currentUser = {
    id: 'current-user',
    username: 'You',
    avatar: '👤'
  };

  const addPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    const plant = newPost.plantId ? plants.find(p => p.id === newPost.plantId) : undefined;

    const post: CommunityPost = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      username: currentUser.username,
      plantId: newPost.plantId || undefined,
      plantName: plant?.name,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      images: [],
      tags: [...newPost.tags],
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      type: newPost.type
    };

    setPosts(prev => [post, ...prev]);
    
    // Reset form
    setNewPost({
      type: 'showcase',
      plantId: '',
      title: '',
      content: '',
      tags: [],
      customTag: ''
    });
    setShowNewPost(false);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;

    const comment: CommunityComment = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      username: currentUser.username,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
  };

  const addTag = (tag: string) => {
    if (tag && !newPost.tags.includes(tag)) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomTag = () => {
    if (newPost.customTag.trim()) {
      addTag(newPost.customTag.trim().toLowerCase());
      setNewPost(prev => ({ ...prev, customTag: '' }));
    }
  };

  const getFilteredPosts = () => {
    let filtered = posts;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(post => post.type === filter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.username.toLowerCase().includes(term) ||
        post.plantName?.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.includes(term))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likes + b.comments.length) - (a.likes + a.comments.length);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'showcase': return '🌟';
      case 'question': return '❓';
      case 'tip': return '💡';
      case 'milestone': return '🎉';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'showcase': return '#10b981';
      case 'question': return '#3b82f6';
      case 'tip': return '#f59e0b';
      case 'milestone': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="plant-community">
      <div className="community-header">
        <h1>🌍 Plant Community</h1>
        <p>Connect with fellow plant enthusiasts, share your journey, and get help</p>
      </div>

      <div className="community-controls">
        <button
          onClick={() => setShowNewPost(true)}
          className="btn btn-primary new-post-btn"
        >
          ✏️ New Post
        </button>

        <div className="filters">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="filter-select"
          >
            <option value="all">All Posts</option>
            <option value="showcase">🌟 Showcases</option>
            <option value="question">❓ Questions</option>
            <option value="tip">💡 Tips</option>
            <option value="milestone">🎉 Milestones</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="filter-select"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {showNewPost && (
        <div className="new-post-modal">
          <div className="modal-overlay" onClick={() => setShowNewPost(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>✏️ Create New Post</h2>
                <button onClick={() => setShowNewPost(false)} className="close-btn">×</button>
              </div>

              <div className="post-form">
                <div className="form-group">
                  <label>Post Type</label>
                  <div className="type-selector">
                    {(['showcase', 'question', 'tip', 'milestone'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`type-btn ${newPost.type === type ? 'selected' : ''}`}
                        onClick={() => setNewPost(prev => ({ ...prev, type }))}
                      >
                        <span className="type-icon">{getTypeIcon(type)}</span>
                        <span className="type-label">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Related Plant (Optional)</label>
                  <select
                    value={newPost.plantId}
                    onChange={(e) => setNewPost(prev => ({ ...prev, plantId: e.target.value }))}
                    className="form-select"
                  >
                    <option value="">No specific plant</option>
                    {plants.map(plant => (
                      <option key={plant.id} value={plant.id}>{plant.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's your post about?"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your story, ask your question, or give your tip..."
                    className="form-textarea"
                    rows={6}
                  />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="custom-tag">
                    <input
                      type="text"
                      value={newPost.customTag}
                      onChange={(e) => setNewPost(prev => ({ ...prev, customTag: e.target.value }))}
                      placeholder="Add tags (e.g., monstera, watering, help)"
                      className="tag-input"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                    />
                    <button type="button" onClick={addCustomTag} className="btn btn-sm">Add</button>
                  </div>

                  {newPost.tags.length > 0 && (
                    <div className="selected-tags">
                      {newPost.tags.map(tag => (
                        <span key={tag} className="selected-tag">
                          #{tag}
                          <button onClick={() => removeTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button onClick={addPost} className="btn btn-primary">
                    📤 Post to Community
                  </button>
                  <button onClick={() => setShowNewPost(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="posts-feed">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>
              {posts.length === 0 
                ? "No posts yet. Be the first to share with the community!"
                : "No posts match your current filters."
              }
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => likePost(post.id)}
              onComment={(content) => addComment(post.id, content)}
              getTypeIcon={getTypeIcon}
              getTypeColor={getTypeColor}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface PostCardProps {
  post: CommunityPost;
  onLike: () => void;
  onComment: (content: string) => void;
  getTypeIcon: (type: string) => string;
  getTypeColor: (type: string) => string;
}

function PostCard({ post, onLike, onComment, getTypeIcon, getTypeColor }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">👤</div>
          <div className="author-info">
            <div className="author-name">{post.username}</div>
            <div className="post-meta">
              <span className="post-date">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {post.plantName && (
                <span className="post-plant">🌱 {post.plantName}</span>
              )}
            </div>
          </div>
        </div>
        <div 
          className="post-type-badge"
          style={{ backgroundColor: getTypeColor(post.type) }}
        >
          {getTypeIcon(post.type)} {post.type}
        </div>
      </div>

      <div className="post-content">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>

      {post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="post-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-actions">
        <button onClick={onLike} className="action-btn like-btn">
          ❤️ {post.likes}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)} 
          className="action-btn comment-btn"
        >
          💬 {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {post.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-author">👤 {comment.username}</div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-meta">
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="comment-likes">❤️ {comment.likes}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="add-comment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button onClick={handleAddComment} className="btn btn-sm">Post</button>
          </div>
        </div>
      )}
    </div>
  );
}
