import { MockAlgorandProvider } from './mockAlgorandProvider';

describe('Mock Algorand Provider', () => {
  it('should correctly process transactions offline', () => {
    const provider = new MockAlgorandProvider();
    provider.setBalance('A', 100);
    provider.setBalance('B', 10);
    const txId = provider.sendTransaction({ sender: 'A', receiver: 'B', amount: 30, fee: 1 });
    expect(txId).toContain('SIM_');
  });
});
