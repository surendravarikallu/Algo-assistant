import { Chat } from './components/Chat';
import logo from './assets/images/logo.svg';
import styles from './components/Chat.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ChatHistory {
  id: number;
  title: string;
  messages: any[];
}

// Constants for localStorage keys
const STORAGE_KEYS = {
  CHAT_HISTORY: 'algorand_chat_history',
  ACTIVE_CHAT: 'algorand_active_chat'
};

function App() {
  const [chatKey, setChatKey] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(() => {
    // Initialize chat history from localStorage
    const savedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [activeChatId, setActiveChatId] = useState<number | null>(() => {
    // Initialize active chat from localStorage
    const savedActiveChat = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT);
    return savedActiveChat ? JSON.parse(savedActiveChat) : null;
  });

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save active chat ID to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT, JSON.stringify(activeChatId));
  }, [activeChatId]);

  const handleNewChat = () => {
    const newChatId = Date.now();
    setChatHistory(prev => [...prev, { id: newChatId, title: 'New Chat', messages: [] }]);
    setActiveChatId(newChatId);
    setChatKey(prev => prev + 1);
  };

  const updateChatHistory = useCallback((messages: any[]) => {
    if (!activeChatId) return;
    
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        const firstUserMessage = messages.find(m => m.role === 'user')?.content;
        return {
          ...chat,
          title: firstUserMessage ? firstUserMessage.slice(0, 30) + '...' : 'New Chat',
          messages
        };
      }
      return chat;
    }));
  }, [activeChatId]);

  const switchToChat = (chatId: number) => {
    setActiveChatId(chatId);
    setChatKey(prev => prev + 1);
  };

  const deleteChat = (chatId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setChatToDelete(chatId);
    setShowDeleteConfirm(true);
  };

  const [messages, setMessages] = useState<any[]>([]);
  const initialMessagesRef = useRef<any[]>([]);

  useEffect(() => {
    if (messages !== initialMessagesRef.current) {
      updateChatHistory(messages);
    }
  }, [messages, updateChatHistory]);

  useEffect(() => {
    initialMessagesRef.current = messages;
  }, []);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);

  const confirmDelete = () => {
    if (chatToDelete !== null) {
      setChatHistory(prev => prev.filter(chat => chat.id !== chatToDelete));
      if (activeChatId === chatToDelete) {
        const remainingChats = chatHistory.filter(chat => chat.id !== chatToDelete);
        setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
        setChatKey(prev => prev + 1);
      }
      setShowDeleteConfirm(false);
      setChatToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setChatToDelete(null);
  };

  const toggleLanguage = (index: number) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const message = newMessages[index];
      if (message.code) {
        message.activeLanguage = message.activeLanguage === 'typescript' ? 'python' : 'typescript';
      }
      return newMessages;
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 rounded-md border border-white/20 p-3 text-white hover:bg-gray-700 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 4L12 20M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New chat
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs text-gray-500">Chat History</div>
          {chatHistory.map((chat) => (
                  <button
              key={chat.id}
              onClick={() => switchToChat(chat.id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors truncate flex justify-between items-center group ${
                activeChatId === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <span className="flex-1 truncate">{chat.title}</span>
              <span 
                onClick={(e) => deleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200 px-2"
              >
                ×
              </span>
                  </button>
                ))}
            </div>

        {/* User Section */}
        <div className="border-t border-white/20 p-4">
          <button className="w-full flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-gray-700 transition-colors">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
              <img src={logo} alt="Logo" className={`w-5 h-5 text-white ${styles.algorandLogo}`} />
            </div>
            <div className="flex-1 text-left">Algorand Assistant</div>
          </button>
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-800">
        <div className="flex-1 overflow-y-auto">
          <Chat 
            key={chatKey} 
            onMessagesUpdate={setMessages}
            initialMessages={chatHistory.find(chat => chat.id === activeChatId)?.messages || []}
          />
                </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Chat</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;