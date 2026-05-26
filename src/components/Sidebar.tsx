import { 
  Home, 
  Search, 
  Bell, 
  MessageSquare,
  BrainCircuit,
  Bookmark, 
  FileText,
  User as UserIcon, 
  MoreHorizontal, 
  BadgeCheck
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentPage: 'home' | 'premium';
  setCurrentPage: (page: 'home' | 'premium') => void;
  currentUser: User;
  onOpenPostModal?: () => void;
}

export default function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  currentUser,
  onOpenPostModal 
}: SidebarProps) {
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, active: currentPage === 'home' },
    { id: 'explore', label: 'Explore', icon: Search, active: false },
    { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
    { id: 'messages', label: 'Chat', icon: MessageSquare, active: false },
    { id: 'grok', label: 'Grok', icon: BrainCircuit, active: false },
    { id: 'premium', label: 'Premium', icon: BadgeCheck, active: currentPage === 'premium' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, active: false },
    { id: 'articles', label: 'Articles', icon: FileText, active: false },
    { id: 'profile', label: 'Profile', icon: UserIcon, active: false },
    { id: 'more', label: 'More', icon: MoreHorizontal, active: false },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'home' || id === 'premium') {
      setCurrentPage(id as 'home' | 'premium');
    } else {
      // For items like Explore, we can redirect to Home
      setCurrentPage('home');
    }
  };

  return (
    <div id="sidebar-container" className="flex flex-col justify-between h-screen sticky top-0 px-4 py-2.5 border-r border-[#2f3336] w-[275px] overflow-y-auto scrollbar-none shrink-0">
      <div className="flex flex-col items-start">
        {/* Logo */}
        <div 
          id="x-logo"
          onClick={() => setCurrentPage('home')}
          className="p-3 hover:bg-[#181818] rounded-full inline-block cursor-pointer transition-colors"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-white fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>

        {/* Nav Links */}
        <nav className="mt-2 space-y-0.5 w-full">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-4.5 w-full px-3 py-2 rounded-full text-[18px] transition-all text-left hover:bg-[#181818] cursor-pointer group ${
                  item.active ? 'font-bold text-white' : 'text-[#e7e9ea]'
                }`}
              >
                <div className="relative">
                  <IconComponent className={`h-6 w-6 transition-transform group-hover:scale-102 ${
                    item.highlight ? 'text-[#1d9bf0]' : ''
                  }`} />
                  {item.id === 'notifications' && (
                    <span className="absolute -top-1 -right-1 bg-[#1d9bf0] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      3
                    </span>
                  )}
                </div>
                <span className="pr-2">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Big Post button */}
        <button
          id="btn-sidebar-post"
          onClick={onOpenPostModal || (() => setCurrentPage('home'))}
          className="mt-3 w-full bg-[#e7e9ea] hover:bg-[#d7dbdc] text-black font-extrabold py-2.5 px-4 rounded-full transition-all flex items-center justify-center cursor-pointer select-none"
        >
          <span className="text-[17px] font-bold">Post</span>
        </button>
      </div>

      {/* User profile button */}
      <div 
        id="profile-footer-card"
        className="flex items-center justify-between hover:bg-[#181818] p-2.5 rounded-full cursor-pointer transition-colors w-full"
      >
        <div className="flex items-center gap-2.5">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full object-cover bg-neutral-800"
          />
          <div className="flex flex-col text-left max-w-[150px]">
            <span className="font-bold text-[15px] text-white flex items-center gap-1.5 truncate">
              {currentUser.name}
              {(currentUser.isVerified || currentUser.isPremium) && (
                <BadgeCheck className="h-[18px] w-[18px] text-[#1d9bf0] fill-current" />
              )}
            </span>
            <span className="text-[#71767b] text-[13px] truncate">
              @{currentUser.username}
            </span>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-[#e7e9ea]" />
      </div>
    </div>
  );
}
