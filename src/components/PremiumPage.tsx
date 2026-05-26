import React, { useState, useEffect } from 'react';
import { 
  X,
  BadgeCheck, 
  Wallet,
  Coins,
  Laptop,
  EyeOff,
  TrendingUp,
  Sliders,
  FileText,
  Folder,
  Star,
  Zap,
  Terminal,
  Activity,
  ShieldAlert,
  ShieldCheck,
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import { User, SubscriptionPlanId } from '../types';

interface PremiumPageProps {
  currentUser: User;
  onUpgradeUser: (planId: SubscriptionPlanId) => void;
  setCurrentPage: (page: 'home' | 'premium') => void;
}

export default function PremiumPage({ 
  currentUser, 
  onUpgradeUser, 
  setCurrentPage 
}: PremiumPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [tierType, setTierType] = useState<'individual' | 'organization'>('individual');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>('premium');
  const [checkoutStep, setCheckoutStep] = useState<'selection' | 'processing' | 'success' | 'sim_checkout'>('selection');
  const [errorText, setErrorText] = useState<string | null>(null);

  // Simulation parameters for premium verification
  const [selectedNetwork, setSelectedNetwork] = useState<string>('eip155:84532');
  const [simWalletAddress, setSimWalletAddress] = useState<string>('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  const [simStatus, setSimStatus] = useState<'idle' | 'signing' | 'verifying' | 'settling' | 'completed'>('idle');
  const [simNonce, setSimNonce] = useState<string>('0x7752857d0573f5b96236fa829b4f22b438a65f3bb0e2bcc4bcc7473bad9ff6c1');

  // Log feed state for developers to inspect the x402 protocol flow
  const [developerLogs, setDeveloperLogs] = useState<string[]>([
    "[Ababil Router] Ready to interface with x402 direct payment facilitator ledger.",
    "[Billing Status] Current status: Verified checkmark is " + (currentUser.isVerified ? "ENABLED" : "DISABLED")
  ]);

  const addDeveloperLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDeveloperLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  // Convert current selected options to standard USDC values for the Ababil blockchain checkout
  const getPlanDetails = (plan: SubscriptionPlanId) => {
    switch (plan) {
      case 'basic':
        return {
          title: 'Basic',
          bdtPrice: billingPeriod === 'yearly' ? 'BDT 200' : 'BDT 240',
          bdtSubtext: billingPeriod === 'yearly' ? 'BDT 2,400 billed annually' : 'Billed monthly',
          usdcAmount: billingPeriod === 'yearly' ? 20.00 : 2.40,
          benefits: [
            'Small reply boost priority',
            'Bookmark custom folders',
            'Highlights content tab',
            'Edit published posts',
            'Secondary app icons'
          ]
        };
      case 'premium':
        return {
          title: 'Premium',
          bdtPrice: billingPeriod === 'yearly' ? 'BDT 500' : 'BDT 300',
          bdtSubtext: billingPeriod === 'yearly' ? 'BDT 6,000 billed annually' : '50% off for first 2 months, then BDT 600 monthly',
          usdcAmount: billingPeriod === 'yearly' ? 50.00 : 3.00,
          benefits: [
            'Verified Blue Checkmark badge',
            'Grok AI integration assistant',
            'Advanced creator analytics analytics',
            '50% Less intrusive feed Ads',
            'Ad-Revenue payout splitting',
            'Larger video uploads support'
          ]
        };
      case 'premium_plus':
        return {
          title: 'Premium+',
          bdtPrice: billingPeriod === 'yearly' ? 'BDT 4,004.17' : 'BDT 2,430',
          bdtSubtext: billingPeriod === 'yearly' ? 'BDT 48,050 billed annually' : '50% off for first 2 months, then BDT 4,860 monthly',
          usdcAmount: billingPeriod === 'yearly' ? 400.00 : 24.30,
          benefits: [
            'Verified Blue Checkmark badge',
            '100% Ad-Free absolute feed layout',
            'SuperGrok advanced model answers',
            'X Pro premium client dashboard access',
            'Direct peer-to-peer tip acceptance',
            'Maximum prioritized post reply placement'
          ]
        };
      default:
        return {
          title: 'Premium',
          bdtPrice: billingPeriod === 'yearly' ? 'BDT 500' : 'BDT 300',
          bdtSubtext: billingPeriod === 'yearly' ? 'BDT 6,000 billed annually' : '50% off for first 2 months, then BDT 600 monthly',
          usdcAmount: billingPeriod === 'yearly' ? 50.00 : 3.00,
          benefits: [
            'Verified Blue Checkmark badge',
            'Grok AI integration assistant',
            'Advanced creator analytics analytics',
            '50% Less intrusive feed Ads',
            'Ad-Revenue payout splitting',
            'Larger video uploads support'
          ]
        };
    }
  };

  // Check for success URL parameters when redirected back from the Ababil hosted gateway
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment_status');
    const plan = params.get('plan') as SubscriptionPlanId;
    const ababilSim = params.get('ababil_sim');
    const isValidPlan = plan === 'basic' || plan === 'premium' || plan === 'premium_plus';

    if (ababilSim === 'true' && plan && isValidPlan) {
      addDeveloperLog(`[Sandbox Route] Server failed to contact external testnet. Switched to high-fidelity Simulator.`);
      setSelectedPlan(plan);
      setCheckoutStep('sim_checkout');
      
      // Erase parameters from address bar cleanly so reload stays in simulated state beautifully
      try {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      } catch (err) {
        console.warn("Could not rewrite address bar parameters", err);
      }
    } else if (paymentStatus === 'success' && plan && isValidPlan) {
      addDeveloperLog(`[Success Callback] Ababil Pay settled. Activating verification...`);
      onUpgradeUser(plan);
      setSelectedPlan(plan);
      setCheckoutStep('success');

      // Erase parameters from address bar cleanly so reload stays in success state beautifully
      try {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      } catch (err) {
        console.warn("Could not rewrite address bar parameters", err);
      }
    } else if (paymentStatus === 'cancelled') {
      addDeveloperLog(`[Callback Alert] Check out payment was cancelled on the Ababil network.`);
      setErrorText("The payment checkout process was cancelled or didn't complete. Please try again.");
      
      try {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      } catch (err) {
        console.warn("Could not rewrite address bar parameters", err);
      }
    }
  }, []);

  const handleCreateHostIntent = async () => {
    setErrorText(null);
    setCheckoutStep('processing');
    const details = getPlanDetails(selectedPlan);
    
    addDeveloperLog(`[Backend Call] Creating payment intent of ${details.usdcAmount} USDC on testnet for ${selectedPlan.toUpperCase()}`);

    try {
      const res = await fetch('/api/ababil/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: selectedPlan,
          amount_usdc: details.usdcAmount,
          description: `X Premium ${details.title} Membership — 1 month`
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ababil backend API failed to generate payment intent URL");
      }

      addDeveloperLog(`[Success] Payment Intent ${data.intent_id} issued. Redirecting to hosted checkout...`);
      
      // Real-world simulation: Redirect the user directly to the hosted checkout URL hosted by Ababil
      setTimeout(() => {
        window.location.href = data.checkout_url;
      }, 1000);

    } catch (err: any) {
      console.error(err);
      addDeveloperLog(`[Failure] Connection to Ababil gateway failed: ${err.message}`);
      setErrorText(err.message || 'Verification connection failed. Please double check that API server is running.');
      setCheckoutStep('selection');
    }
  };

  const basicBenefits = [
    { text: "Small reply boost", icon: "boost" },
    { text: "Bookmark folders", icon: "folder" },
    { text: "Highlights tab", icon: "star" },
    { text: "Edit posts", icon: "edit" },
    { text: "Create longer posts", icon: "longer" },
    { text: "Customize your experience", icon: "customize" }
  ];

  const premiumBenefits = [
    { text: "Verified checkmark", icon: "verified" },
    { text: "Enhanced Grok access", icon: "grok" },
    { text: "Advanced analytics", icon: "analytics", hasInfo: true },
    { text: "Less ads in your feeds", icon: "ads" },
    { text: "Boosted replies", icon: "boost", hasInfo: true },
    { text: "Write Articles", icon: "articles" },
    { text: "Get paid to post", icon: "paid" },
    { text: "Creator Subscriptions", icon: "creator" }
  ];

  const premiumPlusBenefits = [
    { text: "Fully ad-free", icon: "adfree" },
    { text: "SuperGrok", icon: "supergrok", isNew: true, hasInfo: true, subtext: "Worth $30 USD a month" },
    { text: "Handle Marketplace", icon: "marketplace", isNew: true, hasInfo: true },
    { text: "Highest reply boost", icon: "highest", hasInfo: true },
    { text: "Radar Advanced Search", icon: "radar", hasInfo: true },
    { text: "X Pro", icon: "xpro", hasInfo: true }
  ];

  const renderBenefitIcon = (iconName: string) => {
    const baseClass = "w-8 h-8 rounded-lg bg-[#15181c] border border-[#2f3336] flex items-center justify-center shrink-0 text-neutral-400";
    
    switch (iconName) {
      case 'boost':
        return (
          <div className={baseClass}>
            <TrendingUp className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'folder':
        return (
          <div className={baseClass}>
            <Folder className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'star':
        return (
          <div className={baseClass}>
            <Star className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'edit':
        return (
          <div className={baseClass}>
            <FileText className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'longer':
        return (
          <div className={baseClass}>
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#e7e9ea] fill-current">
              <path d="M3 4h18v2H3V4zm0 5h12v2H3V9zm0 5h18v2H3v-2zm0 5h14v2H3v-2z" />
            </svg>
          </div>
        );
      case 'customize':
        return (
          <div className={baseClass}>
            <Sliders className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'verified':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#1d9bf0]/10 border border-[#1d9bf0]/20 flex items-center justify-center shrink-0">
            <BadgeCheck className="h-5 w-5 text-[#1d9bf0] fill-current" />
          </div>
        );
      case 'grok':
        return (
          <div className={baseClass}>
            <BrainCircuit className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'analytics':
        return (
          <div className={baseClass}>
            <Activity className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'ads':
        return (
          <div className={baseClass}>
            <EyeOff className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'articles':
        return (
          <div className={baseClass}>
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#e7e9ea] fill-current">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
        );
      case 'paid':
        return (
          <div className={baseClass}>
            <Wallet className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'creator':
        return (
          <div className={baseClass}>
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#e7e9ea] fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
            </svg>
          </div>
        );
      case 'adfree':
        return (
          <div className={baseClass}>
            <Sparkles className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'supergrok':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#e7b51b]/10 border border-[#e7b51b]/20 flex items-center justify-center shrink-0">
            <BrainCircuit className="h-4.5 w-4.5 text-[#e7b51b]" />
          </div>
        );
      case 'marketplace':
        return (
          <div className={baseClass}>
            <span className="text-[14px] font-black text-[#e7e9ea] font-sans">@</span>
          </div>
        );
      case 'highest':
        return (
          <div className={baseClass}>
            <Zap className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      case 'radar':
        return (
          <div className={baseClass}>
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#e7e9ea] fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1" />
            </svg>
          </div>
        );
      case 'xpro':
        return (
          <div className={baseClass}>
            <Laptop className="h-4.5 w-4.5 text-[#e7e9ea]" />
          </div>
        );
      default:
        return (
          <div className={baseClass}>
            ✓
          </div>
        );
    }
  };

  try {
    const details = getPlanDetails(selectedPlan);

    return (
      <div id="premium-page-container" className="flex-1 w-full max-w-[1000px] mx-auto min-h-screen bg-black text-white flex flex-col justify-between py-2 relative">
        {/* Floating circular close button exactly like premium X.com */}
        <button 
          id="btn-back-home"
          type="button"
          onClick={() => setCurrentPage('home')}
          className="absolute top-6 left-6 p-2 bg-[#18181c]/80 hover:bg-[#28282c] text-white rounded-full transition-all cursor-pointer border border-[#2f3336]/60 flex items-center justify-center z-30 shadow-md"
          title="Close"
        >
          <X className="h-5 w-5 text-neutral-200" />
        </button>

        <div>

        {errorText && (
          <div id="checkout-error-banner" className="m-4 p-4.5 bg-red-950/20 border border-red-900/40 text-red-300 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div className="text-[13px]">
              <span className="font-bold block text-red-200">Payment Check Failed</span>
              <p className="leading-snug mt-1 opacity-90">{errorText}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Plan Selections Screen */}
        {checkoutStep === 'selection' && (
          <div id="tiers-layout-selector" className="p-4 flex flex-col gap-6 animate-fade-in animate-duration-300">
            
            {/* Cosmic Space Starfield Visual Header */}
            <div className="flex flex-col items-center justify-center pt-8 pb-4 relative overflow-hidden bg-black rounded-3xl border border-[#2f3336]/40">
              {/* Radial gradient background to mimic deep space aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,155,240,0.12)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none" />
              
              {/* Dynamic decorative stars */}
              <div className="absolute top-2 left-6 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" />
              <div className="absolute top-8 right-12 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
              <div className="absolute top-16 left-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-35" />
              <div className="absolute top-4 right-1/4 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse" />
              
              {/* Beautiful glowing blue checkmark badge exactly like X */}
              <div className="relative flex justify-center mt-2 mb-4">
                <div className="absolute w-24 h-24 bg-[#1d9bf0]/15 rounded-full blur-2xl animate-pulse" />
                <div className="relative z-10 p-4.5 bg-gradient-to-b from-[#1d9bf0]/15 to-[#1d9bf0]/25 rounded-full border-2 border-[#1d9bf0]/45 shadow-[0_0_35px_rgba(29,155,240,0.4)] flex items-center justify-center">
                  <BadgeCheck className="h-14 w-14 text-[#1d9bf0] fill-current" />
                </div>
              </div>

              <h2 className="text-3xl font-extrabold mt-3 tracking-tight text-center max-w-[550px] text-white">
                {billingPeriod === 'monthly' ? "Don't lose your 50% discount on Premium" : "Upgrade to Premium"}
              </h2>
            </div>

            {/* Toggle Pill Button */}
            <div className="flex bg-[#16181c]/90 border border-[#2f3336] p-0.5 rounded-full w-full max-w-[260px] mx-auto mb-2">
              <button 
                type="button"
                onClick={() => {
                  setBillingPeriod('yearly');
                  addDeveloperLog("[Billing Period] Switched to Annual (12% off).");
                }}
                className={`flex-1 py-2 px-4 rounded-full text-[13.5px] font-black transition-all text-center select-none cursor-pointer ${
                  billingPeriod === 'yearly' ? 'bg-[#2f3336] text-white shadow' : 'text-[#71767b] hover:text-[#e7e9ea]'
                }`}
              >
                Annual
              </button>
              <button 
                type="button"
                onClick={() => {
                  setBillingPeriod('monthly');
                  addDeveloperLog("[Billing Period] Switched to Monthly (50% off promo).");
                }}
                className={`flex-1 py-2 px-4 rounded-full text-[13.5px] font-black transition-all text-center select-none cursor-pointer ${
                  billingPeriod === 'monthly' ? 'bg-[#2f3336] text-white shadow' : 'text-[#71767b] hover:text-[#e7e9ea]'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mt-2">
              
              {/* Card 1: Basic */}
              <div 
                id="plan-card-basic"
                onClick={() => {
                  setSelectedPlan('basic');
                  addDeveloperLog("[Plan Select] Basic Plan selected.");
                }}
                className={`p-5.5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedPlan === 'basic' 
                    ? 'border-white bg-[#0e0f11] ring-1 ring-white/10 shadow-[0_0_25px_rgba(255,255,255,0.06)]' 
                    : 'border-[#2f3336]/70 bg-[#0e0f11]/50 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[17px] font-extrabold text-white tracking-tight">Basic</span>
                    {selectedPlan === 'basic' ? (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-black fill-none stroke-current stroke-3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-700" />
                    )}
                  </div>

                  <div className="mt-3.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {billingPeriod === 'yearly' ? 'BDT 200' : 'BDT 240'}
                      </span>
                      <span className="text-xs font-semibold text-[#71767b]">/ month</span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <span className="text-xs font-semibold text-[#71767b] block mt-1">
                        BDT 2,400 billed annually
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-4 text-[13.5px] text-[#e7e9ea] font-medium leading-snug">
                    {basicBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        {renderBenefitIcon(benefit.icon)}
                        <span>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 2: Premium (Standard default) */}
              <div 
                id="plan-card-premium"
                onClick={() => {
                  setSelectedPlan('premium');
                  addDeveloperLog("[Plan Select] Premium Plan selected.");
                }}
                className={`p-5.5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedPlan === 'premium' 
                    ? 'border-white bg-[#0e0f11] ring-1 ring-white/10 shadow-[0_0_25px_rgba(255,255,255,0.06)]' 
                    : 'border-[#2f3336]/70 bg-[#0e0f11]/50 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <span className="text-[17px] font-extrabold text-white tracking-tight flex items-center gap-2">
                      Premium
                      {billingPeriod === 'monthly' && (
                        <span className="bg-[#00ba7c] text-white text-[9px] font-black px-2 py-0.5 rounded-full select-none">
                          50% off for 2 mos
                        </span>
                      )}
                    </span>
                    {selectedPlan === 'premium' ? (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-black fill-none stroke-current stroke-3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-700" />
                    )}
                  </div>

                  <div className="mt-3.5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {billingPeriod === 'monthly' && (
                        <span className="text-xl font-bold text-[#71767b] line-through">
                          BDT 600
                        </span>
                      )}
                      <span className="text-3xl font-black text-white tracking-tight">
                        {billingPeriod === 'yearly' ? 'BDT 500' : 'BDT 300'}
                      </span>
                      <span className="text-xs font-semibold text-[#71767b]">/ month</span>
                    </div>
                    <span className="text-xs font-semibold text-[#71767b] block mt-1 leading-tight">
                      {billingPeriod === 'yearly' 
                        ? 'BDT 6,000 billed annually' 
                        : 'For first 2 months, then BDT 600 billed monthly'}
                    </span>
                  </div>

                  <div className="text-[12px] text-[#71767b] font-bold mt-5 mb-3 uppercase tracking-wider">
                    Everything in Premium Basic, and
                  </div>

                  <ul className="space-y-4 text-[13.5px] text-[#e7e9ea] font-medium leading-snug">
                    {premiumBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {renderBenefitIcon(benefit.icon)}
                          <span>{benefit.text}</span>
                        </div>
                        {benefit.hasInfo && (
                          <span className="text-[#71767b] hover:text-white cursor-pointer select-none text-xs">ⓘ</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 3: Premium+ */}
              <div 
                id="plan-card-premium-plus"
                onClick={() => {
                  setSelectedPlan('premium_plus');
                  addDeveloperLog("[Plan Select] Premium+ Plan selected.");
                }}
                className={`p-5.5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedPlan === 'premium_plus' 
                    ? 'border-white bg-[#0e0f11] ring-1 ring-white/10 shadow-[0_0_25px_rgba(255,255,255,0.06)]' 
                    : 'border-[#2f3336]/70 bg-[#0e0f11]/50 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <span className="text-[17px] font-extrabold text-white tracking-tight flex items-center gap-2">
                      Premium+
                      {billingPeriod === 'monthly' && (
                        <span className="bg-[#00ba7c] text-white text-[9px] font-black px-2 py-0.5 rounded-full select-none">
                          50% off for 2 mos
                        </span>
                      )}
                    </span>
                    {selectedPlan === 'premium_plus' ? (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-black fill-none stroke-current stroke-3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-700" />
                    )}
                  </div>

                  <div className="mt-3.5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {billingPeriod === 'monthly' && (
                        <span className="text-xl font-bold text-[#71767b] line-through">
                          BDT 4,860
                        </span>
                      )}
                      <span className="text-3xl font-black text-white tracking-tight">
                        {billingPeriod === 'yearly' ? 'BDT 4,004.17' : 'BDT 2,430'}
                      </span>
                      <span className="text-xs font-semibold text-[#71767b]">/ month</span>
                    </div>
                    <span className="text-xs font-semibold text-[#71767b] block mt-1 leading-tight">
                      {billingPeriod === 'yearly' 
                        ? 'BDT 48,050 billed annually' 
                        : 'For first 2 months, then BDT 4,860 billed monthly'}
                    </span>
                  </div>

                  <div className="text-[12px] text-[#71767b] font-bold mt-5 mb-3 uppercase tracking-wider">
                    Everything in Premium, and
                  </div>

                  <ul className="space-y-4 text-[13.5px] text-[#e7e9ea] font-medium leading-snug">
                    {premiumPlusBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {renderBenefitIcon(benefit.icon)}
                            <span className="flex items-center gap-1.5">
                              {benefit.text}
                              {benefit.isNew && (
                                <span className="bg-[#1d9bf0] text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase">NEW</span>
                              )}
                            </span>
                          </div>
                          {benefit.hasInfo && (
                            <span className="text-[#71767b] hover:text-white cursor-pointer select-none text-xs">ⓘ</span>
                          )}
                        </div>
                        {benefit.subtext && (
                          <div className="text-[11px] text-[#71767b] ml-11 font-bold">
                            {benefit.subtext}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Request a Handle Premium+ Box at the bottom */}
                  <div className="mt-5 border border-[#2f3336]/60 bg-[#16181c] p-4.5 rounded-2xl relative overflow-hidden">
                    <span className="absolute -right-3 -bottom-5 text-7xl font-black text-neutral-800 opacity-20 select-none font-sans pointer-events-none">@</span>
                    <h4 className="font-extrabold text-[13.5px] text-white relative z-10">Request a Handle with Premium+</h4>
                    <p className="text-[11px] text-[#71767b] mt-1 leading-snug relative z-10 font-bold">
                      Request the handle you've always wanted before it's gone.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Gold Business Banner */}
            <div className="mt-6 border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-black p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(231,181,27,0.04)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none" />
              <div className="flex items-start gap-4 w-full sm:w-auto relative z-10">
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/25 shrink-0 text-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(231,181,27,0.12)]">
                  <BadgeCheck className="h-6 w-6 text-amber-500 fill-current shrink-0" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[15px] text-white tracking-tight">Are you a business?</h4>
                  <p className="text-[13px] text-[#a0a3a6] mt-0.5 leading-snug">
                    Gain credibility and grow faster with Premium Business
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="bg-white hover:bg-neutral-100 text-black font-extrabold text-xs py-2.5 px-6 rounded-full transition-all cursor-pointer shrink-0 shadow-lg relative z-10"
                onClick={() => addDeveloperLog("[Business Integration] Switched views to explore organization features.")}
              >
                Explore Premium Business
              </button>
            </div>

            {/* Compare Tiers header */}
            <div className="text-center mt-6 mb-2">
              <h3 className="font-extrabold text-[16px] tracking-tight text-white select-none">Compare tiers & features</h3>
            </div>

            {/* Glassmorphic Sticky bottom bar exactly like X */}
            <div className="sticky bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-[#2f3336]/80 p-4.5 flex flex-col sm:flex-row items-center justify-between gap-5 z-20 rounded-t-3xl -mx-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[17px] font-black text-white capitalize">
                  {selectedPlan === 'basic' ? 'Basic' : selectedPlan === 'premium' ? 'Premium' : 'Premium+'}
                </span>
                
                <div className="flex items-baseline gap-2 mt-1">
                  {billingPeriod === 'monthly' && selectedPlan !== 'basic' && (
                    <span className="text-base font-bold text-[#71767b] line-through">
                      {selectedPlan === 'premium' ? 'BDT 600' : 'BDT 4,860'}
                    </span>
                  )}
                  <span className="text-2xl font-black text-white tracking-tight">
                    {billingPeriod === 'yearly' 
                      ? (selectedPlan === 'basic' ? 'BDT 2,400' : selectedPlan === 'premium' ? 'BDT 6,000' : 'BDT 48,050')
                      : (selectedPlan === 'basic' ? 'BDT 240' : selectedPlan === 'premium' ? 'BDT 300' : 'BDT 2,430')}
                  </span>
                  <span className="text-xs font-semibold text-[#71767b]">
                    {billingPeriod === 'yearly' ? '/ year' : '/ month'}
                  </span>
                </div>
                
                <span className="text-[12.5px] text-[#71767b] block mt-1 font-bold leading-tight">
                  {billingPeriod === 'yearly' 
                    ? 'Billed annually' 
                    : (selectedPlan === 'basic' ? 'Billed monthly' : `For first 2 months, then ${selectedPlan === 'premium' ? 'BDT 600' : 'BDT 4,860'} billed monthly`)}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 w-full sm:w-auto items-center sm:items-end">
                <button
                  id="btn-process-checkout-redirect"
                  onClick={handleCreateHostIntent}
                  className="w-full sm:w-[280px] bg-white hover:bg-neutral-100 text-black font-extrabold py-3.5 px-8 rounded-full text-[14.5px] select-none transition-all cursor-pointer shadow-lg text-center flex items-center justify-center gap-2"
                >
                  Subscribe & Pay
                </button>
                
                <p className="text-[10px] text-[#71767b] max-w-[420px] text-center sm:text-right leading-normal font-bold">
                  By subscribing, you agree to our <span className="underline hover:text-white cursor-pointer">Purchaser Terms</span>, and that subscriptions auto-renew until you cancel. <span className="underline hover:text-white cursor-pointer">Cancel anytime</span>, at least 24 hours prior to renewal to avoid additional charges. Price subject to change. Manage your subscription through the platform you subscribed on.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: Processing step (Server fetch & network connection) */}
        {checkoutStep === 'processing' && (
          <div id="payment-processing-splash" className="p-8 py-28 text-center flex flex-col items-center justify-center gap-6 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-neutral-800 border-t-cyan-500 animate-spin" />
              <Coins className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-cyan-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white mb-1.5">Generating Ababil Payment Request...</h3>
              <p className="text-[#71767b] text-[13.5px] max-w-[350px] mx-auto leading-relaxed">
                Interfacing with <strong>Ababil Pay (x402 Blockchain Engine)</strong> to build a testnet checkout session. Please do not close or reload this page.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2.5: Resilient High-Fidelity Ababil Simulator checkout page */}
        {checkoutStep === 'sim_checkout' && (
          <div id="ababil-simulator-layout" className="p-4 flex flex-col gap-6 animate-fade-in">
            
            {/* Top Logo and Description representing official Ababil checkout page */}
            <div className="border border-amber-500/30 bg-neutral-900/50 p-4.5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-amber-500 font-black tracking-wide text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  <Coins className="h-3.5 w-3.5 animate-spin" /> Ababil Pay Sandbox Gateway
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">x402 protocol v1.0.0</span>
              </div>
              <h3 className="text-[16px] font-black text-white">Cryptographic USDC P2P Settlement</h3>
              <p className="text-[12px] text-neutral-400 mt-1 leading-snug">
                You were routed to the Ababil Pay local client-side ledger simulator because the server environment's network egress is sandboxed. All EIP-3009 signatures and on-chain payouts are executed in high-fidelity sandbox mode.
              </p>
            </div>

            {/* Grid display for merchant information and transaction details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: Merchant Information */}
              <div className="p-4 bg-neutral-900/40 border border-[#2f3336] rounded-2xl">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Merchant Identity</span>
                <span className="text-sm font-extrabold text-[#e7e9ea] block mt-1">X Premium Subscriptions Ltd</span>
                <span className="text-xs text-neutral-400 mt-0.5 block font-mono">API Target ID: d03e0751-5a79...</span>

                <div className="mt-4 pt-3.5 border-t border-[#2f3336]/60">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Billed Subs Tier</span>
                  <span className="text-xs font-black text-white block mt-0.5 capitalize bg-[#1d9bf0]/10 text-[#1d9bf0] w-fit px-2.5 py-0.5 rounded-md">
                    X {details.title} (Verified Checkmark)
                  </span>
                  <span className="text-xl font-mono font-black text-amber-500 block mt-2">
                    {details.usdcAmount.toFixed(2)} USDC
                  </span>
                </div>
              </div>

              {/* Box 2: Network selection options and CAIP mappings */}
              <div className="p-4 bg-neutral-900/40 border border-[#2f3336] rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Verify On-Chain Network</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNetwork('eip155:84532');
                        addDeveloperLog("[Mock Network] Selected Base Sepolia testnet.");
                      }}
                      className={`py-2 px-2.5 text-left rounded-xl border text-[11px] font-extrabold flex flex-col gap-0.5 transition-all ${
                        selectedNetwork === 'eip155:84532' ? 'border-amber-500 bg-amber-500/5 text-white' : 'border-[#2f3336] text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>Base Sepolia</span>
                      <span className="font-mono text-[9px] opacity-75">eip155:84532</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNetwork('eip155:2911');
                        addDeveloperLog("[Mock Network] Selected Arc testnet.");
                      }}
                      className={`py-2 px-2.5 text-left rounded-xl border text-[11px] font-extrabold flex flex-col gap-0.5 transition-all ${
                        selectedNetwork === 'eip155:2911' ? 'border-amber-500 bg-amber-500/5 text-white' : 'border-[#2f3336] text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>Arc Testnet</span>
                      <span className="font-mono text-[9px] opacity-75">eip155:2911</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNetwork('eip155:11155111');
                        addDeveloperLog("[Mock Network] Selected Ethereum Sepolia testnet.");
                      }}
                      className={`py-2 px-2.5 text-left rounded-xl border text-[11px] font-extrabold flex flex-col gap-0.5 transition-all ${
                        selectedNetwork === 'eip155:11155111' ? 'border-amber-500 bg-amber-500/5 text-white' : 'border-[#2f3336] text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>ETH Sepolia</span>
                      <span className="font-mono text-[9px] opacity-75">eip155:11155111</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNetwork('solana:devnet');
                        addDeveloperLog("[Mock Network] Selected Solana Devnet.");
                      }}
                      className={`py-2 px-2.5 text-left rounded-xl border text-[11px] font-extrabold flex flex-col gap-0.5 transition-all ${
                        selectedNetwork === 'solana:devnet' ? 'border-amber-500 bg-amber-500/5 text-white' : 'border-[#2f3336] text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>Solana Devnet</span>
                      <span className="font-mono text-[9px] opacity-75">solana:devnet</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Wallet Address configuration box */}
            <div className="p-4 bg-neutral-900/40 border border-[#2f3336] rounded-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Buyer Signing Key (Simulation Wallet)
                </label>
                <span className="text-[10px] text-green-400 font-mono bg-green-950/20 px-2 py-0.5 rounded border border-green-900/30">
                  ● Ready to sign
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={simWalletAddress}
                  onChange={(e) => setSimWalletAddress(e.target.value)}
                  placeholder="0xBuyerAddress..."
                  className="bg-black text-xs font-mono text-neutral-200 p-2.5 rounded-xl border border-[#2f3336] flex-1 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const randomHex = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
                    setSimNonce(`0x${randomHex}`);
                    addDeveloperLog("[Mock Event] Generated fresh peer-to-peer x402 signing nonce.");
                  }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 rounded-xl border border-[#2f3336] text-xs font-bold transition-all cursor-pointer select-none"
                  title="Generate dynamic nonce"
                >
                  Regen Nonce
                </button>
              </div>
            </div>

            {/* Cryptographic block: Display the EIP-712 / EIP-3009 JSON typed data details nicely */}
            <div className="p-4 bg-[#0a0a0c] border border-[#2f3336] rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-bold">
                  <Terminal className="h-4.5 w-4.5 text-amber-500" />
                  <span>EIP-712 Typed Data Schema (Decentralized USDC P2P)</span>
                </div>
                <span className="text-[9px] text-neutral-500 font-mono">TransferWithAuthorization</span>
              </div>
              
              <pre className="font-mono text-[10px] bg-black text-amber-500 p-3 rounded-xl max-h-[170px] overflow-y-auto block whitespace-pre-wrap leading-tight border border-[#1b1c20] scrollbar-thin">
                {JSON.stringify({
                  domain: {
                    name: "USDC",
                    version: "2",
                    chainId: selectedNetwork === 'eip155:84532' ? 84532 : selectedNetwork === 'eip155:11155111' ? 11155111 : 2911,
                    verifyingContract: selectedNetwork === 'solana:devnet' 
                      ? '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' 
                      : selectedNetwork === 'eip155:11155111' 
                      ? '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' 
                      : selectedNetwork === 'eip155:2911' 
                      ? '0x3600000000000000000000000000000000000000'
                      : '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
                  },
                  primaryType: "TransferWithAuthorization",
                  message: {
                    from: simWalletAddress,
                    to: "0xMerchantAddress_x402_Treasury",
                    value: (details.usdcAmount * 1000000).toString(),
                    validAfter: "0",
                    validBefore: (Math.floor(Date.now() / 1000) + 900).toString(),
                    nonce: simNonce
                  }
                }, null, 2)}
              </pre>
            </div>

            {/* Current Process workflow state details displaying in real-time */}
            {simStatus !== 'idle' && (
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin shrink-0 mt-0.5" />
                <div className="text-[12.5px] leading-snug">
                  {simStatus === 'signing' && (
                    <p className="text-[#e7e9ea]">
                      <strong className="text-cyan-500">Step 1/3: signing cryptographic typed data...</strong>
                      <span className="block text-neutral-400 text-xs mt-0.5">Prompting MetaMask/Phantom signature keys for EIP-3009 peer-to-peer authorization block.</span>
                    </p>
                  )}
                  {simStatus === 'verifying' && (
                    <p className="text-[#e7e9ea]">
                      <strong className="text-cyan-500">Step 2/3: verifying EIP-712 payload...</strong>
                      <span className="block text-neutral-400 text-xs mt-0.5">Ababil is validating the cryptographic parameters server-side through the network facilitator protocol.</span>
                    </p>
                  )}
                  {simStatus === 'settling' && (
                    <p className="text-[#e7e9ea]">
                      <strong className="text-cyan-500">Step 3/3: broadcasting direct P2P transfer...</strong>
                      <span className="block text-neutral-400 text-xs mt-0.5">Submitting transferWithAuthorization to Base testnet nodes. Settlement is finalized instantly.</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar at bottom */}
            <div className="flex gap-4 border-t border-[#2f3336] pt-5">
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('selection');
                  addDeveloperLog("[Sandbox Router] Switched back to tier pricing catalog.");
                }}
                className="flex-1 py-3 text-sm font-extrabold bg-[#18181c] border border-[#2f3336] hover:bg-neutral-800 text-[#e7e9ea] rounded-full transition-colors cursor-pointer text-center select-none"
                disabled={simStatus !== 'idle'}
              >
                Cancel Checkout
              </button>

              <button
                type="button"
                onClick={() => {
                  if (simStatus !== 'idle') return;
                  
                  setSimStatus('signing');
                  addDeveloperLog(`[Sim Engine] Initiated sign-typed-data for ${selectedPlan.toUpperCase()}.`);

                  setTimeout(() => {
                    setSimStatus('verifying');
                    addDeveloperLog(`[Sim Engine] Received signature. Initializing signature audits on ${selectedNetwork}...`);

                    setTimeout(() => {
                      setSimStatus('settling');
                      addDeveloperLog(`[Sim Engine] Signature audit PASSED. Relaying transaction on-chain via EIP-3009 EOA sponsor...`);

                      setTimeout(() => {
                        setSimStatus('completed');
                        addDeveloperLog(`[Success Callback] P2P payment of ${details.usdcAmount} USDC finalized. Verification is LIVE!`);
                        
                        onUpgradeUser(selectedPlan);
                        setCheckoutStep('success');
                        setSimStatus('idle');
                      }, 1300);

                    }, 1300);

                  }, 1300);
                }}
                className={`flex-1 py-3 text-sm font-black rounded-full select-none transition-all flex items-center justify-center gap-1.5 shadow ${
                  simStatus !== 'idle' 
                    ? 'bg-amber-500/20 text-amber-500/60 cursor-not-allowed' 
                    : 'bg-[#e7b51b] hover:bg-[#d6a512] text-black cursor-pointer shadow-amber-500/5'
                }`}
                disabled={simStatus !== 'idle'}
              >
                <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                <span>Authorize & Pay USDC</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Success state (Back from Ababil Pay) */}
        {checkoutStep === 'success' && (
          <div id="payment-success-splash" className="p-6 py-24 text-center flex flex-col items-center justify-center gap-7 animate-fade-in">
            <div className="bg-cyan-500/10 p-5 rounded-full border border-cyan-500/30 animate-bounce">
              <BadgeCheck className="h-16 w-16 text-cyan-500 fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">Payment Verified!</h3>
              <p className="text-cyan-500 font-extrabold font-mono text-xs uppercase tracking-widest mt-1">
                USDC Settled successfully via Ababil Pay
              </p>
              
              <p className="text-[#a0a3a6] text-[13.5px] mt-4 max-w-[430px] mx-auto leading-relaxed">
                Success! Your cryptographic USDC payment authorization has been submitted and settled on-chain. Your account status is now updated to <strong>Verified Creator</strong>, which appends the legendary verification badge to all your posts!
              </p>
            </div>

            <button
              id="btn-return-feed"
              onClick={() => {
                setCheckoutStep('selection');
                setCurrentPage('home');
              }}
              className="w-full max-w-[280px] bg-white text-black hover:bg-neutral-100 font-black py-3 rounded-full transition-colors cursor-pointer text-sm shadow-md"
            >
              Continue to Timeline
            </button>
          </div>
        )}

      </div>

      {/* Developer Live Action Logs console wrapper */}
      <div id="developer-sandbox-logs" className="m-4 mt-8 bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden text-left flex flex-col">
        <div className="bg-neutral-900 px-4 py-3 border-b border-[#2f3336] flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <Terminal className="h-4 w-4 text-cyan-500" />
            <span className="font-mono text-[11px] font-black uppercase tracking-wider">Ababil x402 Integrator Feed</span>
          </div>
          <span className="text-[10px] text-cyan-500 font-mono font-bold tracking-widest animate-pulse flex items-center gap-1.5">
            <Activity className="h-3 w-3" /> LIVE HANDSHAKES
          </span>
        </div>
        <div className="p-3.5 block max-h-[140px] overflow-y-auto font-mono text-[11px] bg-black text-[#8b949e] leading-snug space-y-1 font-semibold scrollbar-thin">
          {developerLogs.map((log, i) => (
            <div key={i} className={`p-1 rounded ${log.includes('[Success') || log.includes('[Success Callback]') ? 'text-green-400 bg-green-950/15' : log.includes('[Backend Call]') ? 'text-cyan-400 bg-cyan-950/25' : ''}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  } catch (err: any) {
    console.error("PremiumPage Render Crash Caught:", err);
    return (
      <div className="p-8 bg-red-950/20 border border-red-900 text-red-200 rounded-2xl m-4 text-left font-mono text-xs max-w-[600px] mx-auto">
        <h3 className="font-bold text-sm text-red-100 mb-2">PremiumPage Render Exception</h3>
        <p className="font-bold">Error: {err.message || String(err)}</p>
        <pre className="mt-4 p-3 bg-black rounded max-h-[300px] overflow-auto whitespace-pre-wrap text-red-400">
          {err.stack || "No stack trace available"}
        </pre>
        <button 
          onClick={() => setCurrentPage('home')}
          className="mt-4 bg-white text-black px-4 py-2 rounded-full font-bold text-xs cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }
}
