import React, {
    Component
} from 'react'
import ReactModal from 'react-modal';

import {
    expectRevert,
    time
} from '@openzeppelin/test-helpers';

import {
    ToastContainer,
    toast
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BigNumber from "bignumber.js";
import {
    BLOCKS_PER_YEAR,
    CAKE_PER_BLOCK
} from "../config";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import SlionToken from '../abis/SlionToken.json';
import MlionToken from '../abis/MlionToken.json';
import MasterChef from '../abis/MasterChef.json';
import MasterChefMegaLion from '../abis/MasterChefMegaLion.json';
import WBNBPool from '../abis/WBNBPool.json';
import Timelock from '../abis/Timelock.json';


import Menu from './Menu'
import Main from './Main'
import Home from './Home'
import Farms from "./Farms";
import Pools from "./Pools";
import Referral from "./Referral";
import Audit from "./Audit";

import ERC20 from '../config/abi/erc20.json'
import lpToken from '../config/abi/lpToken.json'

//import { $ }  from 'react-jquery-plugin'

import './App.css'

import Apy from '../utils/apy'

import {
    HttpProviderOptions
} from "web3-core-helpers";
/*
const networkId = 97
const networkIdHex = '0x61';
const web3Provider = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const bscscanUrlTx = 'https://testnet.bscscan.com/tx/';
*/

const networkId = 56
const networkIdHex = '0x38';
const web3Provider = 'https://bsc-dataseed.binance.org/';
//const web3Provider = 'https://bsc-dataseed1.ninicoin.io/';
//const web3Provider = 'https://bsc-dataseed1.binance.org:443';
//const web3Provider = 'https://bsc-dataseed1.defibit.io';
const bscscanUrlTx = 'https://bscscan.com/tx/';


const MasterChefData = MasterChef.networks[networkId]
const MasterChefMegaLionData = MasterChefMegaLion.networks[networkId]
const WBNBPoolData = WBNBPool.networks[networkId]
const SlionTokenData = SlionToken.networks[networkId]
const MlionTokenData = MlionToken.networks[networkId]
const TimelockData = Timelock.networks[networkId]

const MasterChefAddress = MasterChefData.address;
const MasterChefMegaLionAddress = MasterChefMegaLionData.address;
const WBNBPoolAddress = WBNBPoolData.address;
const SlionTokenAddress = SlionTokenData.address;
const MlionTokenAddress = MlionTokenData.address;
const TimelockAddress = TimelockData.address;

/**/
console.log('MasterChefAddress');
console.log(MasterChefAddress);

console.log('MasterChefMegaLionAddress');
console.log(MasterChefMegaLionAddress);

console.log('WBNBPoolAddress');
console.log(WBNBPoolAddress);

console.log('SlionTokenAddress');
console.log(SlionTokenAddress);

console.log('MlionTokenAddress');
console.log(MlionTokenAddress);

console.log('TimelockAddress');
console.log(TimelockAddress);


const notifyOk = (hash) => {
    let notifyContent = < div >
        All right! < br / >
        <
        a target = "_blank"
    href = {
            bscscanUrlTx + hash
        } > View on Bscscan < /a> <
        /div>;

    toast.success(notifyContent, {
        autoClose: 5000,
    });
}

const notifyNoOk = (hash) => {
    let notifyContent = < div >
        Oooooppsss! < br / >
        <
        a target = "_blank"
    href = {
            bscscanUrlTx + hash
        } > View on Bscscan < /a> <
        /div>;

    toast.error(notifyContent, {
        autoClose: 5000,
    });
}

class App extends Component {

    constructor(props) {

        super(props)

        //this.loadCountdown();
        //this.loadSurvey();

        let url = new URL(window.location.href);
        let ref = url.searchParams.get('ref');

        if (ref) {
            this.setCookie('ref', ref, 999);
        }

        //const provider = Web3.providers.HttpProvider('https://bsc-dataseed.binance.org');

        //const web3 = new Web3(provider);
        const web3 = new Web3();
        //web3.setProvider(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'));
        web3.setProvider(new Web3.providers.HttpProvider(web3Provider));

        window.web3 = web3;

        //const networkId = await web3.eth.net.getId()
        const MasterChefContract = new web3.eth.Contract(MasterChef.abi, MasterChefAddress)
        const MasterChefMegaLionContract = new web3.eth.Contract(MasterChefMegaLion.abi, MasterChefMegaLionAddress)
        const WBNBPoolContract = new web3.eth.Contract(WBNBPool.abi, WBNBPoolAddress)
        const SlionTokenContract = new web3.eth.Contract(SlionToken.abi, SlionTokenAddress)
        const MlionTokenContract = new web3.eth.Contract(MlionToken.abi, MlionTokenAddress)
        const TimelockContract = new web3.eth.Contract(Timelock.abi, TimelockAddress)

        //this.state.MasterChefContract.methods.poolInfo(index).call()

        this.state = {
            account: '0x0',

            MasterChefData: MasterChefData,
            MasterChefContract: MasterChefContract,
            MasterChefAddress: MasterChefAddress,

            MasterChefMegaLionData: MasterChefMegaLionData,
            MasterChefMegaLionContract: MasterChefMegaLionContract,
            MasterChefMegaLionAddress: MasterChefMegaLionAddress,

            WBNBPoolData: WBNBPoolData,
            WBNBPoolContract: WBNBPoolContract,
            WBNBPoolAddress: WBNBPoolAddress,


            SlionToken: {},
            ourTokenName: 'SLION',
            ourTokenContract: SlionTokenAddress,
            SlionTokenData: SlionTokenData,
            SlionTokenContract: SlionTokenContract,
            SlionTokenBalance: '0',
            stakingBalance: '0',
            ourTokenPrice: '-',
            totalTokenBurned: 0,
            totalAllocPoint: 0,
            tokensInYourWallet: 0,

            BusdPerBNB: 0,

            MlionToken: {},
            ourSecondTokenName: 'MLION',
            ourSecondTokenContract: MlionTokenAddress,
            MlionTokenData: MlionTokenData,
            MlionTokenContract: MlionTokenContract,
            MlionTokenBalance: '0',
            MlionStakingBalance: '0',
            ourSecondTokenPrice: '-',
            ourSecondTotalTokenBurned: 0,
            ourSecondTotalAllocPoint: 0,
            secondTokenTokensInYourWallet: 0,

            TimelockContract: TimelockContract,

            loading: true,
            showModal: false,
            modalContent: 'aaa',
            tvl: 0,

            defiName: 'SuperLion',
            defiUrl: 'http://tping.online/',

            pools: [],

            erc20Abi: ERC20,
            lpTokenAbi: lpToken,

            wrongNetwork: false,

            whoHasReferredMe: '0x0',
            referredCount: 0,

            currentBlock: 0,
            bnbPrice: 0,
        }

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    updatePageTitle() {
        document.title = parseFloat(this.state.ourTokenPrice).toFixed(3).toString() + '$ - ' + parseFloat(this.state.ourSecondTokenPrice).toFixed(3).toString() + '$ - ' + this.state.defiName;
    }

    async componentWillMount() {

        //console.log(getBep20Contract.getBep20Contract('aaa'));

        const currentWallet = '0x0';

        this.setState({
            currentWallet: currentWallet
        })
        await this.getBNBPrice();
        await this.usePriceTokenBusdv2();
        await this.usePriceTokenBusdv2MLion();
        await this.refreshPools();
        await this.loadTokenStats();
        await this.loadOurSecondTokenStats();
        await this.refreshPrices();
        //await this.refreshPools();
        //await this.loadPoolsInfo();
        this.loadBlockchainData()
        this.connectWalletConnect()

        //await this.connectWalletConnect()
        //await this.loadWeb3()
        //await this.loadBlockchainData()
    }

    async disconnectWallet() {
        const currentWallet = '0x0';
        /*
        console.log('window.web3');
        console.log(window.web3);
        */
        this.state.web3Modal.clearCachedProvider();
        /*
        console.log('this.state.web3Modal');
        console.log(this.state.web3Modal);
        */

        this.setState({
            currentWallet: currentWallet
        })
        //this.setState({ loading: true })
        await this.connectWalletConnect(true)
    }

    async connectWalletConnect(buttonPressed = false) {
        const providerOptions = {
            // Example with injected providers
            injected: {
                display: {
                    logo: "data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzEgOTEuMTI1IDE2OC43NSAxMjAuMzc1IDE2OC43NSAxMjMuNzUgMTcxIDEyMS41IDE1Mi40MzggMTE3IDE0OS42MjUgOTQuNSAxNTAuMTg4Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUMzNSIgcG9pbnRzPSI3NS4zNzUgMjcgODguODc1IDU4LjUgOTUuMDYzIDE1MC4xODggMTE3IDE1MC4xODggMTIzLjc1IDU4LjUgMTM2LjEyNSAyNyIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiNFQThFM0EiIHBvaW50cz0iOTIuMjUgMTAyLjM3NSA5NS4wNjMgMTUwLjE4OCA4Ni42MjUgMTI1LjcxOSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMzkuMzc1IDEzOC45MzggNjUuMjUgMTM4LjM3NSA2MC43NSAxNzMuMjUiLz48cG9seWdvbiBmaWxsPSIjRUI4RjM1IiBwb2ludHM9IjEyLjkzOCAxODguNDM4IDYwLjc1IDE3My4yNSAzOS4zNzUgMTM4LjkzOCAuNTYzIDE0MS43NSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iODguODc1IDU4LjUgNjQuNjg4IDc4Ljc1IDQ2LjEyNSAxMDEuMjUgOTIuMjUgMTAyLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNERkNFQzMiIHBvaW50cz0iNjAuNzUgMTczLjI1IDkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzAuNDM4IDg4LjMxMyAxODAuNTYzIDY4LjA2MyAxNzYuNjI1Ii8+PHBvbHlnb24gZmlsbD0iI0RGQ0VDMyIgcG9pbnRzPSIxMjEuNSAxNzMuMjUgMTUwLjc1IDE1Mi40MzggMTQ4LjUgMTcwLjQzOCAxNDguNSAxODAuNTYzIDEyOC4yNSAxNzYuNjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIuMjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjExLjUgMCkiPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MCAxNTMiLz48cG9seWdvbiBmaWxsPSIjRUE4RTNBIiBwb2ludHM9IjkyLjI1IDEwMi4zNzUgOTUuMDYzIDE1MC4xODggODYuNjI1IDEyNS43MTkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjM5LjM3NSAxMzguOTM4IDY1LjI1IDEzOC4zNzUgNjAuNzUgMTczLjI1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSIxMi45MzggMTg4LjQzOCA2MC43NSAxNzMuMjUgMzkuMzc1IDEzOC45MzggLjU2MyAxNDEuNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9Ijg4Ljg3NSA1OC41IDY0LjY4OCA3OC43NSA0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi45MzgiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PC9nPjwvZz48L3N2Zz4=",
                    name: "Metamask",
                    description: "Connect with the provider in your Browser"
                },
                package: null
            },
            // Example with WalletConnect provider
            walletconnect: {
                display: {
                    //logo: "data:image/gif;base64,INSERT_BASE64_STRING",
                    name: "Wallet Connect",
                    description: "Scan qrcode with your mobile wallet"
                },
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        //56: 'https://bsc-dataseed1.binance.org:443'
                        56: 'https://bsc-dataseed1.ninicoin.io'
                    },
                    //network: 'binance',
                    //chainId: 56,
                    //infuraId: "1rkU0okz51St8R7XGl5zRkUO2DH", // required
                    bridge: 'https://bridge.walletconnect.org',
                    qrcode: true,
                    pollingInterval: 12000,
                }
            }
        };

        const web3Modal = new Web3Modal({
            network: "binance", // optional
            //network: "0x38", // bsc main net
            //network: "0x61", // bsc test net
            //network: "0x61", // bsc test net
            cacheProvider: true, // optional
            providerOptions // required
        });

        await this.setState({
            web3Modal: web3Modal,
        })

        /*
        if(!web3Modal.cachedProvider) {
            web3Modal.clearCachedProvider();
        }
        */

        if (buttonPressed) {
            this.state.web3Modal.clearCachedProvider();
        }

        const provider = await this.state.web3Modal.connect();
        //const provider = await web3Modal.connect();

        /*
        console.log('provider');
        console.log(provider);
        */
        await this.setState({
            provider: provider
        })

        /*
        console.log('window.ethereum')
        console.log(window.ethereum)
        console.log('window.web3')
        console.log(window.web3)
        */

        //const web3 = new Web3(this.state.provider);

        window.web3 = new Web3(this.state.provider)

        /*
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
        } else if (window.web3) {
            //window.web3 = new Web3(window.web3.currentProvider)
            window.web3 = new Web3(this.state.provider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
        }
        */
        const accounts = await window.web3.eth.getAccounts();
        /*
        console.log('this.state.provider');
        console.log(this.state.provider);
        */
        let chainId = this.state.provider.chainId;

        //0x38 - BSC MAIN
        //0x61 - BSC TESTNET

        /*
        console.log('chainId');
        console.log(chainId);
        */

        let currentWallet = '';

        if (chainId == networkId) {
            chainId = networkIdHex;
        }


        if (chainId != networkIdHex) {
            this.setState({
                wrongNetwork: true,
            })
        }

        if (accounts.length > 0 && typeof accounts != 'undefined' && chainId == networkIdHex) {
            /*
            console.log('accounts');
            console.log(accounts);
            */
            currentWallet = accounts[0];
            this.setState({
                currentWallet: currentWallet
            })
        } else {
            currentWallet = '0x0';
            this.setState({
                currentWallet: currentWallet
            })
            //this.setState({ loading: true })
        }

        /*
        console.log('currentWallet');
        console.log(currentWallet);
        */

        const MasterChefContract = new window.web3.eth.Contract(MasterChef.abi, MasterChefAddress)
        const MasterChefMegaLionContract = new window.web3.eth.Contract(MasterChefMegaLion.abi, MasterChefMegaLionAddress)
        const WBNBPoolContract = new window.web3.eth.Contract(WBNBPool.abi, WBNBPoolAddress)
        const SlionTokenContract = new window.web3.eth.Contract(SlionToken.abi, SlionTokenAddress)
        const MlionTokenContract = new window.web3.eth.Contract(MlionToken.abi, MlionTokenAddress)

        //this.state.MasterChefContract.methods.poolInfo(index).call()

        this.setState({
            MasterChefData: MasterChefData,
            MasterChefContract: MasterChefContract,

            MasterChefMegaLionData: MasterChefMegaLionData,
            MasterChefMegaLionContract: MasterChefMegaLionContract,

            WBNBPoolData: WBNBPoolData,
            WBNBPoolContract: WBNBPoolContract,

            SlionTokenData: SlionTokenData,
            SlionTokenContract: SlionTokenContract,

            MlionTokenData: MlionTokenData,
            MlionTokenContract: MlionTokenContract,
        });

        if (currentWallet === '0x0') {
            return;
        }

        this.state.provider.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                const currentWallet = accounts[0];
                this.setState({
                    currentWallet: currentWallet
                })
            } else {
                const currentWallet = '0x0';
                this.setState({
                    currentWallet: currentWallet
                })
                this.setState({
                    loading: true
                })
            }
        });

        // Subscribe to chainId change
        this.state.provider.on("chainChanged", (chainId) => {
            if (chainId == networkIdHex) {
                const currentWallet = this.state.provider.selectedAddress;
                this.setState({
                    currentWallet: currentWallet,
                    wrongNetwork: false,
                })
            } else {
                const currentWallet = '0x0';
                this.setState({
                    currentWallet: currentWallet,
                    wrongNetwork: true,
                })
            }
        });

        // Subscribe to session connection
        this.state.provider.on("connect", () => {
            //console.log("connect");
        });

        // Subscribe to session disconnection
        this.state.provider.on("disconnect", (code, reason) => {
            /*
            console.log('disconnect');
            console.log(code, reason);
            */

            const currentWallet = '0x0';
            this.setState({
                currentWallet: currentWallet
            })
            this.setState({
                loading: true
            })
        });

        //await this.loadWeb3()
        //await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        /*
        const currentWallet = this.state.currentWallet;

        if (currentWallet === '0x0') {
            return false;
        }

        console.log('BLOCKS_PER_YEAR');
        console.log(BLOCKS_PER_YEAR.toString());

        console.log('CAKE_PER_BLOCK');
        console.log(CAKE_PER_BLOCK.toString());


        console.log('MasterChef.abi');
        console.log(MasterChef.abi.toString());


        const web3 = window.web3;
        /*
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        */
        /*
                const networkId = await web3.eth.net.getId()

                // Load SlionToken
                const SlionTokenData = SlionToken.networks[networkId]

                if (SlionTokenData) {

                    console.log('SlionTokenData.address');
                    console.log(SlionTokenData.address);
                    const SlionTokenContract = new web3.eth.Contract(SlionToken.abi, SlionTokenData.address)
                    this.setState({ SlionTokenContract })
                    let SlionTokenBalance = await SlionTokenContract.methods.balanceOf(currentWallet).call();
                    this.setState({ SlionTokenBalance: SlionTokenBalance.toString() })
                    console.log({ balance: SlionTokenBalance })
                } else {
                    window.alert('SlionToken contract not deployed to detected network.')
                }


                // Load Earned balance
                //this.setState({ SlionTokenEarnBalance: '0' })


                // Load MasterChef
                const MasterChefData = MasterChef.networks[networkId]
                if(MasterChefData) {
                    console.log('MasterChefData.address');
                    console.log(MasterChefData.address);



                    //const pendingReward = await this.state.MasterChefContract.methods.poolLength().call()
                    const poolLength = await this.state.MasterChefContract.methods.poolLength().call()

                    console.log('this.state.SlionTokenContract');
                    console.log(this.state.SlionTokenContract);

                    let SlionTokenMasterChefBalance = await this.state.SlionTokenContract.methods.balanceOf(this.state.MasterChefContract._address).call();

                    this.setState({ SlionTokenMasterChefBalance: SlionTokenMasterChefBalance.toString() })

                    /*
                    const currentBlock = await MasterChefContract.methods.getCurrentBlock().call()
                    console.log('currentBlock');
                    console.log(currentBlock);
                    */
        /*
        console.log('-- START POOL INFO --');
        for (var i = 0; i < poolLength; i++) {
            var poolInfoSingle = await this.state.MasterChefContract.methods.poolInfo(i).call();
            console.log('poolInfoSingle ' + i);
            console.log(poolInfoSingle);

            /*
            const debugUpdatePoolReturn = await MasterChefContract.methods.debugUpdatePool(i).call()
            console.log('debugUpdatePoolReturn');
            console.log(debugUpdatePoolReturn);
             */
        /*
                    }
                    console.log('-- END POOL INFO --');

                    const userInfo = await this.state.MasterChefContract.methods.userInfo(currentPoolPid, currentWallet).call()
                    const pendingSlion = await this.state.MasterChefContract.methods.pendingSlion(currentPoolPid, currentWallet).call()

                    this.setState({ SlionTokenEarnBalance: pendingSlion.toString() })

                    console.log('pendingSlion');
                    console.log(pendingSlion);

                    //this.setState({ MasterChefContract })
                    //let stakingBalance = await MasterChefContract.methods.stakingBalance(this.state.currentWallet).call()
                    let stakingBalance = userInfo.amount;
                    this.setState({ stakingBalance: stakingBalance.toString() })
                } else {
                    window.alert('MasterChef contract not deployed to detected network.')
                }
                */
        this.setState({
            loading: false
        })
        this.getBNBPrice();
        this.usePriceTokenBusdv2();
        this.usePriceTokenBusdv2MLion();
        this.refreshPrices();
        await this.loadPoolsInfo();
        this.loadPoolsUserData();
        this.loadReferralUserData();
        this.loadTokenStats();
        this.loadOurSecondTokenStats();
        this.loadMasterChefStats();
        this.loadMasterChefMegaLionStats();
        this.refreshData();
    }

    refreshData = () => {
        setTimeout(() => {
            this.loadBlockchainData();
        }, 10000);
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
        }
    }

    refreshPrices = () => {
        //fetch('https://api.pancakeswap.com/api/v1/price')
        fetch('https://api.pancakeswap.info/api/v2/tokens')
            .then(response => response.json())
            .then((jsonData) => {
                // jsonData is parsed json object received from url
                //jsonData

                let tokenPrices = [];

                if (jsonData.hasOwnProperty('data')) {

                    Object.entries(jsonData.data).forEach(function(row, a) {

                        let contract = row[0].toLowerCase();
                        let rowData = row[1];
                        let price = rowData.price;
                        let symbol = rowData.symbol;

                        tokenPrices[contract] = {
                            'price': price,
                            'symbol': symbol,
                        }
                    });

                    this.setState({
                        'tokenPrices': tokenPrices
                    });

                    /*
                    let tokenPrice = this.getTokenPriceBySymbol('Slion');
                    this.setState({
                        ourTokenPrice: tokenPrice
                    })
                    */

                    //this.updatePageTitle();
                }

            })
            .catch((error) => {
                // handle your errors here
                console.error(error)
            })
        /*
        fetch('https://api.pancakeswap.info/api/v2/pairs')
            .then(response => response.json())
            .then((jsonData) => {
                // jsonData is parsed json object received from url
                //jsonData

                if (jsonData.hasOwnProperty('data')) {

                    let pairsPrices = [];

                    Object.entries(jsonData.data).forEach(function(row) {

                        let rowData = row[1];
                        let pairAddress = rowData.pair_address.toLowerCase();
                        let pairPrice = rowData.price;
                        //let quoteSymbol = rowData.quote_symbol;

                        pairsPrices[pairAddress] = {
                            'price': pairPrice,
                            //'quoteSymbol': quoteSymbol,
                        }
                    });

                    /*
                    jsonData.data.forEach(function(i, el) {
                        console.log('aaa');
                        console.log(i);
                        console.log(el);
                    });

                     */
        /*

                            this.setState({
                                'pairsPrices': pairsPrices
                            });

                            console.log('pairsPrices');
                            console.log(pairsPrices);

                            /*
                            let tokenPrice = this.getTokenPriceBySymbol('Slion');
                            this.setState({
                                ourTokenPrice: tokenPrice
                            })
                            */
        /*

                            this.updatePageTitle();
                        }

                    })
                    .catch((error) => {
                        // handle your errors here
                        console.error(error)
                    })
                */
    }

    refreshPools = () => {
        //fetch('http://localhost/pools.php')
        //fetch('https://tping.online/pools.php')

        //console.log('refreshPools');

        //let poolsUrl = 'https://tping.online/pools-v2.php';
        //let poolsUrl = 'https://defi.cristian.ovh/pools-v2.php';
        //let poolsUrl = 'https://defi.cristian.ovh/pools-wbnb.php';
        //let poolsUrl = 'https://tping.online/pools-v4.json';
        let poolsUrl = 'https://tping.online/pwbnb.json';

        fetch(poolsUrl)
            .then(response => response.json())
            .then((jsonData) => {
                // jsonData is parsed json object received from url
                /*
                console.log('jsonData');
                console.log(jsonData);
                */
                this.setState({
                    'pools': jsonData
                });

                this.loadPoolsInfo();

            })
            .catch((error) => {
                // handle your errors here
                console.error(error)
            })
    }

    async loadPoolsInfo() {

        //const poolLength = await this.state.MasterChefContract.methods.poolLength().call()

        let totalAllocPoint = await this.state.MasterChefContract.methods.totalAllocPoint().call();
        /*
        console.log('totalAllocPoint');
        console.log(totalAllocPoint);
        */
        let ourSecondTotalAllocPoint = await this.state.MasterChefMegaLionContract.methods.totalAllocPoint().call();

        //let currentBlock = await window.web3.eth.getBlock();
        let currentBlock = await window.web3.eth.getBlockNumber();
        //currentBlock = currentBlock.number;

        //console.log('currentBlock');
        //console.log(this.state.MasterChefMegaLionContract.methods);
        //console.log(window.web3.eth);

        this.setState({
            totalAllocPoint: totalAllocPoint,
            ourSecondTotalAllocPoint: ourSecondTotalAllocPoint,
            currentBlock: currentBlock,
        })

        //let poolsUrl = 'https://tping.online/pools-v2.php';
        //let poolsUrl = 'https://defi.cristian.ovh/pools-v2.php';
        //let poolsUrl = 'https://defi.cristian.ovh/pools-wbnb.php';
        //let poolsUrl = 'https://tping.online/pools-v4.json';
        let poolsUrl = 'https://tping.online/pwbnb.json';

        fetch(poolsUrl)
            .then(response => response.json())
            .then(async (jsonData) => {
                // jsonData is parsed json object received from url

                //let pools = [];
                let pools = jsonData;
                if (this.state.pools) {
                    pools = this.state.pools;
                }

                for (const [index, value] of jsonData.entries()) {

                    //if (index < poolLength) {

                    let poolInfoSingle = ''
                    if (value.masterchef == 0) {
                        poolInfoSingle = await this.state.MasterChefContract.methods.poolInfo(value.pid).call();
                    } else if (value.masterchef == 1) {
                        poolInfoSingle = await this.state.MasterChefMegaLionContract.methods.poolInfo(value.pid).call();
                    } else {
                        poolInfoSingle = await this.state.WBNBPoolContract.methods.poolInfo(value.pid).call();
                    }

                    let lpContract = await this.getContractByTypeAndAddress('token', value.lpToken);
                    let totalSupply = await lpContract.methods.totalSupply().call();
                    let totalSupplyEth = window.web3.utils.fromWei(totalSupply.toString(), 'Ether')

                    let lpPrice = 0

                    if (value.token2Contract) {


                        let token1Contract = await this.getContractByTypeAndAddress('token', value.token1Contract);
                        let token2Contract = await this.getContractByTypeAndAddress('token', value.token2Contract);

                        let totalTokens1InLP = await token1Contract.methods.balanceOf(value.lpToken).call();
                        let totalTokens1InLPEth = window.web3.utils.fromWei(totalTokens1InLP.toString(), 'Ether')

                        let totalTokens2InLP = await token2Contract.methods.balanceOf(value.lpToken).call();
                        let totalTokens2InLPEth = window.web3.utils.fromWei(totalTokens2InLP.toString(), 'Ether')

                        let token1PriceInUSD = this.getTokenPriceByContract(value.token1Contract);
                        let token2PriceInUSD = this.getTokenPriceByContract(value.token2Contract);

                        let totalUSDToken1InLp = totalTokens1InLPEth * token1PriceInUSD;
                        let totalUSDToken2InLp = totalTokens2InLPEth * token2PriceInUSD;

                        let totalUSD = totalUSDToken1InLp + totalUSDToken2InLp;

                        lpPrice = totalUSD / totalSupplyEth;
                        poolInfoSingle.lpPrice = lpPrice;

                    } else {
                        lpPrice = this.getTokenPriceByContract(value.lpToken);
                        poolInfoSingle.lpPrice = lpPrice;
                    }

                    let lpStakedInMasterChef = '';
                    if (value.masterchef == 0) {
                        lpStakedInMasterChef = await lpContract.methods.balanceOf(this.state.MasterChefContract._address).call();
                    } else if (value.masterchef == 1) {
                        lpStakedInMasterChef = await lpContract.methods.balanceOf(this.state.MasterChefMegaLionContract._address).call();
                    } else {
                        lpStakedInMasterChef = await lpContract.methods.balanceOf(this.state.WBNBPoolContract._address).call();
                    }

                    let lpStakedInMasterChefEth = window.web3.utils.fromWei(lpStakedInMasterChef.toString(), 'Ether')
                    poolInfoSingle.tokensBalance = lpStakedInMasterChefEth;

                    let totalLiquidity = lpStakedInMasterChefEth * lpPrice;
                    poolInfoSingle.tokensBalanceInBusd = totalLiquidity;

                    if (value.masterchef == 2) {
                        poolInfoSingle.startBlock = await this.state.WBNBPoolContract.methods.startBlock().call();
                        poolInfoSingle.bonusEndBlock = await this.state.WBNBPoolContract.methods.bonusEndBlock().call();

                        //console.log('poolInfoSingle.bonusEndBlock');
                        //console.log(poolInfoSingle.bonusEndBlock);
                    }

                    let newSinglePoolData = { ...value,
                        ...poolInfoSingle
                    }
                    //console.log('newSinglePoolData');
                    //console.log(newSinglePoolData);

                    /*
                    if ((value.pid == 1 || value.pid == 2) && false) {
                            //console.log('!!!!!index ' + index);
                            console.log('value.pid');
                            console.log(value.pid);

                            let info = poolInfoSingle;

                            let lpAddress = poolInfoSingle.lpToken;
                            let lpContract = await this.getContractByTypeAndAddress('lp', lpAddress);
                            let tokenContract = await this.getContractByTypeAndAddress('token', value.token1Contract);

                            /*
                            console.log('------')
                            console.log(lpAddress);
                            console.log(value.token1Contract);
                            console.log(value.token2Contract);
                            console.log('------')
                            */
                    /*

                                            //CRISTIAN cambiar token1Contract por token2Contract
                                            let quoteTokenContract = await this.getContractByTypeAndAddress('token', value.token2Contract);
                                            //CRISTIAN cambiar token1Contract por token2Contract

                                            let tokenBalanceLP = await tokenContract.methods.balanceOf(lpAddress).call();
                                            //console.log('tokenBalanceLP');
                                            //console.log(tokenBalanceLP);

                                            let quoteTokenBalanceLP = await quoteTokenContract.methods.balanceOf(lpAddress).call()
                                            //console.log('quoteTokenBalanceLP');
                                            //console.log(quoteTokenBalanceLP);

                                            let lpTokenBalanceMC = await lpContract.methods.balanceOf(this.state.MasterChefAddress).call();
                                            //console.log(lpTokenBalanceMC);

                                            let lpTotalSupply = await lpContract.methods.totalSupply().call();
                                            //console.log(lpTotalSupply);

                                            let tokenDecimals = await tokenContract.methods.decimals().call();
                                            //console.log(tokenDecimals);

                                            let quoteTokenDecimals = await quoteTokenContract.methods.decimals().call();
                                            //console.log(quoteTokenDecimals);

                                            // Ratio in % a LP tokens that are in staking, vs the total number in circulation
                                            const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
                                            //console.log(lpTokenRatio);

                                            // Total value in staking in quote token value
                                            const lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
                                                .div(new BigNumber(10).pow(18))
                                                .times(new BigNumber(2))
                                                .times(lpTokenRatio)
                                            //console.log(lpTotalInQuoteToken);

                                            // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
                                            const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
                                            //console.log(tokenAmount);

                                            const quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
                                                .div(new BigNumber(10).pow(quoteTokenDecimals))
                                                .times(lpTokenRatio)
                                            //console.log(quoteTokenAmount);

                                            //const allocPoint = new BigNumber(info.allocPoint._hex)
                                            const allocPoint = new BigNumber(info.allocPoint)
                                            //console.log(allocPoint);

                                            const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
                                            //console.log(poolWeight);

                                            poolInfoSingle.tokenAmount = tokenAmount.toJSON();
                                            //console.log(poolInfoSingle.tokenAmount);

                                            poolInfoSingle.quoteTokenAmount = quoteTokenAmount.toJSON();
                                            //console.log(poolInfoSingle.quoteTokenAmount);

                                            poolInfoSingle.lpTotalInQuoteToken = lpTotalInQuoteToken.toJSON();
                                            //console.log(poolInfoSingle.lpTotalInQuoteToken);

                                            poolInfoSingle.tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount).toJSON();
                                            //console.log(poolInfoSingle.tokenPriceVsQuote);

                                            poolInfoSingle.poolWeight = poolWeight.toJSON();
                                            //console.log(poolInfoSingle.poolWeight);

                                            poolInfoSingle.multiplier = `${allocPoint.div(100).toString()}X`;
                                            //console.log(poolInfoSingle.multiplier);
                                    }
                                    */

                    //pools.push(newSinglePoolData);
                    pools[index] = newSinglePoolData;

                    this.setState({
                        pools: pools
                    });

                    this.setState({
                        ['poolInfoSinglePid' + value.masterchef + '-' + value.pid]: poolInfoSingle
                    });

                    this.calculateTVL();

                    //}
                }

                /*
                this.setState({
                    pools: pools
                });
                */

            })
            .catch((error) => {
                // handle your errors here
                console.error(error)
            })
        //for (const [index, value] of this.state.pools.entries()) {

        //}


        //this.usePriceTokenBusd();

        //this.loadLiquidityPools();
        //this.calculateTVL();
    }

    async getBNBPrice() {

        const lpContractAddress = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16';
        let BNBContract = await this.getContractByTypeAndAddress('token', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
        let BusdContract = await this.getContractByTypeAndAddress('token', '0xe9e7cea3dedca5984780bafc599bd69add087d56');

        let BNBBalanceInLP = await BNBContract.methods.balanceOf(lpContractAddress).call();
        let BusdBalanceInLP = await BusdContract.methods.balanceOf(lpContractAddress).call();

        let BusdPerBNB = BusdBalanceInLP / BNBBalanceInLP;

        this.setState({
            bnbPrice: BusdPerBNB
        })

        this.updatePageTitle();
    }

    async usePriceTokenBusdv2() {
        //LP contract SLION-BUSD
        //0x67f915f44F67b748586e248A187169a866427DA0
        //https://api.pancakeswap.info/api/v2/pairs
        /*
        PRECIO = BUSD en LP / SLION en LP
        */
        //let lpContract = await this.getContractByTypeAndAddress('lp', '0x67f915f44F67b748586e248A187169a866427DA0');


        const lpContractAddress = '0x67f915f44F67b748586e248A187169a866427DA0';
        let SlionContract = await this.getContractByTypeAndAddress('token', '0xb9fcb5b2935d57a8568b6309b3093200482c448d');
        let BusdContract = await this.getContractByTypeAndAddress('token', '0xe9e7cea3dedca5984780bafc599bd69add087d56');

        let SlionBalanceInLP = await SlionContract.methods.balanceOf(lpContractAddress).call();
        let BusdBalanceInLP = await BusdContract.methods.balanceOf(lpContractAddress).call();

        let BusdPerSlion = BusdBalanceInLP / SlionBalanceInLP;

        this.setState({
            ourTokenPrice: BusdPerSlion
        })

        this.updatePageTitle();
    }

    async usePriceTokenBusdv2MLion() {
        /*
        BUSD VERSION
        const lpContractAddress = '0x325d161f2c5Cd6E18D35005aA871Fc7D29770991';
        let MlionContract = await this.getContractByTypeAndAddress('token', '0xa4faa13fb2492f5f137669978e3fb62c046adffc');
        let BusdContract = await this.getContractByTypeAndAddress('token', '0xe9e7cea3dedca5984780bafc599bd69add087d56');

        let MlionBalanceInLP = await MlionContract.methods.balanceOf(lpContractAddress).call();
        let BusdBalanceInLP = await BusdContract.methods.balanceOf(lpContractAddress).call();

        let BusdPerMlion = BusdBalanceInLP / MlionBalanceInLP;

        this.setState({
            ourSecondTokenPrice: BusdPerMlion
        })
        */


        const lpContractAddress = '0x2e7ae1906cb1ccff16e769e98224b3a4515c3e80';
        let MlionContract = await this.getContractByTypeAndAddress('token', '0xa4faa13fb2492f5f137669978e3fb62c046adffc');
        let BNBContract = await this.getContractByTypeAndAddress('token', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');

        let MlionBalanceInLP = await MlionContract.methods.balanceOf(lpContractAddress).call();
        let BNBBalanceInLP = await BNBContract.methods.balanceOf(lpContractAddress).call();

        let BusdPerMlion = BNBBalanceInLP * this.state.bnbPrice / MlionBalanceInLP;

        this.setState({
            ourSecondTokenPrice: BusdPerMlion
        })


        this.updatePageTitle();
    }
    /*
    usePriceTokenBusd = () => {
        const ZERO = new BigNumber(0);
        const cakeBnbFarm = this.getPoolInfo(1);
        const bnbBusdFarm = this.getPoolInfo(2);

        console.log('cakeBnbFarm');
        console.log(cakeBnbFarm);

        console.log('bnbBusdFarm');
        console.log(bnbBusdFarm);



        const bnbBusdPrice = bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(1).div(bnbBusdFarm.tokenPriceVsQuote) : ZERO
        let cakeBusdPrice = cakeBnbFarm.tokenPriceVsQuote ? bnbBusdPrice.times(cakeBnbFarm.tokenPriceVsQuote) : ZERO

        //console.log('cakeBusdPrice')
        //console.log(cakeBusdPrice.toFormat(3))

        //cakeBusdPrice = 10;

        console.log('bnbBusdPrice');
        console.log(bnbBusdPrice.toFormat(3));

        console.log('cakeBusdPrice');
        console.log(cakeBusdPrice.toFormat(3));

        this.setState({
            ourTokenPrice: cakeBusdPrice
        })

        return cakeBusdPrice
    }
    */

    async loadLiquidityPools() {
        const poolLength = await this.state.MasterChefContract.methods.poolLength().call()

        for (const [index, value] of this.state.pools.entries()) {

            if (index < poolLength) {

                let type = 'token';
                if (value.token2Name) {
                    type = 'lp';
                }

                const lpStakedContract = this.getContractByTypeAndAddress(type, value.lpToken);
                const tokenBalanceInMasterChef = await lpStakedContract.methods.balanceOf(this.state.MasterChefContract._address).call();
                const tokenSymbol = await lpStakedContract.methods.symbol().call();

                //const tokenSymbol = 'Cake';

                let lpTokenPriceInUsd = 1;
                if (type === 'token') {
                    //value.lpToken = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82';
                    lpTokenPriceInUsd = this.getTokenPriceByContract(value.lpToken);
                } else {
                    //value.lpToken = '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6';
                    lpTokenPriceInUsd = this.getPairPriceByContract(value.lpToken);
                }

                /*
                console.log('tokenSymbol');
                console.log(tokenSymbol);

                console.log('lpTokenPriceInUsd');
                console.log(lpTokenPriceInUsd);
                */

                this.setState({
                    ['poolBalanceSinglePid' + value.masterchef + '-' + value.pid]: {
                        'tokensBalance': window.web3.utils.fromWei(tokenBalanceInMasterChef, 'Ether'),
                        'tokenSymbol': tokenSymbol,
                        'tokensBalanceInBusd': window.web3.utils.fromWei(tokenBalanceInMasterChef, 'Ether') * lpTokenPriceInUsd,
                    }
                });

                //console.log(this.state['poolBalanceSinglePid' + index]);
            }

        }

        this.calculateTVL();
    }

    async calculateTVL() {
        //const poolLength = await this.state.MasterChefContract.methods.poolLength().call()
        /*
        console.log('poolLength');
        console.log(poolLength);
        */
        var tvl = 0;


        for (const [index, value] of this.state.pools.entries()) {
            //if (index < poolLength) {
            //let singleLiquidityPool = this.getLiquidityPools(index);
            if (value.tokensBalanceInBusd) {
                let singleLiquidityPoolInBusd = value.tokensBalanceInBusd;
                tvl += singleLiquidityPoolInBusd;
            }
            //}
        }

        /*
        console.log('tvl');
        console.log(tvl);
        */
        this.setState({
            'tvl': tvl
        });
    }

    getLiquidityPools = (masterchef, pid) => {
        let dataLiquidityPools = {
            'tokensBalance': 0,
            'tokenSymbol': '',
            'tokensBalanceInBusd': 0,
        };

        if (this.state.hasOwnProperty('poolBalanceSinglePid' + masterchef + '-' + pid)) {
            return this.state['poolBalanceSinglePid' + masterchef + '-' + pid];
        }

        return dataLiquidityPools;
    }

    getPoolInfo = (masterchef, pid) => {
        let userDataPool = {
            'accSlionPerShare': '',
            'allocPoint': '',
            'lastRewardBlock': '',
            'lpToken': '',
            'depositFeeBP': '',
            'tokenAmount': '',
            'quoteTokenAmount': '',
            'lpTotalInQuoteToken': '',
            'tokenPriceVsQuote': '',
            'poolWeight': '',
            'multiplier': '',
        };

        if (this.state.hasOwnProperty('poolInfoSinglePid' + masterchef + '-' + pid)) {
            return this.state['poolInfoSinglePid' + masterchef + '-' + pid];
        }

        //return userDataPool
        return userDataPool;
    }

    async loadPoolsUserData() {
        //const poolLength = await this.state.MasterChefContract.methods.poolLength().call()

        for (const [index, value] of this.state.pools.entries()) {
            let type = 'token';
            if (value.token2Name) {
                type = 'lp';
            }

            //if (index < poolLength) {
            this.hasApprovedContract(value.masterchef, value.pid, type, value.lpToken);
            this.getUserInfo(value.masterchef, value.pid, this.state.currentWallet);
            this.getUserPendingTokens(value.masterchef, value.pid, this.state.currentWallet);
            this.getUserWalletBalance(value.masterchef, value.pid, type, value.lpToken, this.state.currentWallet);
            //}
        }
    }

    async loadReferralUserData() {
        if (this.state.currentWallet == '0x0') {
            return false;
        }

        const whoHasReferredMe = await this.state.MasterChefContract.methods.referrers(this.state.currentWallet).call()

        const referredCount = await this.state.MasterChefContract.methods.referredCount(this.state.currentWallet).call()

        this.setState({
            whoHasReferredMe: whoHasReferredMe,
            referredCount: referredCount,
        })
    }

    async loadTokenStats() {
        const tokenContract = this.getContractByTypeAndAddress('token', this.state.ourTokenContract);

        let totalBurned = await tokenContract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call();
        let totalBurnedEther = window.web3.utils.fromWei(totalBurned.toString(), 'Ether')
        let tokenTotalSupply = await tokenContract.methods.totalSupply().call();
        let tokenTotalSupplyEther = window.web3.utils.fromWei(tokenTotalSupply.toString(), 'Ether')
        //let tokenSymbol = await tokenContract.methods.symbol().call();
        //let tokenPriceInBusd = this.getTokenPriceBySymbol(tokenSymbol);
        let tokenPriceInBusd = this.getTokenPriceByContract(tokenContract._address);
        //let tokenPriceInBusd = this.getTokenPriceByContract('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82');

        let tokensInYourWallet = 0;
        if (this.state.currentWallet != '0x0') {
            tokensInYourWallet = await tokenContract.methods.balanceOf(this.state.currentWallet).call();
        }

        let tokensInYourWalletEther = window.web3.utils.fromWei(tokensInYourWallet.toString(), 'Ether')
        tokenTotalSupplyEther = tokenTotalSupplyEther - totalBurnedEther;

        this.setState({
            tokenTotalSupply: tokenTotalSupplyEther,
            marketCap: tokenTotalSupplyEther * tokenPriceInBusd,
            totalTokenBurned: totalBurnedEther,
            tokensInYourWallet: tokensInYourWalletEther,
        })
    }

    async loadOurSecondTokenStats() {
        const tokenContract = this.getContractByTypeAndAddress('token', this.state.ourSecondTokenContract);

        let totalBurned = await tokenContract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call();
        let totalBurnedEther = window.web3.utils.fromWei(totalBurned.toString(), 'Ether')
        let tokenTotalSupply = await tokenContract.methods.totalSupply().call();
        let tokenTotalSupplyEther = window.web3.utils.fromWei(tokenTotalSupply.toString(), 'Ether')
        //let tokenSymbol = await tokenContract.methods.symbol().call();
        //let tokenPriceInBusd = this.getTokenPriceBySymbol(tokenSymbol);
        let tokenPriceInBusd = this.getTokenPriceByContract(tokenContract._address);
        //let tokenPriceInBusd = this.getTokenPriceByContract('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82');

        let tokensInYourWallet = 0;
        if (this.state.currentWallet != '0x0') {
            tokensInYourWallet = await tokenContract.methods.balanceOf(this.state.currentWallet).call();
        }

        let tokensInYourWalletEther = window.web3.utils.fromWei(tokensInYourWallet.toString(), 'Ether')
        tokenTotalSupplyEther = tokenTotalSupplyEther - totalBurnedEther;

        this.setState({
            ourSecondTokenTotalSupply: tokenTotalSupplyEther,
            ourSecondTokenMarketCap: tokenTotalSupplyEther * tokenPriceInBusd,
            totalSecondTokenBurned: totalBurnedEther,
            secondTokenTokensInYourWallet: tokensInYourWalletEther,
        })
    }



    async loadMasterChefStats() {
        //const userInfo = await this.state.MasterChefContract.methods
        let slionPerBlock = await this.state.MasterChefContract.methods.slionPerBlock().call()
        let slionPerBlockEther = window.web3.utils.fromWei(slionPerBlock, 'Ether');

        this.setState({
            slionPerBlockEther: slionPerBlockEther,
        });
    }

    async loadMasterChefMegaLionStats() {
        //const userInfo = await this.state.MasterChefContract.methods
        let mlionPerBlock = await this.state.MasterChefMegaLionContract.methods.mlionPerBlock().call()
        let mlionPerBlockEther = window.web3.utils.fromWei(mlionPerBlock, 'Ether');

        this.setState({
            mlionPerBlockEther: mlionPerBlockEther,
        });
    }

    async hasApprovedContract(masterchef, pid, type, tokenAddress) {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        let masterChefAddress = '';
        if (masterchef == 0) {
            masterChefAddress = this.state.MasterChefContract._address;
        } else if (masterchef == 1) {
            masterChefAddress = this.state.MasterChefMegaLionContract._address;
        } else {
            masterChefAddress = this.state.WBNBPoolContract._address;
        }
        /*
        console.log('masterchef');
        console.log(masterchef);

        console.log('masterChefAddress');
        console.log(masterChefAddress);
        */

        const contract = this.getContractByTypeAndAddress(type, tokenAddress);

        if (this.state.currentWallet && masterChefAddress) {
            const hasApproved = await contract.methods.allowance(this.state.currentWallet, masterChefAddress).call();
            const currentAllowance = new BigNumber(hasApproved);

            this.setState({
                ['ApprovedPid' + masterchef + '-' + pid]: currentAllowance.toString()
            });

            return currentAllowance;
        } else {
            return false;
        }
    }

    async getUserInfo(masterchef, pid, account) {
        if (account === '0x0') {
            return false;
        }

        let masterchefContract = '';
        if (masterchef == 0) {
            masterchefContract = this.state.MasterChefContract;
        } else if (masterchef == 1) {
            masterchefContract = this.state.MasterChefMegaLionContract;
        } else {
            masterchefContract = this.state.WBNBPoolContract;
        }

        let userInfo = '';
        if (masterchef == 2) {
            userInfo = await masterchefContract.methods.userInfo(account).call()
        } else {
            userInfo = await masterchefContract.methods.userInfo(pid, account).call()
        }

        let amount = 0;

        if (userInfo.hasOwnProperty('amount')) {
            amount = userInfo.amount;
        }

        this.setState({
            ['UserInfoPid' + masterchef + '-' + pid]: {
                stakedAmount: amount,
            }
        });
    }

    async getUserPendingTokens(masterchef, pid, account) {
        if (account === '0x0') {
            return false;
        }

        let rewardPendingTokens = 0;

        if (masterchef == 0) {
            rewardPendingTokens = await this.state.MasterChefContract.methods.pendingSlion(pid, account).call();
        } else if (masterchef == 1) {
            rewardPendingTokens = await this.state.MasterChefMegaLionContract.methods.pendingMlion(pid, account).call();
        } else {
            rewardPendingTokens = await this.state.WBNBPoolContract.methods.pendingReward(account).call();
        }

        this.setState({
            ['RewardPendingTokensPid' + masterchef + '-' + pid]: rewardPendingTokens
        });
    }

    async getUserWalletBalance(masterchef, pid, type, tokenAddress, account) {
        if (account === '0x0') {
            return false;
        }

        const contract = this.getContractByTypeAndAddress(type, tokenAddress);

        let walletBalance = await contract.methods.balanceOf(account).call()

        this.setState({
            ['UserWalletBalancePid' + masterchef + '-' + pid]: walletBalance
        });
    }

    getDataUserPool = (masterchef, pid) => {

        let userDataPool = {
            'approvedQty': '0',
            'stakedAmount': '0',
            'rewardDebt': '0',
        };

        if (this.state.hasOwnProperty('ApprovedPid' + masterchef + '-' + pid)) {
            userDataPool.approvedQty = this.state['ApprovedPid' + masterchef + '-' + pid];
        }

        if (this.state.hasOwnProperty('UserInfoPid' + masterchef + '-' + pid)) {
            let userInfoPid = this.state['UserInfoPid' + masterchef + '-' + pid];

            if (userInfoPid.hasOwnProperty('stakedAmount')) {
                userDataPool.stakedAmount = userInfoPid.stakedAmount;
            }
        }

        if (this.state.hasOwnProperty('RewardPendingTokensPid' + masterchef + '-' + pid)) {
            userDataPool.rewardDebt = this.state['RewardPendingTokensPid' + masterchef + '-' + pid];
        }

        return userDataPool;
    }

    getDataUserBalance = (masterchef, pid) => {
        let userWalletBalancePid = 0;

        if (this.state.hasOwnProperty('UserWalletBalancePid' + masterchef + '-' + pid)) {
            userWalletBalancePid = this.state['UserWalletBalancePid' + masterchef + '-' + pid];
        }

        return userWalletBalancePid;
    }

    getTokenPriceBySymbol = (symbol) => {
        /*
        if (this.state.hasOwnProperty('prices')) {
            if (this.state.prices.hasOwnProperty('prices')) {
                if (this.state.prices.prices.hasOwnProperty(symbol)) {
                    return this.state.prices.prices[symbol];
                } else {
                    return this.state.prices.prices['WBNB'];
                }
            }
        }
        */
        return false;
    }

    getTokenPriceByContract = (contract) => {
        contract = contract.toLowerCase();

        if (contract == SlionTokenAddress.toLowerCase()) {
            return this.state.ourTokenPrice;
        }

        if (contract == MlionTokenAddress.toLowerCase()) {
            return this.state.ourSecondTokenPrice;
        }

        if (contract == '0x35587fb890dc92cc295b4759f8159a3c7f2f3b60') {
            return 1;
        }

        if (this.state.hasOwnProperty('tokenPrices')) {
            if (this.state.tokenPrices.hasOwnProperty(contract)) {
                return this.state.tokenPrices[contract].price;
            } else {
                return 1;
            }
        }
        return false;
    }

    getPairPriceByContract = (contract) => {
        contract = contract.toLowerCase();
        if (this.state.hasOwnProperty('pairsPrices')) {
            if (this.state.pairsPrices.hasOwnProperty(contract)) {
                return this.state.pairsPrices[contract].price;
            } else {
                return 1;
            }
        }
        return false;
    }

    getPoolApy = (
        stakingTokenPrice,
        rewardTokenPrice,
        totalStaked,
        tokenPerBlock,
    ) => {
        const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
        const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
        const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)

        return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
    }

    getFarmApy = (poolWeight, cakePriceUsd, poolLiquidityUsd, tokenPerBlock) => {
        const yearlyCakeRewardAllocation = tokenPerBlock.times(BLOCKS_PER_YEAR).times(poolWeight)
        const apy = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)

        return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
    }

    transferOwnership = () => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }
        //0x72bc995Fb0b98f7Ff58B7dB66e1bA9D189F143de
        /*
        console.log('this.state.SlionTokenContract.address');
        console.log(this.state.SlionTokenContract);
        */

        this.state.MlionTokenContract.methods.transferOwnership(this.state.MasterChefMegaLionContract._address).send({
            from: this.state.currentWallet,
            //gasLimit: 200000
        }).on('transactionHash', (hash) => {

        })
        /*
        this.state.SlionTokenContract.methods.transferOwnership(this.state.MasterChefContract._address).send({
            from: this.state.currentWallet,
            //gasLimit: 200000
        }).on('transactionHash', (hash) => {

        })
         */
    }

    dev = () => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }
        //0x72bc995Fb0b98f7Ff58B7dB66e1bA9D189F143de
        /*
        console.log('this.state.SlionTokenContract.address');
        console.log(this.state.SlionTokenContract);
         */

        this.state.MasterChefContract.methods.dev('0x4Cb87b69907a9E3C6B5Fe703C9ED56f0095C1d8E').send({
            from: this.state.currentWallet,
            //gasLimit: 200000
        }).on('transactionHash', (hash) => {

        })
    }

    burnTokens = () => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        let tokensToBurn = window.web3.utils.toWei('50000', 'Ether');

        this.state.SlionTokenContract.methods.transfer('0x000000000000000000000000000000000000dEaD', tokensToBurn).send({
            from: this.state.currentWallet,
            //gasLimit: 200000
        }).on('transactionHash', (hash) => {

        })
    }

    Timelock = () => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        let moreTime = time.duration.hours(12);
        /*
        console.log(this.state.TimelockContract);
        console.log(this.state.currentWallet);
        */
        this.state.TimelockContract.methods.setDelay(moreTime).send({
            from: this.state.currentWallet,
            //gasLimit: 200000,
        }).on('transactionHash', (hash) => {

        })
    }

    getPools = () => {
        //const pendingReward = await masterChefContract.methods.pendingSlion('0', account).call()
    }

    addPool = () => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        //this.setState({ loading: true })

        //var allocPoint = 4000;
        var allocPoint = 5000;
        //var lpToken = '0x627D79f49400C8588Ba7f16b56F14eC407876554';
        var lpToken = this.state.ourTokenContract;
        var withUpdate = true;

        this.state.MasterChefContract.methods.add(allocPoint, lpToken, withUpdate).signTransaction({
            from: this.state.currentWallet,
            to: '0x4C60B46Ab519Cf08b99bAd599Ef7E7DAD634AB67'
            //gasLimit: 2000000
        }).on('transactionHash', (hash) => {

        })
    };


    setPool = (_pid, _allocPoint, _withUpdate) => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }
        //this.setState({ loading: true })

        //var _pid = 1;
        var _pid = 0;
        //var _allocPoint = 4000;
        //var _allocPoint = 4000000;
        var _allocPoint = 10000000000000;
        var _withUpdate = true;

        this.state.MasterChefContract.methods.set(_pid, _allocPoint, _withUpdate).send({
            from: this.state.currentWallet,
            //gasLimit: 2000000
        }).on('transactionHash', (hash) => {

        })
    }

    massUpdatePools = () => {
        //this.setState({ loading: true })
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        this.state.MasterChefContract.methods.massUpdatePools().send({
            from: this.state.currentWallet,
            //gasLimit: 2000000
        }).on('transactionHash', (hash) => {

        })
    }

    updatePool = (_pid) => {
        //this.setState({ loading: true })
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        this.state.MasterChefContract.methods.updatePool(_pid).send({
            from: this.state.currentWallet,
            //gasLimit: 2000000
        }).on('transactionHash', (hash) => {

        })
    }

    getContractByTypeAndAddress = (type, tokenAddress) => {
        const web3 = window.web3;

        let contract = '';

        if (type === 'lp') {
            contract = new web3.eth.Contract(this.state.lpTokenAbi, tokenAddress)
        } else {
            contract = new web3.eth.Contract(this.state.erc20Abi, tokenAddress)
        }

        return contract;
    }

    approveContract = (masterchef, type, tokenAddress) => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }
        //this.setState({ loading: true })
        const contract = this.getContractByTypeAndAddress(type, tokenAddress);

        //let amount = window.web3.utils.toWei('999999999999999', 'Ether');
        let amount = window.web3.utils.toWei('9999999999999', 'Ether');

        let masterChefAddress = '';
        if (masterchef == 0) {
            masterChefAddress = this.state.MasterChefContract._address;
        } else if (masterchef == 1) {
            masterChefAddress = this.state.MasterChefMegaLionContract._address;
        } else {
            masterChefAddress = this.state.WBNBPoolContract._address;
        }

        /*
        console.log('masterchef');
        console.log(masterchef);

        console.log('masterChefAddress');
        console.log(masterChefAddress);
        */

        contract.methods.approve(masterChefAddress, amount).send({
            from: this.state.currentWallet
        }, function(error, hash) {
            /*
            console.log('aaa');

            console.log('callllback!')
            console.log(error);
            console.log(hash);
            */
        }).on('confirmation', function(confirmationNumber, receipt) {

            if (confirmationNumber === 0) {
                if (receipt.status) {
                    notifyOk(receipt.transactionHash)
                } else {
                    notifyNoOk(receipt.transactionHash)
                }
            }
        });
    };

    deposit = (masterchef, pid, amount) => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        if (amount <= 0) {
            return false;
        }

        amount = amount.toString();
        amount = window.web3.utils.toWei(amount, 'Ether')


        let masterChefContract = '';
        if (masterchef == 0) {
            masterChefContract = this.state.MasterChefContract;
        } else if (masterchef == 1) {
            masterChefContract = this.state.MasterChefMegaLionContract;
        } else {
            masterChefContract = this.state.WBNBPoolContract;
        }

        let depositFunction = '';

        if (masterchef == 2) {
            depositFunction = masterChefContract.methods.deposit(amount);
        } else {
            let ref = this.getCookie('ref');
            depositFunction = masterChefContract.methods.deposit(pid, amount);

            if (ref) {
                depositFunction = masterChefContract.methods.deposit(pid, amount, ref);
            }
        }

        //this.setState({ loading: true })
        depositFunction.send({
            from: this.state.currentWallet,
            //gasLimit: 200000
        }).on('confirmation', function(confirmationNumber, receipt) {

            if (confirmationNumber === 0) {
                if (receipt.status) {
                    notifyOk(receipt.transactionHash)
                } else {
                    notifyNoOk(receipt.transactionHash)
                }
            }
        });
    }

    enterStaking = (amount) => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        if (amount <= 0) {
            return false;
        }

        amount = amount.toString();
        amount = window.web3.utils.toWei(amount, 'Ether')

        //this.setState({ loading: true })
        this.state.MasterChefContract.methods.enterStaking(amount).send({
                from: this.state.currentWallet,
                //gasLimit: 2000000
            })
            .on('confirmation', function(confirmationNumber, receipt) {

                if (confirmationNumber === 0) {
                    if (receipt.status) {
                        notifyOk(receipt.transactionHash)
                    } else {
                        notifyNoOk(receipt.transactionHash)
                    }
                }
            }); // If a out of gas error, the second parameter is the receipt.
    }

    leaveStaking = (amount) => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        amount = amount.toString();
        amount = window.web3.utils.toWei(amount, 'Ether');

        //this.setState({ loading: true })
        this.state.MasterChefContract.methods.leaveStaking(amount).send({
            from: this.state.currentWallet,
            //gasLimit: 2000000
        }).on('confirmation', function(confirmationNumber, receipt) {

            if (confirmationNumber === 0) {
                if (receipt.status) {
                    notifyOk(receipt.transactionHash)
                } else {
                    notifyNoOk(receipt.transactionHash)
                }
            }
        });
    }

    withdraw = (masterchef, _pid, amount) => {
        if (this.state.currentWallet === '0x0') {
            return false;
        }

        amount = amount.toString();
        amount = window.web3.utils.toWei(amount, 'Ether');

        let masterChefContract = '';
        if (masterchef == 0) {
            masterChefContract = this.state.MasterChefContract;
        } else if (masterchef == 1) {
            masterChefContract = this.state.MasterChefMegaLionContract;
        } else {
            masterChefContract = this.state.WBNBPoolContract;
        }

        let withdrawFunction = '';

        if (masterchef == 2) {
            withdrawFunction = masterChefContract.methods.withdraw(amount);
        } else {
            withdrawFunction = masterChefContract.methods.withdraw(_pid, amount);
        }

        //this.setState({ loading: true })
        withdrawFunction.send({
            from: this.state.currentWallet,
            //gasLimit: 2000000
        }).on('confirmation', function(confirmationNumber, receipt) {

            if (confirmationNumber === 0) {
                if (receipt.status) {
                    notifyOk(receipt.transactionHash)
                } else {
                    notifyNoOk(receipt.transactionHash)
                }
            }
        });
    }

    setAprToModal = (apr) => {

        let aprContent = [];

        aprContent.push( <
            h2 className = "aprHeader" >
            APR < br / >
            <
            small >
            (not APY) <
            /small> <
            /h2>
        )

        let oneDayApr = parseFloat(apr) / 365;
        let oneHour = oneDayApr / 24;
        let sevenDaysApr = oneDayApr * 7;
        let thirtyDayApr = oneDayApr * 30;

        aprContent.push( <
            table className = "aprTable" >
            <
            thead >
            <
            tr >
            <
            td className = "aprTableTextLeft" > TIME < /td> <
            td className = "aprTableTextRight" > APR < /td> <
            /tr> <
            /thead> <
            tbody > {
                /*
                                    <tr>
                                        <td className="aprTableTextLeft">1h</td>
                                        <td className="aprTableTextRight">{parseFloat(oneHour).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%</td>
                                    </tr>
                                    */
            } <
            tr >
            <
            td className = "aprTableTextLeft" > 1 d < /td> <
            td className = "aprTableTextRight" > {
                parseFloat(oneDayApr).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } % < /td> <
            /tr> <
            tr >
            <
            td className = "aprTableTextLeft" > 7 d < /td> <
            td className = "aprTableTextRight" > {
                parseFloat(sevenDaysApr).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } % < /td> <
            /tr> <
            tr >
            <
            td className = "aprTableTextLeft" > 30 d < /td> <
            td className = "aprTableTextRight" > {
                parseFloat(thirtyDayApr).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } % < /td> <
            /tr> <
            tr >
            <
            td className = "aprTableTextLeft" > 365 d < /td> <
            td className = "aprTableTextRight" > {
                parseFloat(apr).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } % < /td> <
            /tr> <
            /tbody> <
            /table>
        )


        this.setState({
            modalContent: aprContent
        });
    }

    handleOpenModal() {
        this.setState({
            showModal: true
        });
    }

    handleCloseModal() {
        this.setState({
            showModal: false
        });
    }

    /*
    loadSurvey = (callback) => {

        const existingScript = document.getElementById('surveyhero');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://embed-cdn.surveyhero.com/js/user/embed.0fa96d17.js';
            script.id = 'surveyhero';
            document.body.appendChild(script);

            script.onload = () => {
                if (callback) callback();
            };
        }

        if (existingScript && callback) callback();

    }
     */

    /*
    loadCountdown = (callback) => {
        const existingScript = document.getElementById('flipdown');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = '/flipdown.js';
            script.id = 'flipdown';
            document.body.appendChild(script);

            script.onload = () => {
                if (callback) callback();
            };
        }

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = '/countdown.js?v=2';
            script.id = 'countdown';
            document.body.appendChild(script);

            script.onload = () => {
                if (callback) callback();
            };
        }

        if (existingScript && callback) callback();
    };
    */

    render() {

        let wrongNetworkAlert = '';

        if (this.state.wrongNetwork) {
            wrongNetworkAlert = < div className = "alert alert-danger"
            role = "alert" >
                Wrong network selected, please change to Binance Smart Chain and reload this page!
                <
                /div>
        }

        return ( <
            Router >
            <
            link href = "/joseba.css?v=2"
            rel = "stylesheet" / >
            <
            div >
            <
            Menu ourTokenName = {
                this.state.ourTokenName
            }
            ourTokenPrice = {
                this.state.ourTokenPrice
            }
            ourTokenContract = {
                this.state.ourTokenContract
            }

            ourSecondTokenName = {
                this.state.ourSecondTokenName
            }
            ourSecondTokenPrice = {
                this.state.ourSecondTokenPrice
            }
            ourSecondTokenContract = {
                this.state.ourSecondTokenContract
            }

            account = {
                this.state.currentWallet
            }
            connectWalletConnect = {
                this.connectWalletConnect.bind(this)
            }
            disconnectWallet = {
                this.disconnectWallet.bind(this)
            }
            defiName = {
                this.state.defiName
            }
            /> <
            div id = "subMenu" >
            <
            div id = "icons" >
            <
            a target = "_blank"
            href = "https://twitter.com/SuperLionBSC" >
            <
            img src = {
                require('../icons/twitter.svg')
            }
            alt = "" / >
            <
            /a> <
            a target = "_blank"
            href = "https://t.me/superlionfinance" >
            <
            img src = {
                require('../icons/telegram.svg')
            }
            alt = "" / >
            <
            /a> <
            a target = "_blank"
            href = "https://github.com/SuperLionFinance/" >
            <
            img src = {
                require('../icons/github.svg')
            }
            alt = "" / >
            <
            /a> <
            /div> <
            /div>

            {
                /*
                                    <button onClick={(event => {
                                        event.preventDefault()
                                        console.log('aaaaa')
                                        this.transferOwnership()
                                    })}>
                                        transferOwnership MLion
                                    </button>

                                    <button onClick={(event => {
                                        event.preventDefault()
                                        this.Timelock()
                                    })}>
                                            Timelock
                                    </button>

                                    <button onClick={(event => {
                                        event.preventDefault()
                                        this.burnTokens()
                                    })}>
                                        Burn Tokens
                                    </button>

                                    <button onClick={(event => {
                                        event.preventDefault()
                                        console.log('aaaaa')
                                        this.transferOwnership()
                                    })}>
                                        transferOwnership SLion
                                    </button>
                                    <button onClick={(event => {
                                        event.preventDefault()
                                        this.dev()
                                    })}>
                                        dev MasterChef to Timelock
                                    </button>


                                    <button
                                        className="btn btn-success btn-block"
                                        onClick={(event => {
                                            event.preventDefault();
                                            this.addPool();
                                        })}
                                    >
                                        Add Pool
                                    </button>

                                    <button
                                        className="btn btn-success btn-block"
                                        onClick={(event => {
                                            event.preventDefault();
                                            this.setPool(0, 9999, 0);
                                        })}
                                    >
                                        Set Pool
                                    </button>

                                    <button
                                        className="btn btn-success btn-block"
                                        onClick={(event => {
                                            event.preventDefault();
                                            this.massUpdatePools();
                                        })}
                                    >
                                        massUpdatePools
                                    </button>
                                    */
            }

            <
            div className = "container-fluid mt-5" >
            <
            div className = "row" >
            <
            main role = "main"
            className = "col-12 ml-auto mr-auto" >
            <
            div className = "content mr-auto ml-auto" >
            <
            a href = "/"
            rel = "noopener noreferrer" >
            <
            /a>

            <
            div className = "text-center" >
            Superlion bears no responsibility or liability
            for any loss which users may experience.Always DYOR before investing. <
            /div>

            {
                /*
                                                    <div className="alert alert-danger text-center" role="alert">
                                                        {/*<p>Are you in favor of creating a BURNING POOL that receives a large part of the SLIONs generated, burning 100% of the tokens generated in that pool, to try to stop the great inflation?</p>*/
            } {
                /*
                                                        <p className="text-center">The BURNING POOL survey has now ended.</p>
                                                        <p className="text-center">The winning vote is YES, with 81.55%, of a total of 3041 votes.</p>
                                                        <p>
                                                            {/*<a target="_blank" className="btn btn-danger btn-block" href="https://surveyhero.com/c/cb44a854">VOTE NOW!</a>*/
            } { /*<div id="surveyhero-embed-0fa96d17"></div>*/ } {
                /*
                                                        </p>
                                                        <p>
                                                            <a className="btn btn-danger btn-block" target="_blank" href="https://surveyhero.com/results/479411/ce739e587b321c9fdf9d1e214d634ad6">VIEW RESULTS</a>
                                                        </p>
                                                    </div>
                                                    */
            }

            {
                wrongNetworkAlert
            }

            {
                /*
                                                    <div className="alert alert-success text-center" role="alert">
                                                        <p>Earn <strong>MLION POOLS</strong> rewards pools <strong>are active</strong> since block: #<a target="_blank" href="https://bscscan.com/block/countdown/7054000">7054000</a><br/><em>Sat May 01 2021 22:57:32 GMT+0200</em></p>
                                                    </div>

                                                    <div className="alert alert-danger text-center" role="alert">
                                                        <p>Rewards at <strong>SLION Pools and Farms</strong> will start (block #<a target="_blank" href="https://bscscan.com/block/countdown/7223000">7223000</a>)<br /><em>Fri May 07 2021 21:54:47 GMT+0200</em></p>
                                                    </div>
                                                    */
            }

            {
                /*
                                                    <div id="globalContainerRewardsAtPoolsAndFarms">
                                                        <div id="rewardsAtPoolsAndFarmsWillStartIn">
                                                            <strong>ATTENTION!</strong>
                                                            <div className="alert alert-success" role="alert">
                                                                <p>Earn <strong>MLION POOLS</strong> rewards pools <strong>are active</strong> since block: #<a target="_blank" href="https://bscscan.com/block/countdown/7054000">7054000</a><br/><em>Sat May 01 2021 22:57:32 GMT+0200</em></p>
                                                            </div>

                                                            <div className="alert alert-danger" role="alert">
                                                                <p>Rewards at <strong>SLION Pools and Farms</strong> will start (block #<a target="_blank" href="https://bscscan.com/block/countdown/7223000">7223000</a>)<br /><em>Fri May 07 2021 19:46:32 GMT+0200</em></p>
                                                            </div>

                                                        </div>

                                                        <div id="flipdown" className="flipdown"></div>

                                                    </div>
                                                    */
            }

            <
            Switch >
            <
            Route exact path = "/" >
            <
            Home defiName = {
                this.state.defiName
            }

            ourTokenName = {
                this.state.ourTokenName
            }
            ourTokenPrice = {
                this.state.ourTokenPrice
            }
            ourTokenContract = {
                this.state.ourTokenContract
            }
            tokenTotalSupply = {
                this.state.tokenTotalSupply
            }
            totalTokenBurned = {
                this.state.totalTokenBurned
            }
            marketCap = {
                this.state.marketCap
            }
            slionPerBlockEther = {
                this.state.slionPerBlockEther
            }
            tokensInYourWallet = {
                this.state.tokensInYourWallet
            }

            ourSecondTokenName = {
                this.state.ourSecondTokenName
            }
            ourSecondTokenPrice = {
                this.state.ourSecondTokenPrice
            }
            ourSecondTokenContract = {
                this.state.ourSecondTokenContract
            }
            ourSecondTokenTotalSupply = {
                this.state.ourSecondTokenTotalSupply
            }
            totalSecondTokenBurned = {
                this.state.totalSecondTokenBurned
            }
            ourSecondTokenMarketCap = {
                this.state.ourSecondTokenMarketCap
            }
            mlionPerBlockEther = {
                this.state.mlionPerBlockEther
            }
            secondTokenTokensInYourWallet = {
                this.state.secondTokenTokensInYourWallet
            }

            tvl = {
                this.state.tvl
            }

            pools = {
                this.state.pools
            }

            getDataUserPool = {
                this.getDataUserPool.bind(this)
            }

            withdraw = {
                this.withdraw.bind(this)
            }
            /> <
            /Route> <
            Route path = "/farm" >
            <
            Farms native = "1"
            approveContract = {
                this.approveContract.bind(this)
            }
            deposit = {
                this.deposit.bind(this)
            }
            withdraw = {
                this.withdraw.bind(this)
            }
            enterStaking = {
                this.enterStaking.bind(this)
            }
            leaveStaking = {
                this.leaveStaking.bind(this)
            }
            connectWalletConnect = {
                this.connectWalletConnect.bind(this)
            }
            hasApprovedContract = {
                this.hasApprovedContract.bind(this)
            }
            getDataUserPool = {
                this.getDataUserPool.bind(this)
            }
            getDataUserBalance = {
                this.getDataUserBalance.bind(this)
            }
            getPoolInfo = {
                this.getPoolInfo.bind(this)
            }
            getLiquidityPools = {
                this.getLiquidityPools.bind(this)
            }
            handleOpenModal = {
                this.handleOpenModal.bind(this)
            }
            setAprToModal = {
                this.setAprToModal.bind(this)
            }
            getFarmApy = {
                this.getFarmApy.bind(this)
            }
            getPoolApy = {
                this.getPoolApy.bind(this)
            }
            getTokenPriceBySymbol = {
                this.getTokenPriceBySymbol.bind(this)
            }
            getTokenPriceByContract = {
                this.getTokenPriceByContract.bind(this)
            }
            getPairPriceByContract = {
                this.getPairPriceByContract.bind(this)
            }
            account = {
                this.state.currentWallet
            }
            ourTokenName = {
                this.state.ourTokenName
            }
            ourTokenPrice = {
                this.state.ourTokenPrice
            }
            pools = {
                this.state.pools
            }
            slionPerBlockEther = {
                this.state.slionPerBlockEther
            }
            totalAllocPoint = {
                this.state.totalAllocPoint
            }
            ourSecondTotalAllocPoint = {
                this.state.ourSecondTotalAllocPoint
            }

            ourSecondTokenName = {
                this.state.ourSecondTokenName
            }
            ourSecondTokenPrice = {
                this.state.ourSecondTokenPrice
            }
            ourSecondTokenContract = {
                this.state.ourSecondTokenContract
            }
            mlionPerBlockEther = {
                this.state.mlionPerBlockEther
            }
            /> <
            /Route> <
            Route path = "/farm-non-native" >
            <
            Farms native = "0"
            approveContract = {
                this.approveContract.bind(this)
            }
            deposit = {
                this.deposit.bind(this)
            }
            withdraw = {
                this.withdraw.bind(this)
            }
            enterStaking = {
                this.enterStaking.bind(this)
            }
            leaveStaking = {
                this.leaveStaking.bind(this)
            }
            connectWalletConnect = {
                this.connectWalletConnect.bind(this)
            }
            hasApprovedContract = {
                this.hasApprovedContract.bind(this)
            }
            getDataUserPool = {
                this.getDataUserPool.bind(this)
            }
            getDataUserBalance = {
                this.getDataUserBalance.bind(this)
            }
            getPoolInfo = {
                this.getPoolInfo.bind(this)
            }
            getLiquidityPools = {
                this.getLiquidityPools.bind(this)
            }
            handleOpenModal = {
                this.handleOpenModal.bind(this)
            }
            setAprToModal = {
                this.setAprToModal.bind(this)
            }
            getFarmApy = {
                this.getFarmApy.bind(this)
            }
            getPoolApy = {
                this.getPoolApy.bind(this)
            }
            getTokenPriceBySymbol = {
                this.getTokenPriceBySymbol.bind(this)
            }
            getTokenPriceByContract = {
                this.getTokenPriceByContract.bind(this)
            }
            getPairPriceByContract = {
                this.getPairPriceByContract.bind(this)
            }
            account = {
                this.state.currentWallet
            }
            ourTokenName = {
                this.state.ourTokenName
            }
            ourTokenPrice = {
                this.state.ourTokenPrice
            }
            pools = {
                this.state.pools
            }
            slionPerBlockEther = {
                this.state.slionPerBlockEther
            }
            totalAllocPoint = {
                this.state.totalAllocPoint
            }
            ourSecondTotalAllocPoint = {
                this.state.ourSecondTotalAllocPoint
            }

            ourSecondTokenName = {
                this.state.ourSecondTokenName
            }
            ourSecondTokenPrice = {
                this.state.ourSecondTokenPrice
            }
            ourSecondTokenContract = {
                this.state.ourSecondTokenContract
            }
            mlionPerBlockEther = {
                this.state.mlionPerBlockEther
            }
            /> <
            /Route> <
            Route path = "/pool" >
            <
            Pools native = "1"
            approveContract = {
                this.approveContract.bind(this)
            }
            deposit = {
                this.deposit.bind(this)
            }
            withdraw = {
                this.withdraw.bind(this)
            }
            enterStaking = {
                this.enterStaking.bind(this)
            }
            leaveStaking = {
                this.leaveStaking.bind(this)
            }
            connectWalletConnect = {
                this.connectWalletConnect.bind(this)
            }
            hasApprovedContract = {
                this.hasApprovedContract.bind(this)
            }
            getDataUserPool = {
                this.getDataUserPool.bind(this)
            }
            getDataUserBalance = {
                this.getDataUserBalance.bind(this)
            }
            getPoolInfo = {
                this.getPoolInfo.bind(this)
            }
            getLiquidityPools = {
                this.getLiquidityPools.bind(this)
            }
            handleOpenModal = {
                this.handleOpenModal.bind(this)
            }
            setAprToModal = {
                this.setAprToModal.bind(this)
            }
            getFarmApy = {
                this.getFarmApy.bind(this)
            }
            getPoolApy = {
                this.getPoolApy.bind(this)
            }
            getTokenPriceBySymbol = {
                this.getTokenPriceBySymbol.bind(this)
            }
            getTokenPriceByContract = {
                this.getTokenPriceByContract.bind(this)
            }
            getPairPriceByContract = {
                this.getPairPriceByContract.bind(this)
            }
            account = {
                this.state.currentWallet
            }
            ourTokenName = {
                this.state.ourTokenName
            }
            ourTokenPrice = {
                this.state.ourTokenPrice
            }
            pools = {
                this.state.pools
            }
            slionPerBlockEther = {
                this.state.slionPerBlockEther
            }
            totalAllocPoint = {
                this.state.totalAllocPoint
            }
            ourSecondTotalAllocPoint = {
                this.state.ourSecondTotalAllocPoint
            }

            ourSecondTokenName = {
                this.state.ourSecondTokenName
            }
            ourSecondTokenPrice = {
                this.state.ourSecondTokenPrice
            }
            ourSecondTokenContract = {
                this.state.ourSecondTokenContract
            }
            mlionPerBlockEther = {
                this.state.mlionPerBlockEther
            }

            currentBlock = {
                this.state.currentBlock
            }
            bnbPrice = {
                this.state.bnbPrice
            }
            /> <
            /Route> <
            Route path = "/pool-non-native" >
            <
            Pools native = "0"
            approveContract = {
                this.approveContract.bind(this)
            }
            deposit = {
                this.deposit.bind(this)
            }
            withdraw = {
                this.withdraw.bind(this)
            }
            enterStaking = {
                this.enterStaking.bind(this)
            }
            leaveStaking = {
                this.leaveStaking.bind(this)
            }
            connectWalletConnect = {
                this.connectWalletConnect.bind(this)
            }
            hasApprovedContract = {
                this.hasApprovedContract.bind(this)
            }
            getDataUserPool = {
                this.getDataUserPool.bind(this)
            }
            getDataUserBalance = {
                this.getDataUserBalance.bind(this)
            }
            getPoolInfo = {
                this.getPoolInfo.bind(this)
            }
            getLiquidityPools = {
                this.getLiquidityPools.bind(this)
            }
            handleOpenModal = {
                this.handleOpenModal.bind(this)
            }
            setAprToModal = {
                this.setAprToModal.bind(this)
            }
            getFarmApy = {
                this.getFarmApy.bind(this)
            }
            getPoolApy = {
                this.getPoolApy.bind(this)
            }
            getTokenPriceBySymbol = {
                this.getTokenPriceBySymbol.bind(this)
            }
            getTokenPriceByContract = {
                this.getTokenPriceByContract.bind(this)
            }
            getPairPriceByContract = {
                this.getPairPriceByContract.bind(this)
            }
            account = {
                this.state.currentWallet
            }
            ourTokenName = {
                this.state.ourTokenName
            }
            ourTokenPrice = {
                this.state.ourTokenPrice
            }
            pools = {
                this.state.pools
            }
            slionPerBlockEther = {
                this.state.slionPerBlockEther
            }
            totalAllocPoint = {
                this.state.totalAllocPoint
            }
            ourSecondTotalAllocPoint = {
                this.state.ourSecondTotalAllocPoint
            }

            ourSecondTokenName = {
                this.state.ourSecondTokenName
            }
            ourSecondTokenPrice = {
                this.state.ourSecondTokenPrice
            }
            ourSecondTokenContract = {
                this.state.ourSecondTokenContract
            }
            mlionPerBlockEther = {
                this.state.mlionPerBlockEther
            }
            /> <
            /Route> <
            Route path = "/referral" >
            <
            Referral connectWalletConnect = {
                this.connectWalletConnect.bind(this)
            }
            account = {
                this.state.currentWallet
            }
            ourTokenName = {
                this.state.ourTokenName
            }
            defiName = {
                this.state.defiName
            }
            defiUrl = {
                this.state.defiUrl
            }

            whoHasReferredMe = {
                this.state.whoHasReferredMe
            }
            referredCount = {
                this.state.referredCount
            }
            /> <
            /Route> <
            Route path = "/audit" >
            <
            Audit / >
            <
            /Route> <
            /Switch>

            <
            /div> <
            /main> <
            /div> <
            /div>

            <
            ReactModal key = "modal"
            isOpen = {
                this.state.showModal
            }
            contentLabel = "Minimal Modal Example" >
            <
            button className = "btn btn-block btn-primary"
            onClick = {
                this.handleCloseModal
            } > Close < /button> {
                this.state.modalContent
            } <
            /ReactModal>

            <
            ToastContainer / >

            <
            footer className = "text-center" >
            <
            div id = "auditedByContainer" >
            <
            div className = "auditedByTitle" >
            Audited by <
            /div> <
            div className = "auditedByAuditors" > {
                /*
                                                <a target="_blank" href="">
                                                    Certik
                                                </a><br />
                                                */
            } <
            a target = "_blank"
            href = "https://github.com/SuperLionFinance/audit/blob/main/techrate-SuperLion%20Finance.pdf" > ✅TechRate <
            small > (paid version) < /small> <
            /a> <
            /div> <
            /div> <
            /footer> <
            /div> <
            /Router>
        );
    }
}

export default App;