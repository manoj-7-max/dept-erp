"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import { chatService } from '@/services/chatService';
import { 
    Send, Search, User, MessageSquare, Plus, 
    MoreVertical, Phone, Video, ArrowLeft,
    Check, CheckCheck, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingConv, setIsLoadingConv] = useState(true);
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation._id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_message', (message: any) => {
            if (selectedConversation && message.conversationId === selectedConversation._id) {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            }
            // Update conversation list last message
            loadConversations();
        });

        return () => {
            socket.off('new_message');
        };
    }, [socket, selectedConversation]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const loadConversations = async () => {
        try {
            const res = await chatService.getConversations();
            setConversations(res.data);
            setIsLoadingConv(false);
        } catch (error) {
            console.error('Failed to load conversations', error);
            setIsLoadingConv(false);
        }
    };

    const loadMessages = async (convId: string) => {
        setIsLoadingMsgs(true);
        try {
            const res = await chatService.getMessages(convId);
            setMessages(res.data);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setIsLoadingMsgs(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || (!selectedConversation && !isSearching)) return;

        try {
            const data: any = { content: newMessage };
            if (selectedConversation) {
                data.conversationId = selectedConversation._id;
            } else if (isSearching && searchResults.length > 0) {
                // This would be handled differently if starting from a searched user
                return;
            }

            const res = await chatService.sendMessage(data);
            setNewMessage('');
            // Socket will handle adding the message to the list via 'new_message' event
            // but we can also add it immediately for better UX
            setMessages((prev) => [...prev, res.data]);
            scrollToBottom();
            loadConversations();
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleUserSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await chatService.searchUsers(query);
            setSearchResults(res.data);
        } catch (error) {
            console.error('Search failed', error);
        }
    };

    const startNewConversation = async (recipient: any) => {
        try {
            // Find existing conversation with this user
            const existing = conversations.find(c => 
                c.participants.some((p: any) => p._id === recipient._id)
            );

            if (existing) {
                setSelectedConversation(existing);
            } else {
                // Simulate starting by setting target recipient
                // In a real app, you might want to create the conversation only on first message
                // For now, let's just create a dummy "selected" state
                setSelectedConversation({
                    _id: null,
                    participants: [user, recipient],
                    isTemp: true,
                    recipient: recipient
                });
                setMessages([]);
            }
            setIsSearching(false);
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error('Failed to start conversation', error);
        }
    };

    const getRecipient = (conv: any) => {
        if (conv.isTemp) return conv.recipient;
        const currentUserId = user?.id || (user as any)?._id;
        return conv.participants.find((p: any) => p._id !== currentUserId);
    };

    return (
        <div className="flex h-[calc(100vh-160px)] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Sidebar: Conversation List */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-slate-50">
                    <h2 className="text-xl font-black text-slate-800 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search people..." 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => handleUserSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {searchQuery.length >= 2 ? (
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">People</p>
                            {searchResults.map((u) => (
                                <button 
                                    key={u._id}
                                    onClick={() => startNewConversation(u)}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-blue-50 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{u.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{u.role} • {u.department}</p>
                                    </div>
                                </button>
                            ))}
                            {searchResults.length === 0 && <p className="text-center py-4 text-sm text-slate-400 font-medium">No results found</p>}
                        </div>
                    ) : (
                        <>
                            {isLoadingConv ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-blue-500" />
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const recipient = getRecipient(conv);
                                    const isActive = selectedConversation?._id === conv._id;
                                    return (
                                        <button 
                                            key={conv._id}
                                            onClick={() => setSelectedConversation(conv)}
                                            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left relative group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {recipient?.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <p className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>{recipient?.name}</p>
                                                    <span className={`text-[10px] font-bold ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                                                        {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                                    </span>
                                                </div>
                                                <p className={`text-xs truncate ${isActive ? 'text-blue-50' : 'text-slate-500 font-medium'}`}>
                                                    {conv.lastMessage?.content || 'Started a conversation'}
                                                </p>
                                            </div>
                                            {conv.unread && !isActive && (
                                                <div className="w-2 h-2 rounded-full bg-blue-500 absolute right-4 top-1/2 -translate-y-1/2 shadow-sm"></div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                            {conversations.length === 0 && !isLoadingConv && (
                                <div className="text-center py-10 px-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="text-slate-800 font-bold mb-1">No messages yet</h3>
                                    <p className="text-xs text-slate-400 font-medium">Search for colleagues or students to start chatting.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Chat Content */}
            <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedConversation(null)} className="md:hidden text-slate-400 hover:text-slate-600">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                                    {getRecipient(selectedConversation)?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{getRecipient(selectedConversation)?.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><Phone size={18} /></button>
                                <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><Video size={18} /></button>
                                <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isLoadingMsgs ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-blue-500" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-center py-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Today</span>
                                    </div>
                                    {messages.map((msg, idx) => {
                                        const currentUserId = user?.id || (user as any)?._id;
                                        const isMine = (msg.sender._id || msg.sender) === currentUserId;
                                        return (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={msg._id || idx}
                                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] ${isMine ? 'order-1' : 'order-2'}`}>
                                                    <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium ${isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                                                        {msg.content}
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 mt-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                        {isMine && <CheckCheck size={12} className="text-blue-500" />}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-slate-100">
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <button type="button" className="p-3 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all">
                                    <Plus size={20} />
                                </button>
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    className="flex-1 bg-slate-50 border-none rounded-2xl px-6 font-medium text-sm focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 animate-bounce duration-[2000ms]">
                            <MessageSquare size={48} className="text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Your Conversations</h2>
                        <p className="max-w-md text-slate-400 font-medium">Select a conversation from the sidebar to start chatting, or search for a student or faculty member to start a new chat.</p>
                        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs mb-2 mx-auto">S</div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Help</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs mb-2 mx-auto">F</div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faculty Collab</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
