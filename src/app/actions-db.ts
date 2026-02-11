'use server'

import { supabase } from '@/lib/supabase'

export async function fetchChats(userId: string) {
    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function createChat(userId: string, title?: string) {
    const { data, error } = await supabase
        .from('chats')
        .insert([{ user_id: userId, title: title || 'New Chat' }])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteChat(chatId: string) {
    const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)

    if (error) throw error
}

export async function renameChat(chatId: string, newTitle: string) {
    const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId)

    if (error) throw error
}

export async function fetchMessages(chatId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

export async function saveMessage(chatId: string, role: string, content: string) {
    const { data, error } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, role, content }])
        .select()
        .single()

    if (error) throw error
    return data
}
