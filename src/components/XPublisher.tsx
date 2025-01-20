import React, { useState } from 'react';
import { X, Calendar, Send, Clock, BarChart2, Edit, Eye, MessageCircle, Repeat2, Heart, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  scheduledTime?: Date;
  status: 'draft' | 'scheduled' | 'published';
  metrics?: {
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
  };
}

interface PostTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

export function XPublisher() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: "🤖 Exciting news! Our AI-powered content analysis shows trending topics in tech are: #AI, #MachineLearning, and #Robotics. What's catching your attention? Share below! 📊",
      status: 'published',
      metrics: {
        likes: 145,
        retweets: 32,
        replies: 18,
        impressions: 2800
      }
    },
    {
      id: '2',
      content: "📱 Did you know? Our latest update includes smart scheduling features that adapt to your audience's peak activity times! Try it out and boost your engagement. #SocialMedia #AI",
      scheduledTime: new Date(Date.now() + 86400000),
      status: 'scheduled'
    }
  ]);

  const [templates] = useState<PostTemplate[]>([
    {
      id: '1',
      name: 'Tech Update',
      content: "🚀 New in tech: [NEWS]. What are your thoughts on this development? #Tech #Innovation",
      category: 'Technology'
    },
    {
      id: '2',
      name: 'Engagement Question',
      content: "🤔 Question of the day: [QUESTION] Share your thoughts below! #Discussion",
      category: 'Engagement'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'compose' | 'scheduled' | 'published'>('compose');
  const [newPost, setNewPost] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      status: 'draft'
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewPost(template.content);
    }
  };

  return (
    <div className="glass-panel rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <X className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-semibold">X Publisher</h2>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'compose' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Compose
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'scheduled' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Scheduled
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'published' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Published
        </button>
      </div>

      {activeTab === 'compose' && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-lg">
            <div className="mb-4">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening?"
                className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{newPost.length} / 280 characters</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-300" />
                </button>
                <button className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <Eye className="w-4 h-4 text-gray-300" />
                </button>
              </div>
              <button
                onClick={handlePostSubmit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          {posts.filter(post => post.status === 'scheduled').map(post => (
            <div key={post.id} className="glass-panel p-4 rounded-lg">
              <p className="text-white mb-4">{post.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {post.scheduledTime?.toLocaleDateString()} at{' '}
                    {post.scheduledTime?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'published' && (
        <div className="space-y-4">
          {posts.filter(post => post.status === 'published').map(post => (
            <div key={post.id} className="glass-panel p-4 rounded-lg">
              <p className="text-white mb-4">{post.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>{post.metrics?.likes}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Repeat2 className="w-4 h-4" />
                    <span>{post.metrics?.retweets}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.metrics?.replies}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-4 h-4" />
                    <span>{post.metrics?.impressions}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}