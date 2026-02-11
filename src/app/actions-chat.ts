'use server'

import { model } from '@/lib/gemini'

export async function generateChatResponse(messages: { role: string; content: string }[]) {
    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
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
        } catch (error: unknown) {
            attempt++
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error(`Gemini API Attempt ${attempt} failed: ${errorMessage}`)

            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000 // Exponential backoff: 2s, 4s
                await new Promise(resolve => setTimeout(resolve, delay))
            } else {
                console.error('Gemini API Error after final attempt:', error)
                return `Error: ${errorMessage || 'I encountered an error while processing your request. Please check your API key and try again.'}`
            }
        }
    }
    return 'Error: Unknown error occurred. Please try again.'
}
