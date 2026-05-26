import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Smile, 
  BarChart2, 
  Calendar, 
  MapPin, 
  BadgeCheck, 
  MessageCircle, 
  Repeat, 
  Heart, 
  Share, 
  X, 
  Plus, 
  Trash2,
  Check,
  Sparkles,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { User, Tweet, Poll } from '../types';

interface HomeFeedProps {
  currentUser: User;
  tweets: Tweet[];
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
  setCurrentPage: (page: 'home' | 'premium') => void;
}

export default function HomeFeed({ 
  currentUser, 
  tweets, 
  setTweets,
  setCurrentPage 
}: HomeFeedProps) {
  const [activeTab, setActiveTab] = useState<'for_you' | 'following' | 'lineran' | 'web3_nigeria'>('for_you');
  const [tweetText, setTweetText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll creation state
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Emoji Drawer helper
  const [showEmojiDrawer, setShowEmojiDrawer] = useState(false);
  const dummyEmojis = ['😀', '🔥', '🚀', '💯', '💸', '⚡', '✨', '💻', '🙌', '🎉', '💳', '🤔'];

  // Handle Poll inputs
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const next = [...pollOptions];
    next[idx] = val;
    setPollOptions(next);
  };

  // Click attachment 
  const triggerImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tweet Handler
  const handleCreateTweet = () => {
    if (!tweetText.trim() && !selectedImage && !pollQuestion.trim()) return;

    let attachedPoll: Poll | undefined = undefined;
    if (showPollCreator && pollQuestion.trim()) {
      const filledOptions = pollOptions.filter(o => o.trim() !== '');
      if (filledOptions.length >= 2) {
        attachedPoll = {
          question: pollQuestion,
          options: filledOptions.map(opt => ({ text: opt, votes: 0 })),
          totalVotes: 0
        };
      }
    }

    const newTweetId = String(Date.now());
    const newTweet: Tweet = {
      id: newTweetId,
      author: { ...currentUser },
      content: tweetText,
      timestamp: 'Just now',
      likes: 0,
      reposts: 0,
      replies: 0,
      views: 1,
      mediaUrl: selectedImage || undefined,
      poll: attachedPoll,
      likedByMe: false,
      repostedByMe: false
    };

    setTweets([newTweet, ...tweets]);

    // Resetting State
    setTweetText('');
    setSelectedImage(null);
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  // Interactions state
  const handleLike = (id: string) => {
    setTweets(prev => 
      prev.map(t => {
        if (t.id === id) {
          const isLiked = t.likedByMe;
          return {
            ...t,
            likedByMe: !isLiked,
            likes: isLiked ? t.likes - 1 : t.likes + 1
          };
        }
        return t;
      })
    );
  };

  const handleRepost = (id: string) => {
    setTweets(prev => 
      prev.map(t => {
        if (t.id === id) {
          const isReposted = t.repostedByMe;
          return {
            ...t,
            repostedByMe: !isReposted,
            reposts: isReposted ? t.reposts - 1 : t.reposts + 1
          };
        }
        return t;
      })
    );
  };

  const handlePollVote = (tweetId: string, optionIdx: number) => {
    setTweets(prev => 
      prev.map(t => {
        if (t.id === tweetId && t.poll && t.poll.userVotedIndex === undefined) {
          const nextOptions = t.poll.options.map((opt, idx) => {
            if (idx === optionIdx) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          const nextVotesNum = t.poll.totalVotes + 1;
          return {
            ...t,
            poll: {
              ...t.poll,
              options: nextOptions,
              totalVotes: nextVotesNum,
              userVotedIndex: optionIdx
            }
          };
        }
        return t;
      })
    );
  };

  return (
    <div id="home-feed-container" className="flex-1 max-w-[600px] border-r border-[#2f3336] min-h-screen">
      {/* Feed Sticky Header */}
      <header className="sticky top-0 bg-black/85 backdrop-blur-md z-10 border-b border-[#2f3336]">
        <div id="feed-header-title" className="px-4 py-3 xl:hidden flex items-center justify-between">
          <span className="font-extrabold text-[20px]">Home</span>
          <button 
            onClick={() => setCurrentPage('premium')}
            className="text-xs bg-[#1d9bf0] font-bold py-1 px-3 rounded-full flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="h-3 w-3 fill-current" />
            <span>Verify</span>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-[#2f3336]/40 px-2 relative w-full overflow-hidden">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1 max-w-full">
            {[
              { id: 'for_you', label: 'For you' },
              { id: 'following', label: 'Following' },
              { id: 'lineran', label: 'The Lineran Collective' },
              { id: 'web3_nigeria', label: 'Web3 Nigeria' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="py-4 px-4 hover:bg-[#181818] transition-colors font-bold text-[15px] relative text-center focus:outline-none select-none cursor-pointer shrink-0"
              >
                <span className={activeTab === tab.id ? 'text-white' : 'text-[#71767b]'}>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-4 right-4 bg-[#1d9bf0] h-[3px] rounded-full" />
                )}
              </button>
            ))}
          </div>
          <button 
            className="p-3 hover:bg-[#181818] rounded-full text-[#71767b] hover:text-white transition-colors cursor-pointer shrink-0"
            title="Pin new tab"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* Tweet Creator */}
      <div id="tweet-creator" className="px-4 py-3 border-b border-[#2f3336] flex gap-3.5">
        <img 
          src={currentUser.avatar} 
          alt="Avatar" 
          referrerPolicy="no-referrer"
          className="h-10 w-10 rounded-full object-cover bg-neutral-800 shrink-0 self-start"
        />
        
        <div className="flex-1 flex flex-col pt-1">
          {/* Main Input Textarea */}
          <textarea
            id="tweet-input-textarea"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            placeholder="What is happening?!"
            className="w-full bg-transparent text-[19px] placeholder-[#71767b] text-white resize-none min-h-[50px] max-h-[300px] leading-relaxed border-none focus:outline-none"
            rows={1}
            style={{ height: 'auto' }}
          />

          {/* Render Attached Image */}
          {selectedImage && (
            <div id="preview-image-container" className="relative mt-3 mb-2 rounded-2xl overflow-hidden max-h-[280px] border border-[#2f3336]">
              <img src={selectedImage} alt="Attachment" className="w-full h-full object-cover" />
              <button 
                id="btn-remove-attachment"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Render Poll Creator if Active */}
          {showPollCreator && (
            <div id="poll-builder-container" className="mt-3 p-3.5 bg-[#16181c] rounded-2xl border border-[#2f3336] flex flex-col gap-2.5">
              <div className="flex justify-between items-center-end">
                <span className="text-xs font-bold text-[#1d9bf0] tracking-wider uppercase">Poling Setup</span>
                <button 
                  onClick={() => setShowPollCreator(false)}
                  className="p-1 hover:bg-[#202327] rounded-all text-[#71767b] hover:text-[#f4212e] rounded-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <input
                id="poll-question-input"
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="bg-black border border-[#2f3336] text-[15px] p-2.5 rounded-lg text-white placeholder-[#71767b]"
              />

              <div className="flex flex-col gap-2 mt-1">
                {pollOptions.map((opt, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      id={`poll-option-input-${index}`}
                      type="text"
                      value={opt}
                      onChange={(e) => handlePollOptionChange(index, e.target.value)}
                      placeholder={`Choice ${index + 1}${index > 1 ? ' (optional)' : ''}`}
                      className="bg-black border border-[#2f3336] text-[14px] p-2 px-3 rounded-lg text-white placeholder-[#71767b] flex-1"
                    />
                    {pollOptions.length > 2 && (
                      <button 
                        onClick={() => removePollOption(index)}
                        className="text-[#71767b] hover:text-[#f4212e]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 4 && (
                <button
                  id="btn-add-poll-choice"
                  onClick={addPollOption}
                  className="text-[#1d9bf0] hover:text-[#1a8cd8] text-xs font-bold flex items-center gap-1.5 px-1 py-1 align-left self-start"
                >
                  <Plus className="h-3 w-3" /> Add a choice
                </button>
              )}
            </div>
          )}

          {/* Emoji Drawer popup */}
          {showEmojiDrawer && (
            <div className="mt-3 p-2 bg-[#16181c] border border-[#2f3336] rounded-xl flex flex-wrap gap-2 max-w-[280px]">
              {dummyEmojis.map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => {
                    setTweetText(prev => prev + emoji);
                    setShowEmojiDrawer(false);
                  }}
                  className="text-lg p-1.5 hover:bg-black rounded transition-all cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex items-center justify-between border-t border-[#2f3336] mt-3 pt-3">
            <div className="flex items-center text-[#1d9bf0] gap-0.5">
              <button 
                id="btn-attachment-trigger"
                onClick={triggerImageSelect}
                className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"
                title="Media"
              >
                <ImageIcon className="h-4.5 w-4.5" />
              </button>
              <input
                id="hidden-image-file"
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <button 
                id="btn-poll-creator-trigger"
                onClick={() => setShowPollCreator(!showPollCreator)}
                className={`p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors ${showPollCreator ? 'bg-[#1d9bf0]/20' : ''}`}
                title="Poll"
              >
                <BarChart2 className="h-4.5 w-4.5" />
              </button>

              <button 
                id="btn-emoji-helper"
                onClick={() => setShowEmojiDrawer(!showEmojiDrawer)}
                className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"
                title="Emoji"
              >
                <Smile className="h-4.5 w-4.5" />
              </button>

              <button 
                className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"
                title="Schedule"
                disabled
              >
                <Calendar className="h-4.5 w-4.5 opacity-50" />
              </button>

              <button 
                className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"
                title="Tag Location"
                disabled
              >
                <MapPin className="h-4.5 w-4.5 opacity-50" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Character Limit Circular Count Mock */}
              <span className="text-[#71767b] text-xs">
                {280 - tweetText.length}
              </span>
              
              <button
                id="btn-post-main"
                onClick={handleCreateTweet}
                disabled={!tweetText.trim() && !selectedImage && !pollQuestion.trim()}
                className={`font-semibold py-1.5 px-4 rounded-full transition-all text-[15px] cursor-pointer ${
                  (tweetText.trim() || selectedImage || pollQuestion.trim())
                    ? 'bg-[#1s9bf0] bg-[#1d9bf0] text-white hover:bg-[#1a8cd8]' 
                    : 'bg-[#1d9bf0]/50 text-white/50 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Show Posts Alert Banner */}
      <button 
        onClick={() => {
          console.log("[Timeline Feed] Refreshed feed with 35 new posts.");
        }}
        className="w-full text-[#1d9bf0] font-semibold text-[14.5px] py-3.5 border-b border-[#2f3336]/40 text-center hover:bg-[#181818]/45 transition-colors select-none cursor-pointer block bg-transparent"
      >
        Show 35 posts
      </button>

      {/* Tweets Feed Stream */}
      <div id="tweets-stream" className="divide-y divide-[#2f3336]">
        {tweets.map((tweet) => {
          const isPollActive = !!tweet.poll;
          const userVoted = isPollActive && tweet.poll?.userVotedIndex !== undefined;

          return (
            <article 
              key={tweet.id} 
              id={`tweet-card-${tweet.id}`}
              className="p-4 hover:bg-[#080808] transition-colors flex gap-3.5 cursor-pointer"
            >
              <img 
                src={tweet.author.avatar} 
                alt={tweet.author.name} 
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full object-cover bg-neutral-800 shrink-0"
              />

              <div className="flex-1 text-left">
                {/* Author Info heading */}
                <div className="flex items-center gap-1.5 text-[15px] flex-wrap leading-tight">
                  <span className="font-bold text-white flex items-center gap-1.5 hover:underline">
                    {tweet.author.name}
                    {(tweet.author.isVerified || tweet.author.isPremium) && (
                      <BadgeCheck className={`h-[17.5px] w-[17.5px] fill-current ${
                        (tweet.author.username.toLowerCase() === 'ababilpayofficial' || tweet.author.username.toLowerCase() === 'atlasfunded')
                          ? 'text-[#e7b51b]'
                          : 'text-[#1d9bf0]'
                      }`} />
                    )}
                  </span>
                  <span className="text-[#71767b]">@{tweet.author.username}</span>
                  <span className="text-[#71767b]">·</span>
                  <span className="text-[#71767b] hover:underline" title="Tweet Timestamp">{tweet.timestamp}</span>
                </div>
                {/* Replying to label if present */}
                {tweet.replyingTo && (
                  <div className="text-[#71767b] text-[13px] mt-0.5 font-medium leading-none">
                    Replying to <span className="text-[#1d9bf0] hover:underline cursor-pointer">{tweet.replyingTo}</span>
                  </div>
                )}

                {/* Tweet content */}
                <p id={`tweet-body-${tweet.id}`} className="mt-1.5 text-[15px] leading-normal text-[#e7e9ea] whitespace-pre-wrap">
                  {tweet.content}
                </p>

                {/* Attached media */}
                {tweet.mediaUrl && (
                  <div className="mt-3.5 rounded-2xl overflow-hidden max-h-[350px] border border-[#2f3336]">
                    <img 
                      src={tweet.mediaUrl} 
                      alt="Tweet attachment" 
                      className="w-full h-full object-cover hover:scale-101 transition-transform" 
                    />
                  </div>
                )}

                {/* Quoted Tweet Card */}
                {tweet.quotedTweet && (
                  <div className="mt-3.5 border border-[#2f3336] hover:bg-neutral-900/30 rounded-2xl p-3 bg-black/40 flex flex-col gap-1.5 transition-colors text-left">
                    <div className="flex items-center gap-1.5 text-[14px]">
                      <img 
                        src={tweet.quotedTweet.author.avatar} 
                        alt={tweet.quotedTweet.author.name} 
                        className="w-5 h-5 rounded-full object-cover bg-neutral-800 shrink-0"
                      />
                      <span className="font-bold text-white flex items-center gap-0.5 hover:underline">
                        {tweet.quotedTweet.author.name}
                        {(tweet.quotedTweet.author.isVerified || tweet.quotedTweet.author.isPremium) && (
                          <BadgeCheck className="h-4 w-4 text-[#1d9bf0] fill-current shrink-0" />
                        )}
                      </span>
                      <span className="text-[#71767b] truncate">@{tweet.quotedTweet.author.username}</span>
                      <span className="text-[#71767b]">·</span>
                      <span className="text-[#71767b] shrink-0">{tweet.quotedTweet.timestamp}</span>
                    </div>

                    {tweet.quotedTweet.replyingTo && (
                      <div className="text-[#71767b] text-[12px] font-medium leading-none">
                        Replying to <span className="text-[#1d9bf0] hover:underline cursor-pointer">{tweet.quotedTweet.replyingTo}</span>
                      </div>
                    )}

                    <p className="text-[14.5px] text-[#e7e9ea] leading-normal whitespace-pre-wrap">
                      {tweet.quotedTweet.content}
                    </p>

                    {tweet.quotedTweet.mediaUrl && (
                      <div className="mt-2.5 rounded-xl overflow-hidden max-h-[300px] border border-[#2f3336]/60">
                        <img 
                          src={tweet.quotedTweet.mediaUrl} 
                          alt="Quoted attachment" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Poll structure rendered in-feed */}
                {isPollActive && tweet.poll && (
                  <div className="mt-4 p-3 bg-[#16181c] rounded-2xl border border-[#2f3336] flex flex-col gap-2.5">
                    <span className="font-bold text-[14px] text-white pr-2">
                      {tweet.poll.question}
                    </span>

                    <div className="flex flex-col gap-2">
                      {tweet.poll.options.map((opt, optIdx) => {
                        const total = tweet.poll!.totalVotes || 0;
                        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                        const isSelected = tweet.poll!.userVotedIndex === optIdx;

                        return (
                          <div key={optIdx} className="relative w-full rounded-xl overflow-hidden h-10 border border-[#2f3336] bg-black">
                            {/* Vote background percentage indicator bar */}
                            {userVoted && (
                              <div 
                                className="absolute left-0 top-0 h-full bg-[#1d9bf0]/15 transition-all duration-500 ease-out" 
                                style={{ width: `${pct}%` }}
                              />
                            )}

                            <button
                              id={`tweet-${tweet.id}-poll-${optIdx}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePollVote(tweet.id, optIdx);
                              }}
                              disabled={userVoted}
                              className="absolute inset-0 flex items-center justify-between px-3 text-[14px] z-10 w-full cursor-pointer h-full text-left"
                            >
                              <span className="font-semibold flex items-center gap-2 text-white">
                                {opt.text}
                                {isSelected && <Check className="h-4 w-4 text-[#1d9bf0]" />}
                              </span>

                              {userVoted && (
                                <span className="font-bold text-[#71767b]">
                                  {pct}%
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[13px] text-[#71767b] flex items-center gap-2">
                      <span>{tweet.poll.totalVotes} votes</span>
                      <span>·</span>
                      <span>Final Results</span>
                    </div>
                  </div>
                )}

                {/* Stats Action Row */}
                <div className="flex items-center justify-between max-w-[425px] mt-3.5 text-[#71767b] text-xs">
                  {/* Reply Button container */}
                  <div className="flex items-center gap-1 group hover:text-[#1d9bf0] transition-colors">
                    <div className="p-2 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <span>{tweet.replies}</span>
                  </div>

                  {/* Repost Button */}
                  <div 
                    id={`btn-repost-${tweet.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRepost(tweet.id);
                    }}
                    className={`flex items-center gap-1 group transition-colors cursor-pointer ${
                      tweet.repostedByMe ? 'text-[#00ba7c]' : 'hover:text-[#00ba7c]'
                    }`}
                  >
                    <div className="p-2 group-hover:bg-[#00ba7c]/10 rounded-full transition-colors">
                      <Repeat className="h-4 w-4" />
                    </div>
                    <span>{tweet.reposts}</span>
                  </div>

                  {/* Like Button */}
                  <div 
                    id={`btn-like-${tweet.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(tweet.id);
                    }}
                    className={`flex items-center gap-1 group transition-colors cursor-pointer ${
                      tweet.likedByMe ? 'text-[#f4212e]' : 'hover:text-[#f4212e]'
                    }`}
                  >
                    <div className="p-2 group-hover:bg-[#f4212e]/10 rounded-full transition-colors">
                      <Heart className={`h-4 w-4 ${tweet.likedByMe ? 'fill-current' : ''}`} />
                    </div>
                    <span>{tweet.likes}</span>
                  </div>

                  {/* Views Count */}
                  <div className="flex items-center gap-1 group hover:text-[#1d9bf0] transition-colors">
                    <div className="p-2 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <BarChart2 className="h-4 w-4" />
                    </div>
                    <span>{tweet.views}</span>
                  </div>

                  {/* Share/Bookmark Button */}
                  <div className="flex items-center gap-1 group hover:text-[#1d9bf0] transition-colors">
                    <div className="p-2 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                      <Share className="h-4 w-4" />
                    </div>
                  </div>
                </div>

              </div>
            </article>
          );
        })}
      </div>

      {/* Floating Action Overlay Widgets on Bottom Right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3.5 z-40">
        {/* Grok Floating Overlay */}
        <button 
          onClick={() => setCurrentPage('home')}
          className="w-13 h-13 rounded-full bg-black border border-[#2f3336]/80 text-white flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-[#181818] transition-all cursor-pointer"
          title="Quick Grok Panel"
        >
          <BrainCircuit className="h-5.5 w-5.5 text-[#e7e9ea]" />
        </button>
        
        {/* Chat Floating Overlay */}
        <button 
          onClick={() => setCurrentPage('home')}
          className="w-13 h-13 rounded-full bg-black border border-[#2f3336]/80 text-white flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-[#181818] transition-all cursor-pointer"
          title="Quick Chat Panel"
        >
          <MessageSquare className="h-5.5 w-5.5 text-[#e7e9ea]" />
        </button>
      </div>

    </div>
  );
}
