import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react'
import { chatService } from '../services/chatService'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Muse 🎨 — your Makers Muse assistant. I can help you find art, answer questions about selling, or guide you through the platform. What can I help you with?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(undefined)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await chatService.send(userMsg, sessionId)
      setSessionId(res.sessionId)
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again in a moment! 🎨"
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Chat window */}
      <div className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 transition-all duration-300 ease-out ${
        open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
      }`}>
        <div className="card flex flex-col h-[500px] overflow-hidden border border-primary-500/20">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-primary-900/50 to-canvas-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Muse AI</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto btn-ghost p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-primary-500 to-pink-500'
                    : 'bg-canvas-600 border border-white/10'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot className="w-3.5 h-3.5 text-white" />
                    : <User className="w-3.5 h-3.5 text-white/60" />}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-canvas-700 text-white/90 rounded-tl-sm'
                    : 'bg-primary-500 text-white rounded-tr-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-canvas-700 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <textarea
                id="chat-input"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask Muse anything…"
                className="input flex-1 resize-none text-sm py-2.5 min-h-0"
                style={{ height: '42px' }}
              />
              <button
                id="chat-send-btn"
                onClick={send}
                disabled={loading || !input.trim()}
                className="btn-primary p-2.5 h-[42px] w-[42px] flex items-center justify-center disabled:opacity-40"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-white/20 text-center mt-1.5">Powered by Spring AI + OpenAI</p>
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        id="chat-toggle-btn"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 shadow-xl shadow-primary-500/40 flex items-center justify-center hover:scale-110 transition-all duration-200 animate-glow-pulse"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </>
  )
}
