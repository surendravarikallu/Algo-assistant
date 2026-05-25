import { describe, test, expect, beforeEach } from '@jest/globals';
import { HelpService } from './helpService';

describe('HelpService', () => {
  let helpService: HelpService;

  beforeEach(() => {
    helpService = new HelpService();
  });

  const consumeGenerator = async (generator: AsyncGenerator<string>) => {
    const outputs: string[] = [];
    for await (const chunk of generator) {
      outputs.push(chunk);
    }
    return outputs;
  };

  test('should return setup help when prompt contains setup', async () => {
    const generator = helpService.generateHelpResponse('how to setup');
    const outputs = await consumeGenerator(generator);

    expect(outputs[0]).toContain('Setting up Algorand Test Environment');
    expect(outputs[1]).toContain('Here\'s how to set up your Algorand test environment:');
    expect(outputs.length).toBeGreaterThan(2);
    expect(outputs[2]).toContain('1. Install Node.js and npm');
  });

  test('should return ASA help when prompt contains asa', async () => {
    const generator = helpService.generateHelpResponse('create an asa token');
    const outputs = await consumeGenerator(generator);

    expect(outputs[0]).toContain('Creating an ASA (Algorand Standard Asset)');
    expect(outputs[1]).toContain('To create an ASA token, use the following format:');
    expect(outputs[2]).toContain('1. Say "Create an ASA token called [name]"');
  });

  test('should return NFT help when prompt contains nft', async () => {
    const generator = helpService.generateHelpResponse('make an nft');
    const outputs = await consumeGenerator(generator);

    expect(outputs[0]).toContain('Creating an NFT');
    expect(outputs[1]).toContain('To create an NFT contract, use the following format:');
  });

  test('should return app/contract help when prompt contains contract', async () => {
    const generator = helpService.generateHelpResponse('write a smart contract app');
    const outputs = await consumeGenerator(generator);

    expect(outputs[0]).toContain('Creating a Smart Contract Application');
    expect(outputs[1]).toContain('To create a smart contract application:');
  });

  test('should return general help for other prompts', async () => {
    const generator = helpService.generateHelpResponse('hello assistance');
    const outputs = await consumeGenerator(generator);

    expect(outputs[0]).toContain('General Help');
    expect(outputs[1]).toContain('I can help you with:');
  });
});
