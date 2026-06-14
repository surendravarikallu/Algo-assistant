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

  sendTransaction(txn: MockTransaction): string {
    const senderBal = this.balances[txn.sender] || 0;
    if (senderBal < txn.amount + txn.fee) {
      throw new Error('Insufficient simulated balance');
    }
    this.balances[txn.sender] = senderBal - txn.amount - txn.fee;
    this.balances[txn.receiver] = (this.balances[txn.receiver] || 0) + txn.amount;
    this.blockHeight++;
    return 'SIM_' + Math.random().toString(36).substr(2, 9);
  }
}
