import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
}

// Log the first few characters of the API key to verify it's being loaded
console.log('OpenAI API Key loaded:', apiKey.substring(0, 8) + '...');

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
  fetch: window.fetch,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultQuery: {},
}); 