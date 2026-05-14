import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { sendMessage } from '../services/api'
import type { Message } from '../types'

const SUGGESTED_PROMPTS = [
  { icon: '🔬', text: 'Summarise the latest AI research papers' },
  { icon: '💻', text: 'Write a React hook for debounced search' },
  { icon: '📊', text: 'Analyse this data and create a chart' },
  { icon: '🌐', text: 'What are the top news stories today?' },
]

const ChatWindow = () => {
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isTyping])

  const handleSend = async (prompt?: string) => {
    const finalMessage = prompt || userInput

    if (!finalMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalMessage,
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsTyping(true)

    try {
      const response = await sendMessage(finalMessage)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply || 'No response received',
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Error connecting to backend.',
      }

      setMessages(prev => [...prev, errorMessage])

      console.error(error)
    } finally {
      setIsTyping(false)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex min-h-[60vh] flex-col items-center justify-center text-center"
            >
              {/* Animated brain */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-24 h-24 mx-auto mb-8 flex items-center justify-center glass rounded-full shadow-neon-blue"
              >
                <span className="text-5xl">🧠</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
                Welcome to <span className="neon-text">DualMind</span>
              </h2>

              <p className="text-text-secondary max-w-md mb-12 leading-relaxed">
                Ask anything. I'll plan, verify, and deliver the best answer using dual-agent reasoning.
              </p>

              {/* Suggested prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <motion.button
                    key={p.text}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.15 },
                    }}
                    onClick={() => handleSend(p.text)}
                    className="flex items-center gap-3 glass-panel rounded-xl px-4 py-3.5 text-left hover:border-neon-blue/30 hover:shadow-neon-blue transition-all duration-200 group"
                  >
                    <span className="text-xl flex-shrink-0">
                      {p.icon}
                    </span>

                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-snug">
                      {p.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                  >
                    <MessageBubble message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pt-2"
            >
              <TypingIndicator />
            </motion.div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input Box */}
      <div className="border-t border-white/10 p-4 bg-black/30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask DualMind anything..."
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend()
              }
            }}
          />

          <button
            onClick={() => handleSend()}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow