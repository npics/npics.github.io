export const ContractAddresses = {
  /*
  * Zero Address
  * */
  Zero: "0x0000000000000000000000000000000000000000",
  /*
  * npics contract, @warning npics is proxy contract
  * */
  NpicsProxy: "0xa2f78200746f73662ea8b5b721fda86cb0880f15",
  /*
  * benddao lendpool proxy
  * */
  LendPoolProxy: "0x70b97A0da65C15dfb0FFA02aEE6FA36e507C2762",
  /*
  * erc20 weth contract
  * */
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  DebtTokenProxy: "0x87ddE3A3f4b629E389ce5894c9A1F34A7eeC5648",
  BendDaoProxy: "0x0d02755a5700414B26FF040e1dE35D337DF56218",
  /*
  * x2y2market
  * */
  x2y2Market: "0xF849de01B080aDC3A814FaBE1E2087475cF2E354",
  /**
   * TurBo contracts
   */
  TurboProxy: "0xDE80533ea9F05CE0F6dE7E45f18593A0bAbE3F7B",
  /**
   * TurBo Rinkeby
   */
  TurboTestProxy: "0xfC2f8134f1aAA865e0B0642393Db73c4F7eb41f9",
  /*
  * get contract address by market name
  * @warning: some market contract address is not found, like `xMarket`
  * */
  getMarketAddressByName(name: string): string | undefined {
    let data: { [Key: string]: string | undefined } = {
      "opensea": "0x00000000A50BB64b4BbEcEB18715748DfacE08af",
      "seaport": "0x00000000006c3852cbEf3e08E8dF289169EdE581",
      "x2y2": "0x83C8F28c26bF6aaca652Df1DbBE0e1b56F8baBa2",
      "looksrare": "0x83C8F28c26bF6aaca652Df1DbBE0e1b56F8baBa2",
      "nftx": "0x83C8F28c26bF6aaca652Df1DbBE0e1b56F8baBa2",
      "xMarket": undefined,
    }
    return data[name]
  }
}
