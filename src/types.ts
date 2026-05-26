export interface User {
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  isPremium: boolean;
}

export interface Poll {
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  userVotedIndex?: number;
}

export interface Tweet {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  likedByMe?: boolean;
  repostedByMe?: boolean;
  mediaUrl?: string;
  poll?: Poll;
  quotedTweet?: Tweet;
  replyingTo?: string;
  mediaCrop?: { scale: string; top: string; left: string; aspect: string };
}

export interface TrendingTopic {
  category: string;
  topic: string;
  postsCount: string;
}

export type SubscriptionPlanId = 'basic' | 'premium' | 'premium_plus';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  bannerColor: string;
  buttonText: string;
}

export type PaymentMethodId = 'card' | 'apple_pay' | 'google_pay' | 'unionpay' | 'link' | 'ababil_pay';

export interface PaymentGateways {
  id: PaymentMethodId;
  name: string;
  logo: string;
  description: string;
  badge?: string;
}
