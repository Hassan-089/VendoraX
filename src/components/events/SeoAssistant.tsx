'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Globe, 
  RefreshCw, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface SeoAssistantProps {
  title: string;
  category: string;
  city: string;
  venue: string;
  currentDescription: string;
  onApplyDescription: (description: string) => void;
  onClose: () => void;
}

export function SeoAssistant({
  title,
  category,
  city,
  venue,
  currentDescription,
  onApplyDescription,
  onClose
}: SeoAssistantProps) {
  const [activeTab, setActiveTab] = useState<'audit' | 'generate'>('audit');
  
  // Generator State
  const [highlights, setHighlights] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Real-time SEO Analysis State
  const [seoScore, setSeoScore] = useState(0);
  const [checks, setChecks] = useState({
    length: { status: 'fail', message: 'No text provided', score: 0 },
    city: { status: 'fail', message: 'City not mentioned', score: 0 },
    venue: { status: 'fail', message: 'Venue not mentioned', score: 0 },
    keywords: { status: 'fail', message: 'Title keywords not found', score: 0 },
    cta: { status: 'fail', message: 'Call to Action missing', score: 0 }
  });

  // Run SEO Audit
  useEffect(() => {
    const text = currentDescription || '';
    const cleanText = text.trim();
    
    // 1. Length Check (Max 30 pts)
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    let lengthStatus = 'fail';
    let lengthMsg = 'Too short (under 50 words)';
    let lengthScore = 0;
    
    if (wordCount >= 100 && wordCount <= 300) {
      lengthStatus = 'pass';
      lengthMsg = `Optimal length (${wordCount} words)`;
      lengthScore = 30;
    } else if (wordCount >= 50 && wordCount < 100) {
      lengthStatus = 'warning';
      lengthMsg = `A bit short (${wordCount} words, target: 100-300)`;
      lengthScore = 20;
    } else if (wordCount > 300 && wordCount <= 450) {
      lengthStatus = 'warning';
      lengthMsg = `A bit long (${wordCount} words, target: 100-300)`;
      lengthScore = 20;
    } else if (wordCount > 450) {
      lengthStatus = 'fail';
      lengthMsg = `Too long (${wordCount} words, can dilute SEO density)`;
      lengthScore = 10;
    } else if (wordCount > 0) {
      lengthStatus = 'fail';
      lengthScore = 10;
    }

    // 2. City Check (Max 20 pts)
    let cityStatus = 'fail';
    let cityMsg = `City "${city || 'Not set'}" not mentioned`;
    let cityScore = 0;
    if (city && cleanText.toLowerCase().includes(city.toLowerCase())) {
      cityStatus = 'pass';
      cityMsg = `City "${city}" is mentioned`;
      cityScore = 20;
    }

    // 3. Venue Check (Max 20 pts)
    let venueStatus = 'fail';
    let venueMsg = `Venue "${venue || 'Not set'}" not mentioned`;
    let venueScore = 0;
    if (venue && cleanText.toLowerCase().includes(venue.toLowerCase())) {
      venueStatus = 'pass';
      venueMsg = `Venue "${venue}" is mentioned`;
      venueScore = 20;
    }

    // 4. Title Keywords Check (Max 15 pts)
    let keywordStatus = 'fail';
    let keywordMsg = 'No key terms from Title found';
    let keywordScore = 0;
    if (title) {
      const titleWords = title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3);
      
      const foundWords = titleWords.filter(w => cleanText.toLowerCase().includes(w));
      
      if (titleWords.length === 0) {
        keywordStatus = 'pass';
        keywordMsg = 'Title is too short to extract keywords';
        keywordScore = 15;
      } else if (foundWords.length >= Math.min(2, titleWords.length)) {
        keywordStatus = 'pass';
        keywordMsg = `Includes title terms: ${foundWords.slice(0, 3).join(', ')}`;
        keywordScore = 15;
      } else if (foundWords.length > 0) {
        keywordStatus = 'warning';
        keywordMsg = `Only found 1 title term: ${foundWords[0]}`;
        keywordScore = 8;
      }
    }

    // 5. CTA Check (Max 15 pts)
    let ctaStatus = 'fail';
    let ctaMsg = 'No active Call to Action keywords (e.g. apply, book, register)';
    let ctaScore = 0;
    const ctaKeywords = ['apply', 'book', 'register', 'ticket', 'join', 'visit', 'booth', 'stall', 'sponsor', 'reserve', 'attend'];
    const hasCta = ctaKeywords.some(keyword => cleanText.toLowerCase().includes(keyword));
    if (hasCta) {
      ctaStatus = 'pass';
      ctaMsg = 'Contains a Call to Action (CTA) keyword';
      ctaScore = 15;
    }

    const calculatedScore = lengthScore + cityScore + venueScore + keywordScore + ctaScore;
    
    setSeoScore(calculatedScore);
    setChecks({
      length: { status: lengthStatus, message: lengthMsg, score: lengthScore },
      city: { status: cityStatus, message: cityMsg, score: cityScore },
      venue: { status: venueStatus, message: venueMsg, score: venueScore },
      keywords: { status: keywordStatus, message: keywordMsg, score: keywordScore },
      cta: { status: ctaStatus, message: ctaMsg, score: ctaScore }
    });
  }, [currentDescription, title, city, venue]);

  // Generate Fallback Template Client Side
  const generateLocalTemplate = () => {
    const activeCategory = category || 'Exhibition';
    const activeTitle = title || 'Our Special Event';
    const activeVenue = venue || 'Main Hall';
    const activeCity = city || 'Pakistan';
    const cleanHighlights = highlights 
      ? highlights.split(',').map(h => h.trim()).filter(Boolean)
      : ['Exclusive networking opportunities', 'Interactive live showcases', 'Engaging panel discussions with key figures'];
    
    const formattedHighlights = cleanHighlights.map(h => `- ${h}`).join('\n');
    
    let template = '';
    
    if (tone === 'Exciting' || tone === 'Casual') {
      template = `Get ready for the most anticipated event of the year! We are thrilled to host **${activeTitle}**—the ultimate gathering for the **${activeCategory}** industry. The event will take place at the iconic **${activeVenue}** in the heart of **${activeCity}**.

### 🌟 What to Expect:
${formattedHighlights}

### 💼 Why Exhibit or Sponsor?
This is your brand's biggest stage to connect with visitors, display your offerings, and network with key decision-makers. Stalls are booking out fast!

Don't miss out! **Book your stall or register to attend** ${activeTitle} today and secure your spot!`;
    } else if (tone === 'Persuasive') {
      template = `Maximize your business outreach at **${activeTitle}**, the premier trade event for **${activeCategory}** in **${activeCity}**. Located at the highly accessible **${activeVenue}**, this exhibition is designed to connect premium exhibitors with thousands of targeted clients.

### 📈 Core Event Highlights:
${formattedHighlights}

### 🤝 Sponsor and Partner Opportunities:
Position your brand in front of industry leaders. We offer flexible stall sizes and custom sponsorships to fit your marketing goals.

Spaces are strictly limited. **Apply for a stall package** now or register to attend. Elevate your presence at ${activeTitle}!`;
    } else { // Professional / Informative default
      template = `We are pleased to announce the upcoming **${activeTitle}**, a comprehensive event dedicated to **${activeCategory}**. The event is scheduled to take place at **${activeVenue}** in **${activeCity}**, drawing industry experts, professional exhibitors, and a diverse audience.

### 🔍 Key Themes & Highlights:
${formattedHighlights}

### 📦 Stall Bookings & Exhibitions:
The exhibition hall offers structured stall packages with full infrastructure (electricity, support staff, and media coverage). Organizations are encouraged to reserve their spaces early to secure optimal floor visibility.

For inquiries, booking details, or delegate registrations, please **register now** or review our stall package options below. We look forward to your participation at ${activeTitle}.`;
    }
    
    return template;
  };

  // Call Gemini/Server API
  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          city,
          venue,
          keywords,
          highlights,
          tone
        })
      });

      if (response.status === 501) {
        // API key not configured, run local template writer
        console.warn('API key not set, falling back to client template engine.');
        const backupText = generateLocalTemplate();
        setTimeout(() => {
          setGeneratedText(backupText);
          setIsGenerating(false);
        }, 1200); // Simulate generative delay for UX satisfaction
        return;
      }

      if (!response.ok) {
        throw new Error('API server returned error. Using smart local generator instead.');
      }

      const data = await response.json();
      if (data.text) {
        setGeneratedText(data.text);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (e: any) {
      console.error(e);
      // Fallback on catch
      const backupText = generateLocalTemplate();
      setGeneratedText(backupText);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      case 'fail':
      default:
        return <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20';
    if (score >= 50) return 'text-amber-500 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20';
    return 'text-rose-500 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20';
  };

  // Helper to create a URL slug
  const getSlug = (str: string) => {
    return (str || 'event')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="flex flex-col h-[520px] max-h-[85vh]">
      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'audit' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Audit & SERP Preview
          </div>
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'generate' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI SEO Generator
          </div>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6">
        {activeTab === 'audit' ? (
          <div className="space-y-6">
            {/* Score Ring / Summary */}
            <div className="flex items-center gap-5 p-4 rounded-xl border border-border bg-muted/30">
              <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-bold text-2xl transition-all ${getScoreColorClass(seoScore)}`}>
                {seoScore}
                <span className="text-[10px] text-muted-foreground font-normal">Score</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">SEO Optimization Audit</h3>
                <p className="text-sm text-muted-foreground">
                  {seoScore >= 80 
                    ? 'Excellent! Your description is fully optimized for local search engines.' 
                    : seoScore >= 50 
                    ? 'Good, but could be improved. Try adding missing location parameters or a CTA.'
                    : 'Needs attention. Add city, venue details, and keep it above 100 words.'}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">SEO Checklist</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  {getStatusIcon(checks.length.status)}
                  <div className="text-sm">
                    <span className="font-medium block">Word Count Check</span>
                    <span className="text-muted-foreground text-xs">{checks.length.message}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  {getStatusIcon(checks.city.status)}
                  <div className="text-sm">
                    <span className="font-medium block">Local SEO: City Name</span>
                    <span className="text-muted-foreground text-xs">{checks.city.message}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  {getStatusIcon(checks.venue.status)}
                  <div className="text-sm">
                    <span className="font-medium block">Local SEO: Venue Name</span>
                    <span className="text-muted-foreground text-xs">{checks.venue.message}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  {getStatusIcon(checks.keywords.status)}
                  <div className="text-sm">
                    <span className="font-medium block">Title Keywords Check</span>
                    <span className="text-muted-foreground text-xs">{checks.keywords.message}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  {getStatusIcon(checks.cta.status)}
                  <div className="text-sm">
                    <span className="font-medium block">Call to Action (CTA) Presence</span>
                    <span className="text-muted-foreground text-xs">{checks.cta.message}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Search Snippet Preview */}
            <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
              <div className="bg-muted/50 px-4 py-2 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" />
                  Google Search Snippet Preview
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPreviewDevice('desktop')}
                    className={`text-xs px-2 py-0.5 rounded transition-all ${previewDevice === 'desktop' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    Desktop
                  </button>
                  <button 
                    onClick={() => setPreviewDevice('mobile')}
                    className={`text-xs px-2 py-0.5 rounded transition-all ${previewDevice === 'mobile' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>
              <div className="p-5 font-sans bg-white text-left">
                {previewDevice === 'desktop' ? (
                  <div className="max-w-[600px]">
                    <div className="text-[14px] text-[#202124] flex items-center gap-1.5 leading-5 mb-1 truncate">
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-medium text-muted-foreground">Ad</span>
                      <span>https://vendorax.com</span>
                      <span className="text-muted-foreground">› events › {getSlug(title)}</span>
                    </div>
                    <h3 className="text-[20px] text-[#1a0dab] font-medium leading-6 hover:underline cursor-pointer mb-1 truncate">
                      {title ? `${title} | Stall Bookings & Tickets` : 'Register Stall | Event Details'}
                    </h3>
                    <p className="text-[14px] text-[#4d5156] leading-[22px] line-clamp-2">
                      {currentDescription || 'Please enter a description on the main form or generate one with AI to preview what users will see on Google search.'}
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[375px] border border-[#e2e8f0] p-3 rounded-lg shadow-sm">
                    <div className="text-[12px] text-[#202124] flex items-center gap-1.5 leading-4 mb-1.5 truncate">
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium text-muted-foreground">Ad</span>
                      <span>vendorax.com</span>
                      <span className="text-muted-foreground">/events/{getSlug(title)}</span>
                    </div>
                    <h3 className="text-[16px] text-[#1558d6] font-medium leading-5 hover:underline cursor-pointer mb-1">
                      {title ? `${title} | Book Stalls` : 'Register for Event'}
                    </h3>
                    <p className="text-[12px] text-[#4d5156] leading-[18px] line-clamp-3">
                      {currentDescription || 'Please enter a description on the main form or generate one with AI to preview what users will see on Google search.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Input fields for generator */}
            <div className="space-y-4 border border-border p-4 rounded-xl bg-muted/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Desired Tone</label>
                  <select 
                    value={tone} 
                    onChange={e => setTone(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Exciting">Exciting</option>
                    <option value="Persuasive">Persuasive</option>
                    <option value="Informative">Informative</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Keywords (optional)</label>
                  <Input 
                    value={keywords} 
                    onChange={e => setKeywords(e.target.value)} 
                    placeholder="e.g. food festival, cheap stalls" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Highlights & Attractions (comma separated)</label>
                <textarea 
                  value={highlights} 
                  onChange={e => setHighlights(e.target.value)} 
                  className="w-full h-16 rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. 50+ stalls, live music concert, kid activities, free entry"
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full gap-2 shadow-sm font-semibold cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating SEO copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Description
                  </>
                )}
              </Button>
            </div>

            {/* Response Preview Box */}
            {generatedText && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-foreground">Generated Description</h4>
                  <span className="text-[11px] font-semibold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Ready
                  </span>
                </div>
                <div className="p-4 border border-border bg-card rounded-xl text-sm leading-relaxed text-left whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {generatedText}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="border-t border-border pt-4 mt-4 flex justify-between gap-4">
        <Button variant="ghost" onClick={onClose} className="cursor-pointer">
          Cancel
        </Button>
        {activeTab === 'generate' && generatedText && (
          <Button 
            variant="primary" 
            onClick={() => {
              onApplyDescription(generatedText);
              onClose();
            }}
            className="gap-2 cursor-pointer"
          >
            Apply to Description <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
