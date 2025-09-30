interface HelpResponse {
  title: string;
  content: string;
  steps?: string[];
}

export class HelpService {
  private helpResponses: Record<string, HelpResponse> = {
    'setup': {
      title: 'Setting up Algorand Test Environment',
      content: 'Here\'s how to set up your Algorand test environment:',
      steps: [
        '1. Install Node.js and npm',
        '2. Install Algorand SDK: `npm install algosdk`',
        '3. Install AlgoKit: `npm install @algorandfoundation/algokit-utils`',
        '4. Set up your test account using the Algorand TestNet',
        '5. Configure your environment variables in `.env`'
      ]
    },
    'asa': {
      title: 'Creating an ASA (Algorand Standard Asset)',
      content: 'To create an ASA token, use the following format:',
      steps: [
        '1. Say "Create an ASA token called [name]"',
        '2. Specify the total supply (e.g., "with 1 million supply")',
        '3. The system will generate the complete contract code',
        '4. Copy and deploy the code using AlgoKit'
      ]
    },
    'nft': {
      title: 'Creating an NFT',
      content: 'To create an NFT contract, use the following format:',
      steps: [
        '1. Say "Create an NFT contract"',
        '2. The system will generate the NFT contract code',
        '3. Add your metadata (name, description, image URL)',
        '4. Deploy using AlgoKit'
      ]
    },
    'app': {
      title: 'Creating a Smart Contract Application',
      content: 'To create a smart contract application:',
      steps: [
        '1. Say "Create a smart contract application"',
        '2. Specify the contract type and requirements',
        '3. The system will generate the contract code',
        '4. Deploy using AlgoKit'
      ]
    }
  };

  async *generateHelpResponse(prompt: string): AsyncGenerator<string> {
    const lowerPrompt = prompt.toLowerCase();
    let response: HelpResponse;

    if (lowerPrompt.includes('setup') || lowerPrompt.includes('environment')) {
      response = this.helpResponses.setup;
    } else if (lowerPrompt.includes('asa') || lowerPrompt.includes('token')) {
      response = this.helpResponses.asa;
    } else if (lowerPrompt.includes('nft')) {
      response = this.helpResponses.nft;
    } else if (lowerPrompt.includes('app') || lowerPrompt.includes('contract')) {
      response = this.helpResponses.app;
    } else {
      response = {
        title: 'General Help',
        content: 'I can help you with:\n\n' +
          '• Setting up the Algorand test environment\n' +
          '• Creating ASA tokens\n' +
          '• Creating NFT contracts\n' +
          '• Creating smart contract applications\n\n' +
          'Please specify what you need help with!'
      };
    }

    // Yield the response with typing effect
    yield `${response.title}\n\n`;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    yield response.content + '\n\n';
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (response.steps) {
      for (const step of response.steps) {
        yield step + '\n';
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }
} 