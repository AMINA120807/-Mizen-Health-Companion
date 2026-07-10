"use client";

import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export default function CommunityFeed() {
  const { t, isRtl } = useTranslation();
  
  // Mock data for community posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Amira B.",
      time: "2h ago",
      content: "Je viens de faire un Tajine végétarien avec les recettes Mizen ! Trop bon et super sain. 🍲",
      likes: 12,
      liked: false
    },
    {
      id: 2,
      author: "Yacine M.",
      time: "5h ago",
      content: "Défi 'Marcher 10 000 pas' terminé pour aujourd'hui ! 🚶‍♂️✅",
      likes: 45,
      liked: true
    },
    {
      id: 3,
      author: "Sarah",
      time: "1d ago",
      content: "J'ai remplacé le sucre blanc par du miel dans mon café, on s'y habitue vite finalement ! ☕",
      likes: 8,
      liked: false
    }
  ]);

  const [newPost, setNewPost] = useState("");

  const handleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([
      {
        id: Date.now(),
        author: "Moi",
        time: "Just now",
        content: newPost,
        likes: 0,
        liked: false
      },
      ...posts
    ]);
    setNewPost("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-heading text-emerald-950 dark:text-emerald-50 mb-2">{t('community.title')}</h2>
        <p className="text-emerald-700/80 dark:text-emerald-200/60">{t('community.subtitle')}</p>
      </div>

      {/* Create Post */}
      <div className="glass p-4 rounded-3xl border border-emerald-900/30 flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Quoi de neuf ?"
          className="flex-1 bg-white/50 dark:bg-black/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          dir="auto"
        />
        <button 
          onClick={handlePost}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-2xl transition-colors shadow-lg shadow-emerald-900/20 whitespace-nowrap"
        >
          {t('community.shareBtn')}
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="glass p-5 rounded-3xl border border-gray-200 dark:border-emerald-900/30">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-emerald-50 leading-tight">{post.author}</h4>
                  <span className="text-xs text-gray-500 dark:text-emerald-200/50">{post.time}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-800 dark:text-emerald-100/90 mb-4 text-[15px]" dir="auto">
              {post.content}
            </p>
            
            <div className="flex items-center pt-3 border-t border-gray-100 dark:border-emerald-800/30">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 dark:text-emerald-200/60 hover:text-red-400'}`}
              >
                <svg className={`w-5 h-5 ${post.liked ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.likes} {t('community.likes')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
