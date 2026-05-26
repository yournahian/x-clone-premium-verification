import React, { useState } from 'react';
import { Search, BadgeCheck, Sparkles } from 'lucide-react';
import { User } from '../types';

interface RightSidebarProps {
  currentUser: User;
  setCurrentPage: (page: 'home' | 'premium') => void;
  onSearchChange?: (term: string) => void;
}

export default function RightSidebar({ 
  currentUser, 
  setCurrentPage,
  onSearchChange 
}: RightSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Who to follow initial data
  const [whoToFollow, setWhoToFollow] = useState([
    {
      id: '1',
      name: 'Billions',
      username: 'billions_ntwk',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80',
      isVerified: true,
      goldCheck: true,
      isFollowing: false,
    },
    {
      id: '2',
      name: 'Lens',
      username: 'LC',
      avatar: 'https://images.unsplash.com/photo-1542013936693-8848e5740a95?w=100&h=100&fit=crop&q=80',
      isVerified: true,
      isFollowing: false,
    },
    {
      id: '3',
      name: 'Clark Iyke 🦅',
      username: 'ClarkIyke',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80',
      isVerified: true,
      isParody: true,
      isFollowing: false,
    }
  ]);

  // Mock Trends data matching requested trends exactly
  const trends = [
    { category: 'Business & finance · Trending', topic: 'Saylor' },
    { category: 'Sports · Trending', topic: 'Lamine Yamal' },
    { category: 'Business & finance · Trending', topic: 'ababil' },
    { category: 'Business & finance · Trending', topic: 'ababil pay' },
    { category: 'Business & finance · Trending', topic: 'ORIGINALS' },
    { category: 'Business & finance · Trending', topic: 'Gate' }
  ];

  // Today's News mock data matching the screenshot exactly
  const newsItems = [
    {
      id: 'news-1',
      title: "Kalshi Traders Bet on Bitcoin Dropping Below $60,000 by Year-End",
      subtext: "Trending now - News - 1,619 posts",
      avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&q=80"
      ]
    },
    {
      id: 'news-2',
      title: "NPC NFT Collection Sells Out 10,000 in Under an Hour on Ethereum",
      subtext: "Trending now - Other - 117 posts",
      avatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&q=80"
      ]
    },
    {
      id: 'news-3',
      title: "Binance Wallet Launches Event Rush for Trading Real-World Outcomes",
      subtext: "Trending now - News - 173 posts",
      avatars: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&q=80"
      ]
    }
  ];

  const [showUpsellCard, setShowUpsellCard] = useState(true);
  const [showNewsCard, setShowNewsCard] = useState(true);

  const handleFollowToggle = (id: string) => {
    setWhoToFollow(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFollowing: !item.isFollowing } : item
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <div id="right-sidebar" className="hidden lg:flex flex-col gap-4 w-[350px] py-3 pl-4 pr-2 self-start">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#71767b]" />
        <input
          id="right-sidebar-search"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search"
          className="w-full bg-[#202327] py-3 pl-12 pr-4 rounded-full text-[15px] text-[#e7e9ea] placeholder-[#71767b] border border-transparent focus:border-[#1d9bf0] focus:bg-black transition-all focus:outline-none"
        />
      </div>

      {/* Upgrade to Premium Card */}
      {showUpsellCard && !currentUser.isPremium && (
        <div id="premium-upsell-card" className="bg-[#16181c] p-4 rounded-2xl flex flex-col gap-2.5 relative text-left">
          <div className="flex items-center">
            <h2 className="font-extrabold text-[20px] text-white tracking-tight leading-tight select-none">
              Subscribe to Premium
            </h2>
            <span className="bg-[#00ba7c] text-white text-[11px] font-black px-2 py-0.5 rounded-full select-none ml-2 shrink-0">
              50% off
            </span>
          </div>
          <p className="text-[#e7e9ea] text-[14px] leading-snug font-bold">
            Get rid of ads, see your analytics, boost your replies and unlock 20+ features.
          </p>
          <button
            id="premium-upsell-subscribe-button"
            onClick={() => setCurrentPage('premium')}
            className="w-fit bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-extrabold py-2 px-5.5 rounded-full transition-all cursor-pointer text-[14.5px] select-none text-center"
          >
            Subscribe
          </button>
        </div>
      )}

      {/* Verified Active Badge */}
      {currentUser.isPremium && (
        <div id="premium-status-card" className="bg-[#16181c] p-4 rounded-2xl flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-[#1d9bf0]">
            <Sparkles className="h-5 w-5 fill-current" />
            <h2 className="font-extrabold text-[18px] tracking-tight">Verified Premium Active</h2>
          </div>
          <p className="text-[#a0a3a6] text-[13.5px] leading-snug font-bold">
            Your verification badge has been activated! Your posts now rank higher in conversation feeds, and you have custom access to developer sandbox settings.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#71767b]">
            <BadgeCheck className="h-4 w-4 text-[#1d9bf0] fill-current" />
            <span>Subscriber Tier Activated</span>
          </div>
        </div>
      )}



      {/* Today's News Card (Dismissable, matching screenshot exactly) */}
      {showNewsCard && (
        <div id="todays-news-box" className="bg-[#16181c] rounded-2xl overflow-hidden flex flex-col relative">
          <button 
            onClick={() => setShowNewsCard(false)}
            className="absolute top-3.5 right-3.5 text-[#71767b] hover:text-white p-1 hover:bg-[#202327] rounded-full transition-colors cursor-pointer"
            title="Dismiss News"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
            </svg>
          </button>
          
          <h2 className="font-extrabold text-[20px] text-white tracking-tight p-4 pb-2 text-left">Today's News</h2>
          
          <div className="flex flex-col">
            {newsItems.map((news) => (
              <div 
                key={news.id} 
                className="px-4 py-3 hover:bg-[#1c1e22]/50 transition-colors cursor-pointer flex flex-col text-left border-b border-[#2f3336]/30 last:border-none"
              >
                <span className="font-extrabold text-[14.5px] text-white leading-snug mb-1.5">
                  {news.title}
                </span>
                
                {/* News Metadata with overlapping avatars */}
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5 shrink-0">
                    {news.avatars.map((url, index) => (
                      <img 
                        key={index}
                        className="w-4 h-4 rounded-full border border-black object-cover shrink-0" 
                        src={url} 
                        alt="reader avatar" 
                      />
                    ))}
                  </div>
                  <span className="text-[#71767b] text-[13px] font-medium leading-none">
                    {news.subtext}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's Happening */}
      <div id="trends-box" className="bg-[#16181c] rounded-2xl overflow-hidden flex flex-col">
        <h2 className="font-extrabold text-[20px] text-white tracking-tight p-4 pb-2 text-left">What's happening</h2>
        
        <div className="flex flex-col">
          {trends.map((trend, i) => (
            <div 
              key={i} 
              id={`trend-item-${i}`}
              className="px-4 py-3 hover:bg-[#1c1e22]/50 transition-colors cursor-pointer flex justify-between items-start gap-2 border-b border-[#2f3336]/30 last:border-none"
            >
              <div className="flex flex-col text-left">
                <span className="text-[#71767b] text-[13px] font-medium leading-none mb-1">{trend.category}</span>
                <span className="font-extrabold text-[15px] text-white leading-tight">{trend.topic}</span>
              </div>
              
              {/* Ellipsis Dismiss/Action Icon */}
              <button className="text-[#71767b] hover:text-[#1d9bf0] transition-colors p-1 -mr-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentPage('premium')}
          className="text-[#1d9bf0] hover:bg-[#1c1e22]/50 text-[15px] p-4 text-left transition-colors font-bold border-t border-[#2f3336]/30"
        >
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div id="who-to-follow-box" className="bg-[#16181c] rounded-2xl overflow-hidden flex flex-col">
        <h2 className="font-extrabold text-[20px] text-white tracking-tight p-4 pb-2 text-left">Who to follow</h2>
        
        <div className="flex flex-col">
          {whoToFollow.map((user) => (
            <div 
              key={user.id} 
              id={`follow-user-row-${user.username}`}
              className="px-4 py-3 hover:bg-[#1c1e22]/50 transition-colors cursor-pointer flex items-center justify-between gap-2 border-b border-[#2f3336]/30 last:border-none"
            >
              <div className="flex items-center gap-2.5">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover bg-neutral-800 shrink-0"
                />
                <div className="flex flex-col text-left max-w-[150px]">
                  <span className="font-bold text-[15px] text-white flex items-center gap-0.5 truncate">
                    {user.name}
                    {user.goldCheck ? (
                      <BadgeCheck className="h-4 w-4 fill-current text-[#e7b51b] shrink-0" />
                    ) : user.isVerified ? (
                      <BadgeCheck className="h-4 w-4 fill-current text-[#1d9bf0] shrink-0" />
                    ) : null}
                  </span>
                  <span className="text-[#71767b] text-[13px] truncate">@{user.username}</span>
                  {user.isParody && (
                    <span className="text-[#71767b] text-[11.5px] font-bold mt-0.5 flex items-center gap-1 shrink-0 select-none">
                      🎭 Parody account
                    </span>
                  )}
                </div>
              </div>

              <button
                id={`btn-follow-${user.username}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowToggle(user.id);
                }}
                className={`text-[14px] font-extrabold px-4.5 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                  user.isFollowing 
                    ? 'border border-[#566370] text-[#e7e9ea] hover:bg-[#f4212e]/10 hover:border-[#f4212e]/30 hover:text-[#f4212e]' 
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setCurrentPage('premium')}
          className="text-[#1d9bf0] hover:bg-[#1c1e22]/50 text-[15px] p-4 text-left transition-colors font-bold border-t border-[#2f3336]/30"
        >
          Show more
        </button>
      </div>

      {/* Legal Footer matching screenshot precisely */}
      <div id="legal-footer" className="px-4 text-[13px] text-[#71767b] leading-tight flex flex-wrap gap-x-1.5 gap-y-1 mb-8 text-left select-none">
        <a href="#tos" className="hover:underline">Terms of Service</a>
        <span>|</span>
        <a href="#privacy" className="hover:underline">Privacy Policy</a>
        <span>|</span>
        <a href="#cookie" className="hover:underline">Cookie Policy</a>
        <span>|</span>
        <a href="#accessibility" className="hover:underline">Accessibility</a>
        <span>|</span>
        <a href="#ads" className="hover:underline">Ads info</a>
        <span>|</span>
        <a href="#more" className="hover:underline">More...</a>
        <span>|</span>
        <span>© 2026 X Corp.</span>
      </div>
    </div>
  );
}
