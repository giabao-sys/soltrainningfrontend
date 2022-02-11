import { Configuration } from './config';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from '@ethersproject/abstract-signer';
import { Overrides } from '@ethersproject/contracts';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { Call, multicall } from './multicall';
import { ConfigurationInfo } from './types';
import { MasterChef } from './MasterChef';
import ERC20 from './ERC20';
import { flatten } from 'src/utils/objects';

/**
 * An API module of Diamond Hand contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class DiamondHand {
  myAccount: string;
  private defaultProvider: JsonRpcProvider;
  private signer?: Signer;
  private config: Configuration;
  private masterChef: MasterChef;
  private SLPs: ERC20[];

  constructor(cfg: Configuration, provider: JsonRpcProvider) {
    const { abis, addresses, farms } = cfg;
    this.config = cfg;
    this.defaultProvider = provider;
    this.masterChef = new MasterChef(abis.MasterChef, addresses.MasterChef, provider);
    const pools = flatten(
      farms.map((t) =>
        t.pools.map((p) => Object.assign(p, { masterChef: t.masterChef })),
      ),
    );
    this.SLPs = [];
    pools.forEach((pool, i) => {
      this.SLPs[i] = new ERC20(pool.partnerPoolAddress, provider, pool.wantSymbol)
    });
  }


  public get provider(): Signer | Provider {
    return this.signer || this.defaultProvider;
  }


  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
   unlockWallet(provider: JsonRpcProvider, account: string) {
    this.signer = provider.getSigner(account);
    this.myAccount = account;
    this.reconnect();
  }

  lock() {
    this.signer = null;
    this.myAccount = null;
    this.reconnect();
  }

  reconnect() {
    this.SLPs.forEach(slp => {
      slp.connect(this.provider);
    });
    this.masterChef.connect(this.provider);
  }

  SLP(index: number)  {
    return this.SLPs[index];
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  get MASTERCHEF() {
    return this.masterChef;
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }
}
