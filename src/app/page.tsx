'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import ChatWindow from '@/components/Chat/ChatWindow'
import { Chat, Message } from '@/types'
import {
  fetchChats,
  createChat,
  deleteChat as dbDeleteChat,
  renameChat as dbRenameChat,
  fetchMessages,
  saveMessage
} from './actions-db'
import { generateChatResponse } from './actions-chat'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000' // Placeholder until Auth is set up

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  // Initial Load
  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const data = await fetchChats(DEMO_USER_ID)
      setChats(data)
    } catch (err) {
      console.error('Failed to load chats:', err)
    }
  }

  const loadMessages = async (chatId: string) => {
    try {
      const data = await fetchMessages(chatId)
      setMessages(data)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id)
    loadMessages(id)
  }

  const handleNewChat = () => {
    setCurrentChatId(null)
    setMessages([])
  }

  const handleSendMessage = async (content: string) => {
    let chatId = currentChatId

    try {
      // 1. Create chat if it's the first message
      if (!chatId) {
        const newChat = await createChat(DEMO_USER_ID, content.substring(0, 30) + '...')
        chatId = newChat.id
        setCurrentChatId(chatId)
        setChats(prev => [newChat, ...prev])
      }

      // 2. Save user message
      if (!chatId) throw new Error("Failed to initialize chat");
      const userMsg = await saveMessage(chatId, 'user', content)
      setMessages(prev => [...prev, userMsg])

      // 3. Get AI response
      setIsTyping(true)
      const aiContent = await generateChatResponse([...messages, userMsg])

      // 4. Save AI message
      const aiMsg = await saveMessage(chatId, 'assistant', aiContent)
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error('Chat error:', err)
    } finally {
      setIsTyping(false)
    }
  }

  const handleDeleteChat = async (id: string) => {
    if (confirm('Delete this chat?')) {
      try {
        await dbDeleteChat(id)
        if (currentChatId === id) handleNewChat()
        setChats(prev => prev.filter(c => c.id !== id))
      } catch (err) {
        console.error('Failed to delete chat:', err)
      }
    }
  }

  const handleRenameChat = async (id: string, newTitle: string) => {
    try {
      await dbRenameChat(id, newTitle)
      setChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c))
    } catch (err) {
      console.error('Failed to rename chat:', err)
    }
  }

  return (
    <div className="flex bg-[var(--background)] h-screen">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
      />
    </div>
  )
}
