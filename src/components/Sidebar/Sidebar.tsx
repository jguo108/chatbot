'use client'

import React, { useState } from 'react'
import { Plus, MessageSquare, Trash2, Edit3, Check, X, Search, Settings } from 'lucide-react'
import { Chat } from '@/types'

interface SidebarProps {
    chats: Chat[]
    currentChatId: string | null
    onSelectChat: (id: string) => void
    onNewChat: () => void
    onDeleteChat: (id: string) => void
    onRenameChat: (id: string, newTitle: string) => void
}

export default function Sidebar({
    chats,
    currentChatId,
    onSelectChat,
    onNewChat,
    onDeleteChat,
    onRenameChat
}: SidebarProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')

    const handleStartEdit = (chat: Chat) => {
        setEditingId(chat.id)
        setEditTitle(chat.title)
    }

    const handleSaveEdit = (id: string) => {
        if (editTitle.trim()) {
            onRenameChat(id, editTitle.trim())
        }
        setEditingId(null)
    }

    return (
        <aside className="w-96 h-screen flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--border-color)]">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <button className="p-2 hover:bg-[var(--sidebar-hover)] rounded-lg transition-colors">
                    <Settings size={20} className="text-gray-400" />
                </button>
                <button className="p-2 hover:bg-[var(--sidebar-hover)] rounded-lg transition-colors">
                    <Search size={20} className="text-gray-400" />
                </button>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-3 p-3 bg-transparent border border-[var(--border-color)] hover:bg-[var(--sidebar-hover)] rounded-xl transition-all group"
                >
                    <Plus size={20} className="text-gray-300 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">New chat</span>
                </button>
            </div>

            {/* Chat History List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Recent Chats
                </div>
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${currentChatId === chat.id ? 'bg-[var(--sidebar-hover)] shadow-sm' : 'hover:bg-[var(--sidebar-hover)]'
                            }`}
                        onClick={() => onSelectChat(chat.id)}
                    >
                        <MessageSquare size={18} className={`${currentChatId === chat.id ? 'text-blue-400' : 'text-gray-400'}`} />

                        <div className="flex-1 truncate">
                            {editingId === chat.id ? (
                                <input
                                    autoFocus
                                    className="w-full bg-transparent outline-none text-sm border-b border-blue-500"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit(chat.id)
                                        if (e.key === 'Escape') setEditingId(null)
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="text-sm text-gray-200">{chat.title}</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className={`flex items-center gap-1 ${editingId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                            {editingId === chat.id ? (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSaveEdit(chat.id); }}
                                        className="p-1 hover:text-green-400"
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                                        className="p-1 hover:text-red-400"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleStartEdit(chat); }}
                                        className="p-1 text-gray-400 hover:text-white"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                                        className="p-1 text-gray-400 hover:text-red-400"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / User Pro */}
            <div className="p-4 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                        U
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium truncate">User Name</p>
                        <p className="text-xs text-gray-500">Settings and help</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
