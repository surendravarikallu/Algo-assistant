import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Copy, Check, Code2 } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { ContractGenerator } from '../services/contractGenerator';
import { HelpService } from '../services/helpService';
import logo from '../assets/images/logo.svg';
import styles from './Chat.module.css';

// Register languages with error handling
try {
  SyntaxHighlighter.registerLanguage('typescript', typescript);
  SyntaxHighlighter.registerLanguage('python', python);
} catch (error) {
  console.error('Error registering syntax highlighter languages:', error);
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  code?: {
    typescript: string;
    python: string;
  };
  activeLanguage?: 'typescript' | 'python';
}

interface ChatProps {
  onMessagesUpdate: (messages: any[]) => void;
  initialMessages: any[];
  children?: React.ReactNode;
}

export function Chat({ onMessagesUpdate, initialMessages }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingCode, setStreamingCode] = useState<{ typescript: string; python: string }>({ typescript: '', python: '' });
  const [streamingHelp, setStreamingHelp] = useState('');
  const [isStreamingHelp, setIsStreamingHelp] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contractGenerator = new ContractGenerator();
  const helpService = new HelpService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingCode, streamingHelp]);

  // Update parent component when messages change
  useEffect(() => {
    if (messages !== initialMessages) {
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate, initialMessages]);

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const isHelpRequest = (input: string): boolean => {
    const helpKeywords = ['help', 'setup', 'guide', 'how to', 'explain', 'show me', 'tell me'];
    return helpKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
  };

  const isContractRequest = (input: string): boolean => {
    const contractKeywords = ['create', 'generate', 'make', 'build', 'token', 'asa', 'nft', 'contract'];
    return contractKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
  };

  const streamHelpResponse = async (prompt: string): Promise<string> => {
    try {
      setIsStreamingHelp(true);
      let fullResponse = '';
      
      for await (const chunk of helpService.generateHelpResponse(prompt)) {
        fullResponse += chunk;
        setStreamingHelp(fullResponse);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      setIsStreamingHelp(false);
      return fullResponse;
    } catch (error) {
      console.error('Error streaming help response:', error);
      setIsStreamingHelp(false);
      setError('Failed to generate help response. Please try again.');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setError(null);
    setStreamingCode({ typescript: '', python: '' });
    setStreamingHelp('');
    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (isHelpRequest(input)) {
        // Handle help request with HelpService
        const assistantMessage: Message = {
          role: 'assistant',
          content: '',
        };
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        
        const finalResponse = await streamHelpResponse(input);
        
        setMessages(prev => {
          const finalMessages = [...prev];
          finalMessages[finalMessages.length - 1].content = finalResponse;
          return finalMessages;
        });
      } else if (isContractRequest(input)) {
        // Handle contract generation
        const assistantMessage: Message = {
          role: 'assistant',
          content: 'Here\'s the generated smart contract code:',
          code: { typescript: '', python: '' },
          activeLanguage: 'typescript'
        };
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);

        let fullCode = { typescript: '', python: '' };
        for await (const chunk of contractGenerator.generateContractStream(input)) {
          fullCode.typescript += chunk.typescript;
          fullCode.python += chunk.python;
          setStreamingCode({
            typescript: fullCode.typescript,
            python: fullCode.python
          });
          await new Promise(resolve => setTimeout(resolve, 30));
        }

        setMessages(prev => {
          const finalMessages = [...prev];
          finalMessages[finalMessages.length - 1].code = fullCode;
          return finalMessages;
        });
        setStreamingCode({ typescript: '', python: '' });
      } else {
        // Handle invalid requests with typing animation
        const response = 'I\'m not sure what you\'re asking for. Please try:\n- Asking for help with a specific topic\n- Describing the contract you want to create\n- Using keywords like "create", "generate", "help", or "explain"';
        const assistantMessage: Message = {
          role: 'assistant',
          content: '',
        };
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);

        // Animate the response
        let currentResponse = '';
        for (const char of response) {
          currentResponse += char;
          setMessages(prev => {
            const finalMessages = [...prev];
            finalMessages[finalMessages.length - 1].content = currentResponse;
            return finalMessages;
          });
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
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

  const renderCodeBlock = (content: string, index: number) => {
    const codeMatch = content.match(/```(?:typescript|python)?\n([\s\S]*?)```/);
    if (!codeMatch) return content;

    const code = codeMatch[1].trim();
    const language = messages[index]?.activeLanguage || 'typescript';

    return (
      <div className="relative group">
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleLanguage(index)}
            className="px-2 py-1 text-xs font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Switch to {language === 'typescript' ? 'Python' : 'TypeScript'}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="px-2 py-1 text-xs font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={docco}
          customStyle={{
            margin: 0,
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: '#000000',
            border: '1px solid #1f2937',
            color: '#e5e7eb',
          }}
          showLineNumbers={false}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black">
              <img src={logo} alt="Logo" className={`w-16 h-16 ${styles.algorandLogo}`} />
            </div>
            <h1 className="text-4xl font-semibold text-gray-100 mb-8">What can I help with?</h1>
            <div className="grid grid-cols-2 gap-4 max-w-4xl px-4">
              <div 
                onClick={() => handleExampleClick("Create an ASA token called MyToken with 1M supply")}
                className="p-4 bg-gray-700/50 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <h2 className="text-lg font-medium text-gray-200 mb-2">Create a Token</h2>
                <p className="text-gray-400">"Create an ASA token called MyToken with 1M supply"</p>
              </div>
              <div 
                onClick={() => handleExampleClick("Create an NFT contract for my digital art collection")}
                className="p-4 bg-gray-700/50 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <h2 className="text-lg font-medium text-gray-200 mb-2">Generate NFT</h2>
                <p className="text-gray-400">"Create an NFT contract for my digital art collection"</p>
              </div>
              <div 
                onClick={() => handleExampleClick("Generate a smart contract for a decentralized voting system")}
                className="p-4 bg-gray-700/50 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <h2 className="text-lg font-medium text-gray-200 mb-2">Smart Contract</h2>
                <p className="text-gray-400">"Generate a smart contract for a decentralized voting system"</p>
              </div>
              <div 
                onClick={() => handleExampleClick("Help me understand how Algorand smart contracts work")}
                className="p-4 bg-gray-700/50 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <h2 className="text-lg font-medium text-gray-200 mb-2">Get Help</h2>
                <p className="text-gray-400">"Help me understand how Algorand smart contracts work"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-32 pt-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`group w-full text-gray-100 border-b border-gray-800 ${
                  message.role === 'assistant' ? 'bg-gray-800' : 'bg-gray-900'
                }`}
              >
                <div className="flex gap-4 p-6 text-base max-w-3xl mx-auto">
                  <div className="flex-shrink-0 w-8 h-8">
                    {message.role === 'user' ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
                        <img src={logo} alt="Logo" className={`w-5 h-5 ${styles.algorandLogo}`} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="whitespace-pre-wrap">
                      {index === messages.length - 1 && isStreamingHelp ? streamingHelp : renderCodeBlock(message.content, index)}
                    </p>
                    {(message.code || (index === messages.length - 1 && (streamingCode.typescript || streamingCode.python))) && (
                      <div className="relative mt-4 rounded-lg overflow-hidden bg-black border border-gray-800">
                        <div className="absolute right-4 top-4 flex gap-2 z-10">
                          <div className="px-2 py-1 text-xs font-medium text-gray-200 bg-gray-700 rounded-md">
                            {message.activeLanguage === 'python' ? 'Python' : 'TypeScript'}
                          </div>
                          <button
                            onClick={() => toggleLanguage(index)}
                            className="p-2 rounded bg-gray-900 hover:bg-gray-800 transition-colors text-gray-200 hover:text-white"
                            title="Switch language"
                          >
                            <Code2 size={16} />
                          </button>
                          <button
                            onClick={() => copyToClipboard(
                              message.code?.[message.activeLanguage || 'typescript'] || 
                              streamingCode[message.activeLanguage || 'typescript'],
                              index
                            )}
                            className="p-2 rounded bg-gray-900 hover:bg-gray-800 transition-colors text-gray-200 hover:text-white"
                            title="Copy code"
                          >
                            {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <div className="p-4">
                          <SyntaxHighlighter
                            language={message.activeLanguage || 'typescript'}
                            style={docco}
                            customStyle={{
                              margin: 0,
                              padding: '1rem',
                              borderRadius: '0.5rem',
                              backgroundColor: '#000000',
                              border: '1px solid #1f2937',
                              color: '#e5e7eb',
                            }}
                            showLineNumbers={false}
                            wrapLines={true}
                          >
                            {message.code?.[message.activeLanguage || 'typescript'] || 
                             streamingCode[message.activeLanguage || 'typescript']}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && !streamingCode && !isStreamingHelp && (
              <div className="w-full border-b border-gray-800 bg-gray-800">
                <div className="flex gap-4 p-6 text-base max-w-3xl mx-auto">
                  <div className="flex-shrink-0 w-8 h-8">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                      <Loader2 size={16} className="animate-spin text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full border-t border-gray-800 bg-gray-800 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              id="chat-input"
              name="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Algorand Assistant..."
              className="w-full p-4 pr-12 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="px-2 pt-2 text-xs text-gray-400 text-center">
            Algorand Assistant can make mistakes. Consider checking important information.
          </div>
        </form>
      </div>

      {error && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded text-red-400">
          {error}
        </div>
      )}
    </div>
  );
} 