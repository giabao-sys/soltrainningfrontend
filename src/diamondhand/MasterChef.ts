import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import fromUnixTime from 'date-fns/fromUnixTime';
import { ContractWrapper } from './ContractWrapper';
import { DiamondHand } from './DiamondHand';
import { multicall } from './multicall';

export class MasterChef extends ContractWrapper {
  constructor(
    abi: any[],
    address: string,
    signer: Signer | Provider,
  ) {
    super(abi, address, signer);
  }

  async deposit(
    poolId: BigNumber,
    amount: BigNumber,
  ) {
    return await this.contract.safeCall.deposit(
      poolId,
      amount
    );
  }

  async withdraw(
    poolId: BigNumber,
    amount: BigNumber,
  ) {
    return await this.contract.safeCall.withdraw(
      poolId,
      amount
    );
  }

  async withdrawAll(
    poolId: BigNumber,
  ) {
    return await this.contract.safeCall.emergencyWithdraw(
      poolId
    );
  }

  async getUserDeposited(poolId: BigNumber, userId: string) {
    return await this.contract.userInfo(poolId, userId);
  }
  
  async getPendingReward(poolId: BigNumber, userId: string) {
    return await this.contract.safeCall.pendingReward(poolId, userId);
  }

}
