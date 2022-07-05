import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { CollectionDetail } from '../../../model/user'
import { Checkbox, message } from 'antd';
import ButtonDefault from 'component/ButtonDefault';
import { imgurl } from 'utils/globalimport';
import { compute } from './utils';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ModalBody, PayButton } from './ModalStyle'
import SignGif from './SignGif';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ContractAddresses } from 'utils/addresses';
import { Erc20 } from 'abi/Erc20';
import { useEthPrice } from 'utils/hook';
import { urls } from 'utils/urls';

interface Iprops {
  collectionItemsDetail: CollectionDetail | undefined
  setIsShowModal: Dispatch<SetStateAction<boolean>>
}

export default function SignModal(props: Iprops) {
  const { provider, account } = useWeb3React()
  const { collectionItemsDetail, setIsShowModal } = props
  const [payEthBtn, setPayEthBtn] = useState<boolean>(false)
  const [payWethBtn, setPayWethBtn] = useState<boolean>(false)
  const [checkbox, setCheckbox] = useState<boolean>()
  const [agreementSign, setAgreementSign] = useState<boolean>(false)
  const [signState, setSignState] = useState<string>('pending')
  const [walletBalance, setWalletBalance] = useState<BigNumber>()
  const [WETHBalance, setWETHBalance] = useState<BigNumber>()
  const [payWith, setPayWith] = useState<string>('')
  const [neoNftUrl, setNeoNftUrl] = useState<string>('')
  const EthPrice = useEthPrice(collectionItemsDetail?.currentBasePrice)
  const FundsAmount = useEthPrice(collectionItemsDetail?.availableBorrow)
  // const agreementPrice = collectionItemsDetail.currentBasePrice.minus(new BigNumber(collectionItemsDetail.availableBorrow.toString()))
  const TotalAmount = useEthPrice(collectionItemsDetail?.totalAmount)
  useEffect(() => {
    getBalance()
    getWETHBalance()
    // eslint-disable-next-line
  }, [account])

  const getBalance = async () => {
    if (!account) {
      message.error('account is undefined')
      return
    }
    const balance = await provider!.getBalance(account)
    setWalletBalance(new BigNumber(balance.toString()))
  }
  const getWETHBalance = async () => {
    if (!account) {
      message.error('account is undefined')
      return
    }
    let signer = provider!.getSigner(account)
    let weth = new Erc20(ContractAddresses.WETH, signer)
    const WETHBalance = await weth.balanceOf(account)
    setWETHBalance(WETHBalance)
  }
  const onCancel = () => {
    setIsShowModal(false)
  }

  const onSign = () => {
    if(!WETHBalance) return
    if(!walletBalance) return
    if (!payEthBtn && !payWethBtn) {
      message.warning("Please select payment method");
      return
    }
    if (!checkbox) {
      message.warning("please agree to NPics's Terms of service");
      return
    }
    let downPayment = compute(collectionItemsDetail)?.agreementPrice
    let accountBalance = walletBalance.plus(WETHBalance)
    if(downPayment && downPayment.gt(accountBalance)) {
      message.error("Insufficient account balance")
      return
    }
    if (payEthBtn && payWethBtn) {
      // pay eth and weth
      setPayWith('all')
    }
    if (payEthBtn && !payWethBtn) {
       // pay eth
       if(downPayment?.gt(walletBalance)) {
        message.error("Insufficient account balance")
        return
       }
       setPayWith('eth')
    }
    if (!payEthBtn && payWethBtn) {
       // pay weth
       if(downPayment?.gt(WETHBalance)) {
        message.error("Insufficient account balance")
        return
       }
       setPayWith('weth')
    }
    setAgreementSign(true)
  }

  const onETHClick = () => {
    setPayEthBtn(!payEthBtn)
  }
  const onWETHClick = () => {
    setPayWethBtn(!payWethBtn)
  }
  const onCheckbox = (e: CheckboxChangeEvent) => {
    setCheckbox(e.target.checked)
  }
  const onBack = () => {
    setSignState('pending')
  }
  const onMetaMask = () => {
    onCancel()
  }


  return (agreementSign ? <SignGif
      collectionItemsDetail={collectionItemsDetail}
      setAgreementSign={setAgreementSign}
      setSignState={setSignState}
      payWith={payWith}
      walletBalance={walletBalance}
      WETHBalance={WETHBalance}
      setNeoNftUrl={setNeoNftUrl}
    /> : <ModalBody>
    <div className='content'>
      <div className='content-top'>
        <span>item</span>
        <span>Subtotal</span>
      </div>
      <div className='content-agreement'>

        <div className='info'>
          <div>
            <img src={collectionItemsDetail?.imageUrl} alt="" />
            <div className='nft-name'>
              <div>{collectionItemsDetail?.collectionName}</div>
              <div>{collectionItemsDetail?.collectionName}#{collectionItemsDetail?.tokenId}</div>
              <div>
                {/* <img src={imgurl.market.icon49} alt="" /> */}
                <span>Listed Price</span>
              </div>
            </div>
          </div>

          <div>
            <div><img src={imgurl.market.Group106} alt="" /></div>
            <div className='priceAmount'>
              <div>{compute(collectionItemsDetail)?.price.div(10 ** 18).toFixed(4, 1)}</div>
              <div>${EthPrice?.dp(0).toFixed()}</div>
            </div>
          </div>
        </div>

        <div className='lump'>
          <div>
            <span>Loan Amount</span>
            <div className='funds-Amount'>
              <img src={imgurl.market.Group106} alt="" />
              <span>{compute(collectionItemsDetail)?.loanFunds.div(10 ** 18).toFixed(4, 1)}</span>
              <span>$ {FundsAmount?.dp(0).toFixed()}</span>
            </div>
          </div>
          <div>
            {/* <span>Funding Fees(2.00%)</span>
            <div>
              <img src={imgurl.market.Group106} alt="" />
              <span>{compute(collectionItemsDetail)?.loanFunds.div(10 ** 18).toFixed(4,1)}</span>
              <span>{compute(collectionItemsDetail)?.loanFunds.toFixed(2).toString()}</span>
            </div> */}
          </div>
        </div>

        <div className='total'>
          <div>Down Payment</div>
          <div>
            <div><img src={imgurl.market.Group397} alt="" /></div>
            <div className='total-price'>
              <div>{compute(collectionItemsDetail)?.agreementPrice.div(10 ** 18).toFixed(4, 1)}</div>
              <div>$ {TotalAmount?.dp(0).toFixed()}</div>
            </div>
          </div>
        </div>

        <div className='pay-with'>Pay With</div>

        {signState === 'success' ?
          <div className='success-content'>
            <div className='success'>
              <div>Hodl Successful！And a {collectionItemsDetail?.collectionSymbol} has been minted as an Obligation NFT now!   </div>
              <div>
                <span>Check Now</span>
                <span onClick={() => {
                  urls.etherscanTxDetail(neoNftUrl)
                }}>NO：{neoNftUrl}</span>
              </div>
            </div>

            <ButtonDefault onClick={onMetaMask} types={"four"} minWidth="2.2rem" height=".46rem" fontSize='.16rem'>
              Add to MetaMask
            </ButtonDefault>

          </div>
          : signState === 'failure' ?
            <div className='failure'>Contract execution failed, maybe something went wrong.</div>
            : <div className='pay-button'>
              <PayButton onClick={onETHClick} active={payEthBtn}>
                {payEthBtn ? <img src={imgurl.market.checked} alt="" /> : null}
                <div>
                  <div>ETH</div>
                  <div>
                    <img src={ !payEthBtn ? imgurl.ETH36 : imgurl.market.blackPrice} alt="" />
                    <span>{walletBalance && new BigNumber(walletBalance.toString()).div(10 ** 18).dp(4).toFixed()}</span>
                  </div>
                </div>
              </PayButton>
              <PayButton onClick={onWETHClick} active={payWethBtn}>
                {payWethBtn ? <img src={imgurl.market.checked} alt="" /> : null}
                <div>
                  <div>WETH</div>
                  <div>
                    <img src={!payWethBtn ? imgurl.market.redPrice24 : imgurl.market.blackPrice} alt="" />
                    <span>{WETHBalance && new BigNumber(WETHBalance.toString()).div(10 ** 18).dp(4).toFixed()}</span>
                  </div>
                </div>
              </PayButton>
            </div>}
      </div>
    </div>

    {signState === 'pending' ? <div className='confirm'>
      <Checkbox onChange={onCheckbox} checked={checkbox}><span className='checkText'>checking this box,I agree to NPics's <span ><a href={urls.resource} target="_blank" rel="noreferrer">Terms of service</a></span></span></Checkbox>
    </div> : null}

    <div className='footer'>
      {signState === 'failure' ?
        <ButtonDefault onClick={onBack} types={"two"} minWidth="2rem" height=".52rem" fontSize='.2rem'>
          Back
        </ButtonDefault>
        : signState === 'success' ?
          <div>Konw more about N-NFT?</div>
          : <div className='footerBtn'>
            <div>
              <ButtonDefault onClick={onCancel} types={"two"} minWidth="2rem" height=".52rem" fontSize='.2rem'>Cancel</ButtonDefault>
            </div>
            <div>
              <ButtonDefault onClick={onSign} types={"three"} minWidth="2rem" height=".52rem" fontSize='.2rem'>Checkout</ButtonDefault>
            </div>
          </div>}
    </div>
  </ModalBody>)
}