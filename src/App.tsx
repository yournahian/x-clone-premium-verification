import { useState } from 'react';
import { User, Tweet, SubscriptionPlanId } from './types';
import Sidebar from './components/Sidebar';
import HomeFeed from './components/HomeFeed';
import RightSidebar from './components/RightSidebar';
import PremiumPage from './components/PremiumPage';
import { X, Calendar, Image as ImageIcon, Smile, BarChart2, MapPin } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'premium'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment_status');
      const ababilSim = params.get('ababil_sim');
      if (paymentStatus || ababilSim) {
        return 'premium';
      }
    }
    return 'home';
  });
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');

  // Main Active Logged-in User State (updates to Premium/Verified on checkout!)
  const [currentUser, setCurrentUser] = useState<User>({
    name: 'yournahian.base.eth',
    username: 'yournahian',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
    isVerified: false,
    isPremium: false
  });

  // Initial High Fidelity Tweets
  const [tweets, setTweets] = useState<Tweet[]>([
    {
      id: 'feed-jeremy-allaire-quote',
      author: {
        name: 'Jeremy Allaire - jerallaire.arc',
        username: 'jerallaire',
        avatar: '/avatar_allaire.jpg',
        isVerified: true,
        isPremium: true
      },
      content: 'Circle Agent Stack and agent wallet does this today.',
      timestamp: '1h',
      likes: 53,
      reposts: 9,
      replies: 15,
      views: 4900,
      likedByMe: false,
      repostedByMe: false,
      quotedTweet: {
        id: 'quote-hossain',
        author: {
          name: 'hossain 🛡️',
          username: '0xclowng',
          avatar: '/avatar_hossain.jpg',
          isVerified: true,
          isPremium: true
        },
        content: 'Abstracting x402 payments with native USDC across chains is a very smart architecture layer for agentic commerce\n\nwould love to hear @jerallaire\'s thoughts on this too',
        replyingTo: '@sukanto018 @base and @arc',
        timestamp: '2h',
        likes: 0, reposts: 0, replies: 0, views: 0
      }
    },
    {
      id: 'feed-sukanto-agents-tweet',
      author: {
        name: 'sukanto.base.eth',
        username: 'sukanto018',
        avatar: '/avatar_sukanto.jpg',
        isVerified: true,
        isPremium: true
      },
      content: 'AI agents need to pay at software speed, per request, no credit cards or monthly plans.\n\nmapped out a simple architecture blueprint for Ababil, abstracting x402 payments for autonomous agents across @base and @arc using native USDC.\n\nwould love to hear what other builders think',
      timestamp: '3h',
      likes: 7,
      reposts: 1,
      replies: 5,
      views: 268,
      likedByMe: false,
      repostedByMe: false,
      mediaUrl: '/media_sukanto.png',
      mediaCrop: { scale: "128%", top: "-235px", left: "-60px", aspect: "aspect-[1.12/1]" }
    },
    {
      id: 'feed-nahin-journey-quote',
      author: {
        name: 'Nahin | Rialo',
        username: 'yournahin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
        isVerified: true,
        isPremium: true
      },
      content: 'It will be a long journey',
      timestamp: 'May 23',
      likes: 7,
      reposts: 0,
      replies: 0,
      views: 56,
      likedByMe: false,
      repostedByMe: false,
      quotedTweet: {
        id: 'quote-ababilpay-nahin',
        author: {
          name: 'Ababil Pay',
          username: 'Ababilpay',
          avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&q=80',
          isVerified: true,
          isPremium: true
        },
        content: 'Ababil Pay for E-Commerce is Here\n\nWe are excited to unveil the next major step in the evolution of digital commerce.\n...',
        timestamp: 'May 23',
        mediaUrl: '/media_nahin.png',
        mediaCrop: { scale: "128%", top: "-188px", left: "-60px", aspect: "aspect-[1.58/1]" },
        likes: 0, reposts: 0, replies: 0, views: 0
      }
    },
    {
      id: 'feed-rollins-accept-quote',
      author: {
        name: 'Rollins👑',
        username: 'RollinsR79',
        avatar: '/avatar_rollins.jpg',
        isVerified: true,
        isPremium: true
      },
      content: 'This is a strong and practical perspective.\n\nCrypto payment solutions don’t need to replace traditional systems, they need to improve the weak points in today’s e-commerce infrastructure. Multiple intermediaries, cross-border fees and settlement delays still create friction for',
      timestamp: 'Mar 4',
      likes: 37,
      reposts: 0,
      replies: 8,
      views: 282,
      likedByMe: false,
      repostedByMe: false,
      quotedTweet: {
        id: 'quote-ababilpay-rollins',
        author: {
          name: 'Ababil Pay',
          username: 'Ababilpay',
          avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&q=80',
          isVerified: true,
          isPremium: true
        },
        content: 'We think crypto payment solutions are becoming important because e-commerce is still facing fundamental payment inefficiencies. The main goal isn’t to replace existing systems, it’s to make digital commerce more global, reliable and user-friendly.\n...',
        timestamp: 'Mar 4',
        mediaUrl: '/media_rollins.png',
        mediaCrop: { scale: "128%", top: "-225px", left: "-60px", aspect: "aspect-[1.25/1]" },
        likes: 0, reposts: 0, replies: 0, views: 0
      }
    },
    {
      id: 'feed-koushik-update-quote',
      author: {
        name: 'Koushik Nir',
        username: 'AhmedNir',
        avatar: '/avatar_koushik.jpg',
        isVerified: true,
        isPremium: true
      },
      content: 'BIG UPDATE\nAbabil Pay for E-Commerce is Here\n\nPlease check this\n@RialoHQ @itachee_x @Subzero_Labs',
      timestamp: 'May 23',
      likes: 28,
      reposts: 0,
      replies: 6,
      views: 278,
      likedByMe: false,
      repostedByMe: false,
      quotedTweet: {
        id: 'quote-ababilpay-koushik',
        author: {
          name: 'Ababil Pay',
          username: 'Ababilpay',
          avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&q=80',
          isVerified: true,
          isPremium: true
        },
        content: 'Ababil Pay for E-Commerce is Here\n\nWe are excited to unveil the next major step in the evolution of digital commerce.\n...',
        timestamp: 'May 23',
        mediaUrl: '/media_koushik.png',
        mediaCrop: { scale: "128%", top: "-188px", left: "-60px", aspect: "aspect-[1.58/1]" },
        likes: 0, reposts: 0, replies: 0, views: 0
      }
    },
    {
      id: 'nahin-web3-jenga',
      author: {
        name: 'Nahin | Rialo',
        username: 'yournahin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
        isVerified: true,
        isPremium: true
      },
      content: 'Building a serious Web3 application on a traditional blockchain is like playing a high-stakes game of Jenga, but the blocks are made of duct tape and prayers.\n\nYou start with your smart contract. Simple enough. But wait\n\nIt needs real-world data? Time to bolt on an Oracle.',
      timestamp: 'May 24',
      likes: 16,
      reposts: 6,
      replies: 8,
      views: 58,
      mediaUrl: '/web3_jenga.png',
      likedByMe: false,
      repostedByMe: false
    },
    {
      id: 'swa-gov-water',
      author: {
        name: 'الهيئة السعودية للمياه',
        username: 'swa_gov',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80',
        isVerified: true,
        isPremium: true
      },
      content: 'Behind every moment of comfort during Hajj, an entire water sector works around the clock to serve millions of pilgrims with care and responsibility.',
      timestamp: 'Ad',
      likes: 688,
      reposts: 86,
      replies: 37,
      views: 380000,
      mediaUrl: 'https://images.unsplash.com/photo-1542013936693-8848e5740a95?w=600&h=300&fit=crop&q=80',
      likedByMe: false,
      repostedByMe: false
    },
    {
      id: 'atlas-funded-account',
      author: {
        name: 'Atlas Funded 👑',
        username: 'atlasfunded',
        avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&q=80',
        isVerified: true,
        isPremium: true
      },
      content: 'Any comment with the Zero likes on this post after 24 hours will win a FREE $25K instant account 🎉\n\nWinners will be announced tomorrow! ⏰\n\nGood luck!',
      timestamp: '8h',
      likes: 1500,
      reposts: 288,
      replies: 3500,
      views: 140000,
      likedByMe: false,
      repostedByMe: false
    },
    {
      id: 'elon-ababil-congrats',
      author: {
        name: 'Elon Musk',
        username: 'elonmusk',
        avatar: 'https://images.unsplash.com/photo-1621216800720-c6514720e503?w=100&h=100&fit=crop&q=80',
        isVerified: true,
        isPremium: true
      },
      content: 'Impressive progress on the Ababil Pay testnet integration. Secure customizable checkout verification modules are crucial for the premium verification layer on X. Live soon! 🚀💳',
      timestamp: '2h',
      likes: 12543,
      reposts: 2341,
      replies: 890,
      views: 745300,
      likedByMe: false,
      repostedByMe: false
    }
  ]);

  // Upgrade user privileges instantly and propagate updates back to their feed posts
  const handleUpgradeUser = (planId: SubscriptionPlanId) => {
    // Basic doesn't get badge, but Premium & Premium+ gets verified badge instantly
    const earnsVerification = planId === 'premium' || planId === 'premium_plus';

    const updatedUser = {
      ...currentUser,
      isPremium: true,
      isVerified: earnsVerification
    };

    setCurrentUser(updatedUser);

    // Propagate verification change to user's existings or futures tweets in local feed list!
    setTweets(prevTweets =>
      prevTweets.map(tweet => {
        if (tweet.author.username === currentUser.username) {
          return {
            ...tweet,
            author: {
              ...tweet.author,
              isPremium: true,
              isVerified: earnsVerification
            }
          };
        }
        return tweet;
      })
    );
  };

  // Triggered when sidebar mock Post button is clicked
  const handleSidebarPostSubmit = () => {
    if (!modalText.trim()) return;

    const newTweet: Tweet = {
      id: String(Date.now()),
      author: { ...currentUser },
      content: modalText,
      timestamp: 'Just now',
      likes: 0,
      reposts: 0,
      replies: 0,
      views: 1,
      likedByMe: false,
      repostedByMe: false
    };

    setTweets([newTweet, ...tweets]);
    setModalText('');
    setIsPostModalOpen(false);
  };

  return (
    <div id="app-root-shell" className={`min-h-screen bg-black text-[#e7e9ea] flex justify-center ${currentPage === 'premium' ? 'w-full max-w-full px-0' : 'max-w-[1250px]'} mx-auto relative`}>

      {/* 1. Left Sidebar Navigation */}
      {currentPage !== 'premium' && (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentUser={currentUser}
          onOpenPostModal={() => setIsPostModalOpen(true)}
        />
      )}

      {/* 2. Middle Feed (Switch between Home page & Premium payment gateway page) */}
      <main className={`flex-1 ${currentPage === 'premium' ? 'w-full max-w-[1000px] px-6' : 'max-w-[600px]'} min-h-screen flex flex-col`}>
        {currentPage === 'home' ? (
          <HomeFeed
            currentUser={currentUser}
            tweets={tweets}
            setTweets={setTweets}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <PremiumPage
            currentUser={currentUser}
            onUpgradeUser={handleUpgradeUser}
            setCurrentPage={setCurrentPage}
          />
        )}
      </main>

      {/* 3. Right Sidebar Highlights */}
      {currentPage !== 'premium' && (
        <RightSidebar
          currentUser={currentUser}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Floating Modal for Sidebar 'Post' Button trigger */}
      {isPostModalOpen && (
        <div id="post-overlay-modal" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-black border border-[#2f3336] rounded-2xl w-full max-w-[500px] p-4 flex flex-col shadow-2xl">
            {/* Modal Exit Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#2f3336]">
              <span className="font-extrabold text-[16px]">Compose Post</span>
              <button
                id="btn-close-post-modal"
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 hover:bg-[#181818] text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Info input */}
            <div className="flex gap-3">
              <img
                src={currentUser.avatar}
                alt="Avatar"
                className="h-10 w-10 rounded-full object-cover bg-neutral-800"
              />
              <div className="flex-1 flex flex-col">
                <textarea
                  id="modal-post-textarea"
                  value={modalText}
                  onChange={(e) => setModalText(e.target.value)}
                  placeholder="What is happening?!"
                  className="w-full bg-transparent text-[18px] text-white placeholder-[#71767b] resize-none focus:outline-none min-h-[120px]"
                  autoFocus
                />

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2f3336]">
                  <div className="flex items-center text-[#1d9bf0] gap-1">
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-not-allowed opacity-50"><ImageIcon className="h-4.5 w-4.5" /></button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-not-allowed opacity-50"><BarChart2 className="h-4.5 w-4.5" /></button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-not-allowed opacity-50"><Smile className="h-4.5 w-4.5" /></button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-not-allowed opacity-50"><Calendar className="h-4.5 w-4.5" /></button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-not-allowed opacity-50"><MapPin className="h-4.5 w-4.5" /></button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#71767b] font-mono">{280 - modalText.length}</span>
                    <button
                      id="btn-modal-post-submit"
                      onClick={handleSidebarPostSubmit}
                      disabled={!modalText.trim()}
                      className={`font-semibold py-1.5 px-4.5 rounded-full text-sm cursor-pointer ${modalText.trim()
                          ? 'bg-[#1d9bf0] text-white hover:bg-[#1a8cd8]'
                          : 'bg-[#1d9bf0]/50 text-white/50 cursor-not-allowed'
                        }`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
