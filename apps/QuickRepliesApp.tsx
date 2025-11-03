import React, { useState, useMemo } from 'react';
import { WhatsAppIcon, SearchIcon } from '../components/icons';
import { QUICK_REPLIES_DATA } from '../constants';

// A simple hook for copy-to-clipboard with feedback
const useCopyToClipboard = (): [boolean, (text: string) => void] => {
    const [isCopied, setIsCopied] = useState(false);

    const copy = async (text: string) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (error) {
            console.warn('Copy failed', error);
            setIsCopied(false);
        }
    };

    return [isCopied, copy];
};

export const QuickRepliesApp: React.FC = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(QUICK_REPLIES_DATA[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCopied, copyToClipboard] = useCopyToClipboard();

    const selectedCategory = QUICK_REPLIES_DATA.find(c => c.id === selectedCategoryId);

    const filteredReplies = useMemo(() => {
        if (!searchTerm) {
            return selectedCategory?.replies || [];
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        // Search across all categories if a search term is present
        return QUICK_REPLIES_DATA.flatMap(category => 
            category.replies.filter(reply => 
                reply.title.toLowerCase().includes(lowercasedFilter) || 
                reply.message.toLowerCase().includes(lowercasedFilter)
            )
        );
    }, [searchTerm, selectedCategory]);
    
    // When searching, clear selected category to avoid confusion
    React.useEffect(() => {
        if (searchTerm) {
            setSelectedCategoryId(null);
        } else if (!selectedCategoryId && QUICK_REPLIES_DATA.length > 0) {
            setSelectedCategoryId(QUICK_REPLIES_DATA[0].id);
        }
    }, [searchTerm, selectedCategoryId]);


    const handleShareWhatsApp = (message: string) => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="w-full h-full flex bg-slate-100 text-slate-800 font-sans">
            {/* Sidebar with Categories */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold">Categories</h2>
                </div>
                <nav className="flex-grow overflow-y-auto">
                    {QUICK_REPLIES_DATA.map(category => (
                        <button
                            key={category.id}
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategoryId(category.id);
                            }}
                            className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${selectedCategoryId === category.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                        >
                            {category.icon('w-5 h-5')}
                            <span className="font-semibold text-sm">{category.title}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content with Replies */}
            <main className="flex-grow flex flex-col">
                <header className="flex-shrink-0 p-4 bg-white border-b border-slate-200">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {SearchIcon("text-gray-400")}
                        </div>
                        <input
                            type="search"
                            placeholder="Search all replies..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                </header>

                <div className="flex-grow p-6 overflow-y-auto">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        {searchTerm ? `Search Results for "${searchTerm}"` : selectedCategory?.title || 'Select a category'}
                    </h3>
                    <div className="space-y-4">
                        {filteredReplies.length > 0 ? filteredReplies.map((reply, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                                <h4 className="font-bold text-base text-slate-900">{reply.title}</h4>
                                <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{reply.message}</p>
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                                    <button
                                        onClick={() => copyToClipboard(reply.message)}
                                        className="px-3 py-1.5 text-sm font-semibold bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition"
                                    >
                                        {isCopied ? 'Copied!' : 'Copy Text'}
                                    </button>
                                    <button
                                        onClick={() => handleShareWhatsApp(reply.message)}
                                        className="px-3 py-1.5 text-sm font-semibold bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center gap-2"
                                    >
                                        {WhatsAppIcon("w-5 h-5")}
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        )) : (
                           <div className="text-center py-10 text-slate-500">
                                <p>No replies found.</p>
                           </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
