import { BigNumber } from 'ethers';
import { ContractWrapper } from './ContractWrapper';

export class VaultSLP extends ContractWrapper {
  async deposit(
    amount: BigNumber,
  ) {
    return await this.contract.safeCall.deposit(
      amount
    );
  }

  async getUserDeposited() {
    return await this.contract.balanceInFarm();
  }
  
  async getPendingReward() {
    return await this.contract.safeCall.pending();
  }

  async withdraw(
    amount: BigNumber,
  ) {
    return await this.contract.safeCall.withdraw(
      amount
    );
  }

  async withdrawAll(
  ) {
    return await this.contract.safeCall.withdrawAll(
    );
  }

  async claimRewards(
  ) {
    return await this.contract.safeCall.claimRewards();
  }
  
  async compound(
    ) {
      return await this.contract.safeCall.compound();
    }
}
