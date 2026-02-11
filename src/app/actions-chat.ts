'use server'

import { model } from '@/lib/gemini'

export async function generateChatResponse(messages: { role: string; content: string }[]) {
    try {
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }))

        const chat = model.startChat({
            history,
        })

        const result = await chat.sendMessage(messages[messages.length - 1].content)
        const response = await result.response
        return response.text()
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        return `Error: ${error.message || 'I encountered an error while processing your request. Please check your API key and try again.'}`
    }
}
