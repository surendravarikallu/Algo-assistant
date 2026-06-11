export interface MockTransaction {
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
}

export class MockAlgorandProvider {
  private blockHeight = 1000;
  private balances: Record<string, number> = {};

  setBalance(address: string, amount: number) {
    this.balances[address] = amount;
  }
}
