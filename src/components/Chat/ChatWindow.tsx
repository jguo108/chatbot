'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Sparkles, Mic, ChevronDown, Plus } from 'lucide-react'
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
        <main className="flex-1 h-screen flex flex-col items-center relative overflow-hidden bg-[var(--background)]">
            {/* Header - Empty as per request */}
            <header className="w-full p-4 flex justify-between items-center z-10 h-16">
            </header>

            {/* Messages / Welcome */}
            <div className="flex-1 w-full max-w-3xl overflow-y-auto px-4 py-8 space-y-8 scroll-smooth no-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-blue-400 animate-pulse-subtle" size={32} />
                            <h1 className="text-4xl font-medium tracking-tight text-white">Hi User</h1>
                        </div>
                        <h2 className="text-5xl font-semibold leading-tight max-w-lg text-white">What can we get done?</h2>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-white/5'
                                        }`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Sparkles className="text-blue-400" size={24} />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-indigo-600/20 border border-indigo-500/30 text-white shadow-lg shadow-indigo-500/10'
                                            : 'bg-[var(--sidebar-bg)] border border-[var(--border-color)] text-gray-200 shadow-sm'
                                            }`}>
                                            <div className="text-base leading-relaxed whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="flex gap-4 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/5">
                                        <Sparkles className="text-blue-400 animate-pulse-subtle" size={24} />
                                    </div>
                                    <div className="bg-[var(--sidebar-bg)] border border-[var(--border-color)] p-4 rounded-2xl">
                                        <div className="flex items-center gap-1.5 py-1">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-40" />
                    </>
                )}
            </div>

            {/* Input Area - Positioned ~1/3 above bottom */}
            <div className="w-full max-w-3xl px-4 absolute bottom-[33%] left-1/2 -translate-x-1/2 z-20">
                <div className="relative group">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-end gap-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-3xl p-2 px-4 focus-within:border-white/30 transition-all shadow-2xl backdrop-blur-xl"
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
                            className="flex-1 bg-transparent py-3 px-2 outline-none resize-none text-base text-white placeholder:text-gray-500 max-h-60"
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
