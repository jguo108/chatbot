'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Sparkles, Mic, Paperclip, ChevronDown, Plus } from 'lucide-react'
import { Message } from '@/types'

interface ChatWindowProps {
    messages: Message[]
    onSendMessage: (content: string) => void
    isTyping: boolean
}

export default function ChatWindow({ messages, onSendMessage, isTyping }: ChatWindowProps) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (input.trim() && !isTyping) {
            onSendMessage(input.trim())
            setInput('')
        }
    }

    return (
        <main className="flex-1 h-screen flex flex-col items-center relative overflow-hidden">
            {/* Header */}
            <header className="w-full p-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold tracking-tight">Gemini</span>
                    <div className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase tracking-wider">Pro</div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <div className="w-full h-full bg-gradient-to-tr from-orange-400 to-rose-400" />
                </div>
            </header>

            {/* Messages / Welcome */}
            <div className="flex-1 w-full max-w-3xl overflow-y-auto px-4 py-8 space-y-8 scroll-smooth no-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-blue-400 animate-pulse-subtle" size={32} />
                            <h1 className="text-4xl font-medium tracking-tight">Hi User</h1>
                        </div>
                        <h2 className="text-5xl font-semibold leading-tight max-w-lg">What can we get done?</h2>

                        <div className="grid grid-cols-2 gap-3 mt-8 w-full">
                            {['Create image', 'Help me learn', 'Write anything', 'Boost my day'].map((text) => (
                                <button
                                    key={text}
                                    onClick={() => setInput(text)}
                                    className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-2xl hover:bg-[var(--sidebar-hover)] transition-all text-sm font-medium"
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div key={msg.id} className="flex gap-4 animate-fade-in">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-transparent'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Sparkles className="text-blue-400" size={24} />}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                        {msg.role === 'user' ? 'You' : 'Gemini'}
                                    </p>
                                    <div className="text-base leading-relaxed text-gray-200 whitespace-pre-wrap">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-4 animate-fade-in">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                    <Sparkles className="text-blue-400 animate-pulse-subtle" size={24} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Gemini</p>
                                    <div className="flex items-center gap-1.5 py-4">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-40" />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="w-full max-w-3xl px-4 py-6 bg-gradient-to-t from-[var(--background)] to-transparent absolute bottom-0">
                <div className="relative group">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-end gap-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-3xl p-2 px-4 focus-within:border-white/30 transition-all shadow-2xl"
                    >
                        <button type="button" className="p-2 mb-1 text-gray-400 hover:text-white transition-colors">
                            <Plus size={22} />
                        </button>
                        <button type="button" className="p-2 mb-1 text-gray-400 hover:text-white transition-colors">
                            <Mic size={22} />
                        </button>

                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit()
                                }
                            }}
                            placeholder="Ask Gemini"
                            className="flex-1 bg-transparent py-3 px-2 outline-none resize-none text-base placeholder:text-gray-500 max-h-60"
                        />

                        <div className="flex items-center gap-2 mb-1">
                            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium bg-white/5 rounded-lg px-3">
                                Thinking <ChevronDown size={14} />
                            </button>
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className={`p-2 rounded-xl transition-all ${input.trim() && !isTyping ? 'bg-white text-black scale-100 hover:scale-105 active:scale-95' : 'bg-white/10 text-white/20 scale-90'
                                    }`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-[10px] text-gray-600 mt-2 tracking-wide font-medium">
                        Gemini may display inaccurate info, including about people, so double-check its responses.
                    </p>
                </div>
            </div>
        </main>
    )
}
