import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !data) return null;

  // Generate Share Text
  const generateShareText = () => {
    const { session, game } = data;
    const scoreStr = game.score > 0 ? `+${game.score.toLocaleString()}` : game.score.toLocaleString();
    
    return `🀄 対局終了！
日付: ${session.date}
場所: ${session.location || '不明'}
ルール: ${session.rule || '指定なし'}
持ち点: ${scoreStr}点
放銃: ${game.dealIns}回
#麻雀 #MahjongStats`;
  };

  const shareText = generateShareText();
  const shareUrl = import.meta.env.PROD
    ? "https://tagano-photograph.github.io/mahjongstats/"
    : "http://localhost:3000/";

  const handleShare = (platform: 'x' | 'facebook' | 'line' | 'instagram') => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = '';

    switch (platform) {
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'facebook':
        // Facebook does not allow pre-filling text via URL scheme, only URL sharing
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'line':
        url = `https://line.me/R/msg/text/?${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't support text sharing via URL. Copy to clipboard and open app.
        navigator.clipboard.writeText(shareText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            window.location.href = "instagram://app";
            // Fallback for desktop or if app scheme fails
            setTimeout(() => {
                window.open("https://www.instagram.com", "_blank");
            }, 500);
        });
        return;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">対局お疲れ様でした！</h3>
            <p className="text-sm text-slate-500 mb-6">
            今日の対局内容をSNSでシェアしませんか？
            </p>

            {/* Text Preview */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left border border-slate-100 relative group">
                <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
                    {shareText}
                </pre>
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(shareText);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-md shadow-sm border border-slate-200 text-slate-400 hover:text-mahjong-green active:scale-95 transition-all"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
            </div>

            {/* SNS Icons Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <button onClick={() => handleShare('x')} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg shadow-slate-200 group-active:scale-95 transition-transform">
                         {/* X Logo SVG */}
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">X</span>
                </button>

                <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-100 group-active:scale-95 transition-transform">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.376h3.428l-.581 3.669h-2.847v7.98c5.088-.711 9.024-5.078 9.024-10.358 0-5.808-4.698-10.506-10.506-10.506S.506 4.701.506 10.506c0 5.28 3.936 9.647 9.024 10.358z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Facebook</span>
                </button>

                <button onClick={() => handleShare('instagram')} className="flex flex-col items-center gap-2 group">
                     <div className="w-12 h-12 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-full flex items-center justify-center shadow-lg shadow-pink-100 group-active:scale-95 transition-transform">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Instagram</span>
                </button>

                <button onClick={() => handleShare('line')} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 bg-[#00B900] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-100 group-active:scale-95 transition-transform">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12.16 23.36c7.04 0 11.84-4.8 11.84-11.2s-4.8-11.2-11.84-11.2-11.84 4.8-11.84 11.2 4.48 10.88 11.2 11.2c.64 0 1.28-.16 1.92-.32 0 0 .32 1.12.32 1.28 0 .48.16.8.64.64s2.4-1.44 3.52-2.56c.16-.16.32-.32.48-.32.96-.32 2.24-.96 3.04-1.76.16 0 .32 0 .48 0zM5.92 13.92c-.32 0-.64-.32-.64-.64V9.6c0-.32.32-.64.64-.64s.64.32.64.64v3.04h2.56c.32 0 .64.32.64.64s-.32.64-.64.64H5.92zm4.32-.64c0 .32-.32.64-.64.64s-.64-.32-.64-.64V9.6c0-.32.32-.64.64-.64s.64.32.64.64v3.68zm2.24 0c0 .32-.32.64-.64.64s-.64-.32-.64-.64V9.6c0-.32.32-.64.64-.64s.64.32.64.64v.32l2.4 2.88V9.6c0-.32.32-.64.64-.64s.64.32.64.64v3.68c0 .32-.32.64-.64.64s-.48-.16-.64-.32l-2.4-3.04v2.72zm5.92 0c0 .32-.32.64-.64.64H15.2c-.32 0-.64-.32-.64-.64V9.6c0-.32.32-.64.64-.64s.64.32.64.64v.96h2.24c.32 0 .64.32.64.64s-.32.64-.64.64H15.84v.96h2.56c.32 0 .64.32.64.64z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">LINE</span>
                </button>
            </div>
        </div>

        {/* Footer Action */}
        <div className="bg-slate-50 p-4 flex justify-center border-t border-slate-100">
            <button 
                onClick={onClose}
                className="text-slate-500 hover:text-slate-800 font-bold text-sm px-6 py-2 rounded-full hover:bg-slate-200 transition-colors"
            >
                閉じる・ホームへ戻る
            </button>
        </div>
      </div>
    </div>
  );
};