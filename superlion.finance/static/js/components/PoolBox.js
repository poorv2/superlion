import React, {
    Component
} from 'react'
import Calculator from '../img/calculator.svg'
import BigNumber from "bignumber.js";


class PoolBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 'deposit',
            amountInput: 0,
            inputMax: 0,
        }
    }

    selectDeposit = () => {
        this.setState({
            activeIndex: 'deposit',
            amountInput: 0,
        })
    }

    selectWithdraw = () => {
        this.setState({
            activeIndex: 'withdraw',
            amountInput: 0,
        })
    }

    render() {

        let index = this.props.index;
        let value = this.props.value;
        let pid = value.pid;

        let totalAllocPoint = 1000;

        if (value.masterchef == 0) {
            totalAllocPoint = this.props.totalAllocPoint;
        } else if (value.masterchef == 1) {
            totalAllocPoint = this.props.ourSecondTotalAllocPoint;
        } else if (value.masterchef == 2) {
            totalAllocPoint = 1000;
        }

        let poolInfo = this.props.getPoolInfo(value.masterchef, pid);
        //let liquidityPoolsData = this.props.getLiquidityPools(pid);

        /*
        console.log('poolInfo ' + index);
        console.log(poolInfo);
        */

        let poolName = value.token1Name;
        //let image2 = '';

        let type = 'token';
        let typeName = '';
        let aprOrApyTxt = 'APR';
        if (value.token2Name) {
            poolName += '-' + value.token2Name;
            //image2 += require('../tokens/' + value.token2Name.toLowerCase() + '.png');
            type = 'lp';
            typeName = 'LP';
            //aprOrApyTxt = 'APY';
        }

        let apr = 0;


        let tokenPerBlock = this.props.slionPerBlockEther;
        if (value.masterchef == 1) {
            tokenPerBlock = this.props.mlionPerBlockEther;
        } else if (value.masterchef == 2) {
            tokenPerBlock = 0.000034722222222;
        }


        /*
        let accSlionPerShareEther = window.web3.utils.fromWei(poolInfo.accSlionPerShare, 'Ether');
        console.log('accSlionPerShareEther');
        console.log(accSlionPerShareEther);
        */

        /*
        CAKE EXAMPLE
        let stakingTokenPrice = 22;
        let rewardTokenPrice = 22;
        let totalStaked = 104955057.666;
        let tokenPerBlockPool = 10;
         */

        let multiplier = 1;
        //let stakingTokenPrice = 1;
        //let rewardTokenPrice = 1;

        //let stakingTokenPrice = this.props.getTokenPriceBySymbol(liquidityPoolsData.tokenSymbol);
        /*
        let stakingTokenPrice = value.lpPrice;
        if (value.pid == 0) {
            stakingTokenPrice = this.props.ourTokenPrice;
        } else if (type === 'token') {
            stakingTokenPrice = this.props.getTokenPriceByContract(value.lpToken);
        } else {
            stakingTokenPrice = this.props.getPairPriceByContract(value.lpToken);
        }
        */

        let stakingTokenPrice = value.lpPrice;

        let poolStakingTokenPrice = 'Loading...';
        if (stakingTokenPrice) {
            poolStakingTokenPrice = parseFloat(stakingTokenPrice).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

        let rewardTokenPrice = this.props.ourTokenPrice;

        if (value.masterchef == 1) {
            rewardTokenPrice = this.props.ourSecondTokenPrice;
        }

        if (value.masterchef == 2) {
            rewardTokenPrice = this.props.bnbPrice;
        }

        //let totalStaked = liquidityPoolsData.tokensBalance;
        let totalStaked = value.tokensBalance;
        if (totalStaked < 0.01) {
            totalStaked = 0.0001
        }
        let tokenPerBlockPool = tokenPerBlock * poolInfo.allocPoint / totalAllocPoint;
        /*
        console.log('!!!!-- ( ' + index + ' ) --!!!');
        console.log(stakingTokenPrice);
        console.log(rewardTokenPrice);
        */

        //multiplier.mul(slionPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        //1 *
        //multiplier * slionPerBlock * poolAllocPoint / totalAllocPointInt

        if (type === 'token') {

            /*
            console.log('aaaaa');

            if (value.masterchef == 2) {
                if (typeof stakingTokenPrice != 'undefined') {
                    alert('stakingTokenPrice:' + stakingTokenPrice);
                    alert('rewardTokenPrice:' + rewardTokenPrice);
                    alert('totalStaked:' + totalStaked);
                    alert('tokenPerBlockPool:' + tokenPerBlockPool);
                }

            }
            */


            apr = this.props.getPoolApy(
                stakingTokenPrice,
                rewardTokenPrice,
                totalStaked,
                tokenPerBlockPool,
            );
        } else {

            let poolWeight = poolInfo.allocPoint / totalAllocPoint;
            //let poolLiquidityUsd = liquidityPoolsData.tokensBalanceInBusd;
            let poolLiquidityUsd = value.tokensBalanceInBusd;
            if (poolLiquidityUsd < 0.01) {
                poolLiquidityUsd = 0.001;
            }

            /*
            console.log('!!!!getFarmApy');
            console.log(poolWeight);
            console.log(rewardTokenPrice);
            console.log(poolLiquidityUsd);
            */

            apr = this.props.getFarmApy(
                poolWeight,
                rewardTokenPrice,
                poolLiquidityUsd,
                new BigNumber(tokenPerBlock)
            );
        }

        let poolApr = 0;
        if (apr) {
            poolApr = parseFloat(apr).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            poolApr = 'Loading...';
        }

        let mainButton = < button
        className = "btn btn-block btn-primary unlockWalletButton"
        onClick = {
                (event => {
                    event.preventDefault();
                    this.props.connectWalletConnect(true);
                })
            } >
            Connect Wallet <
            /button>;

        let harvestButton = <
            button className = "btn btn-secondary disabled harvestButton"
        disabled = "disabled" >
            Harvest <
            /button>;

        let compoundButton = '';


        if (value.pid === 0 && value.masterchef != 2) {
            compoundButton = < button className = "btn btn-secondary disabled compoundButton"
            disabled = "disabled" >
                Compound <
                /button>;
        }

        let canOperate = false;

        let dataUserPool = this.props.getDataUserPool(value.masterchef, value.pid);
        let getDataUserBalance = this.props.getDataUserBalance(value.masterchef, value.pid);



        let mlionWalletBalanceText = '';
        let poolWarning = '';
        if (value.masterchef == 2) {
            mlionWalletBalanceText = 'MLION Wallet Balance: ' + parseFloat(window.web3.utils.fromWei(this.props.getDataUserBalance(1, 0).toString())).toFixed(5).toString() + ' / 0.05';
            poolWarning = < div className = "alert alert-danger"
            role = "alert" >
                <
                small >
                ATTENTION!
                You must have at least 0.05 MLION in your wallet to deposit and withdraw from this pool. <
                /small> <
                /div>
        }

        if (this.props.account !== '0x0') {

            if (dataUserPool.approvedQty != 0) {
                /*
                mainButton = <button
                    className="btn btn-block btn-success approveButton"
                    onClick={(event => {
                        event.preventDefault();
                        //this.props.approveContract(type, value.lpToken);
                    })}
                >
                    Stake
                </button>
                */
                mainButton = ''
                canOperate = true;

                if (this.state.activeIndex == 'deposit') {

                    let userBalance = parseFloat(window.web3.utils.fromWei(getDataUserBalance.toString(), 'Ether'));

                    if (userBalance != this.state.inputMax) {
                        this.setState({
                            inputMax: userBalance
                        })
                    }

                } else {

                    let stakedAmountMax = window.web3.utils.fromWei(dataUserPool.stakedAmount, 'Ether');

                    if (stakedAmountMax != this.state.inputMax) {
                        this.setState({
                            inputMax: stakedAmountMax
                        })
                    }

                }

            } else {

                mainButton = < button
                className = "btn btn-block btn-primary approveButton"
                onClick = {
                        (event => {
                            event.preventDefault();
                            this.props.approveContract(value.masterchef, type, value.lpToken);
                        })
                    } >
                    Approve <
                    /button>
            }

            if (dataUserPool.rewardDebt > 0) {
                harvestButton = <
                    button
                className = "btn btn-primary harvestButton"
                onClick = {
                        (event => {
                            event.preventDefault()
                            let amount
                            amount = '0';

                            {
                                /*
                                                            if (value.pid === 0) {
                                                                this.props.leaveStaking(amount)
                                                            } else {*/
                            }
                            this.props.withdraw(value.masterchef, value.pid, amount) { /*}*/ }
                        })
                    } >
                    Harvest <
                    /button>;


                if (value.pid === 0 && value.masterchef != 2) {
                    compoundButton = < button
                    className = "btn btn-primary compoundButton"
                    onClick = {
                            (event => {
                                event.preventDefault()
                                let amount
                                amount = window.web3.utils.fromWei(dataUserPool.rewardDebt, 'Ether');
                                //amount = 1;
                                /*
                                console.log('compound amount')
                                console.log(amount);
                                */
                                this.props.deposit(value.masterchef, value.pid, amount);
                            })
                        } >
                        Compound <
                        /button>
                }
            }
        }

        if (this.state.activeIndex === 'deposit') {
            let userBalance = window.web3.utils.fromWei(getDataUserBalance.toString(), 'Ether');
            if (this.state.amountInput > userBalance) {
                //this.state.amountInput = userBalance;
                this.state.maxAmountInput = userBalance;
            }
        } else {
            let stakedAmount = window.web3.utils.fromWei(dataUserPool.stakedAmount, 'Ether');
            if (this.state.amountInput > stakedAmount) {
                //this.state.amountInput = stakedAmount;
                this.state.maxAmountInput = stakedAmount;
            }
        }

        let operateContent = '';
        if (!canOperate) {

            operateContent = < div className = "col-12 mainButtonPoolContainer" > {
                    mainButton
                } <
                /div>

        } else {

            let depositClass = '';
            let withdrawClass = '';

            if (this.state.activeIndex === 'deposit') {
                depositClass = 'active';
                withdrawClass = '';
            } else {
                depositClass = '';
                withdrawClass = 'active';
            }

            let operationButton = '';

            if (this.state.activeIndex === 'deposit') {
                operationButton = <
                    button
                className = "depositButton btn btn-block btn-primary"
                onClick = {
                        (event => {
                            event.preventDefault()
                            let amount
                            //amount = this.input.value.toString()
                            amount = this.state.amountInput; {
                                /*
                                                            if (value.pid === 0) {
                                                                this.props.enterStaking(amount)
                                                            } else {*/
                            }
                            this.props.deposit(value.masterchef, value.pid, amount) { /*}*/ }
                        })
                    } >
                    Deposit <
                    /button>;
            } else {
                operationButton = <
                    button
                className = "depositButton btn btn-block btn-primary"
                onClick = {
                        (event => {
                            event.preventDefault()
                            let amount
                            amount = this.state.amountInput; {
                                /*
                                                            if (value.pid === 0) {
                                                                this.props.leaveStaking(amount)
                                                            } else {*/
                            }
                            this.props.withdraw(value.masterchef, value.pid, amount) { /*}*/ }
                        })
                    } >
                    Withdraw & Harvest <
                    /button>;
            }

            operateContent = <
                div className = "col-12 operatePoolContainer" >
                <
                div className = "operatorLinksRow row" >
                <
                div className = "operatorLinksCol col-12" >
                <
                a href = "javascript:void(0);"
            index = 'deposit'
            className = {
                depositClass + ' depositLink'
            }
            onClick = {
                    this.selectDeposit
                } > Deposit < /a> <
                span className = "separatorOperatePoolContainer" > | < /span> <
                a href = "javascript:void(0);"
            index = 'withdraw'
            className = {
                withdrawClass + ' withdrawLink'
            }
            onClick = {
                    this.selectWithdraw
                } > Withdraw < /a> <
                /div> <
                /div>

                <
                div className = "operatorFormContainerRow row" >
                <
                div className = "operatorFormContainerCol col-12" >
                <
                div className = "tokenInputContainer" >
                <
                input
            className = "tokenInput"
            value = {
                this.state.amountInput
            }
            type = "number"
            onChange = {
                (event => {
                    //event.preventDefault();
                    //max={this.state.maxAmountInput
                    let amount = event.target.value;

                    if (amount > this.state.inputMax) {
                        amount = this.state.inputMax;
                    }

                    if (amount < 0) {
                        amount = 0;
                    }

                    /*
                    if (event.target.value > this.state.maxAmountInput) {
                        amount = this.state.maxAmountInput;
                    }
                     */

                    this.setState({
                        amountInput: amount
                    })
                })
            }

            max = {
                this.state.inputMax
            }
            /> <
            div className = "poolNameTokenInputContainer" > {
                    poolName
                } <
                /div> <
                div className = "maxButtonContainer" >
                <
                a
            className = "maxButton btn btn-primary"
            href = ""
            onClick = {
                    (event => {
                        event.preventDefault();

                        let maxValueEther = 0;
                        if (this.state.activeIndex === 'deposit') {
                            maxValueEther = window.web3.utils.fromWei(getDataUserBalance.toString(), 'Ether')
                        } else {
                            maxValueEther = window.web3.utils.fromWei(dataUserPool.stakedAmount, 'Ether')
                        }

                        this.setState({
                            amountInput: maxValueEther
                        })
                    })
                }

                >
                MAX < /a> <
                /div> <
                /div> <
                div className = "walletBalance" >
                Wallet balance: {
                    parseFloat(window.web3.utils.fromWei(getDataUserBalance.toString(), 'Ether')).toFixed(5).toString()
                } {
                    poolName
                } <
                /div> <
                div className = "walletBalance" >
                <
                strong > {
                    mlionWalletBalanceText
                } < /strong> <
                /div> <
                div className = "operationButton" > {
                    operationButton
                } <
                /div> <
                /div> <
                /div>

                <
                /div>
        }


        let getOnPancakeLink = 'https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=' + value.token1Contract;

        if (value.token2Name) {
            getOnPancakeLink = 'https://exchange.pancakeswap.finance/#/add/' + value.token1Contract + '/' + value.token2Contract;
        }

        let remainingBlocks = null;

        if (value.masterchef == 2) {
            poolInfo.depositFeeBP = 1000;
            /*
            console.log('this.props.currentBlock');
            console.log(this.props.currentBlock);

            console.log('poolInfo.bonusEndBlock');
            console.log(poolInfo.bonusEndBlock);
            */
            remainingBlocks = poolInfo.bonusEndBlock - this.props.currentBlock;

            if (remainingBlocks < 0) {
                remainingBlocks = 0;
            }
        }

        let depositFeePercent = -1;
        if (poolInfo.depositFeeBP) {
            depositFeePercent = poolInfo.depositFeeBP / 100
        }

        let poolDepositFeePercent;
        if (depositFeePercent >= 0) {
            poolDepositFeePercent = depositFeePercent;
        } else {
            poolDepositFeePercent = 'Loading...';
        }



        let noFeeTag = '';
        if (depositFeePercent == 0) {
            noFeeTag = < span className = "infoTag" >
                No fee <
                /span>;
        }

        let poolTotalLiquidity = 'Loading...'
        if (typeof value.tokensBalanceInBusd != 'undefined') {
            poolTotalLiquidity = parseFloat(value.tokensBalanceInBusd).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        let tokensPools = value.pid;

        if (value.masterchef == 1) {
            tokensPools = value.masterchef + '-' + value.pid;
        }

        let earnTokenName = this.props.ourTokenName;
        if (value.masterchef == 1) {
            earnTokenName = this.props.ourSecondTokenName;
        }

        if (value.masterchef == 2) {
            earnTokenName = < strong style = {
                {
                    color: 'orange'
                }
            } > WBNB < /strong>;
        }

        //let activeBadge = '';

        let activeBadge = < span className = "badge bg-success" > Active < /span>;
        /*
        let activeBadge = <span className="badge bg-danger">Starts May 07</span>;

        if (value.masterchef == 1) {
            activeBadge = <span className="badge bg-success">Active</span>;
        }
        */

        let calculatorLinkElement = < a href = ""
        onClick = {
                (event => {
                    event.preventDefault();
                    this.props.setAprToModal(apr)
                    this.props.handleOpenModal()
                })
            } >
            <
            img src = {
                Calculator
            }
        alt = "" / >
            <
            /a>

        /*
        if (type == 'lp') {
            calculatorLinkElement = '';
        }
        */

        let depositFeeText = 'Deposit Fee:';

        if (value.masterchef == 2) {
            depositFeeText = 'BURN Deposit Fee:';
        }

        let remainingBlocksText = ''
        if (remainingBlocks !== null) {
            remainingBlocks = remainingBlocks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            remainingBlocksText = remainingBlocks + ' remaining blocks'
            /* (' + poolInfo.bonusEndBlock + ' - ' + this.props.currentBlock + ')*/
        }

        let poolNameTitle = poolName;
        if (value.masterchef == 2) {
            poolNameTitle = < span > SLION < small > earn WBNB < /small></span >
        }

        return ( <
            div key = {
                'PoolBox' + value.masterchef + '-' + value.pid
            }
            className = "col-12 col-md-4 singleContainerPool" >
            <
            div className = "row singleContainerPoolRow" > {
                poolWarning
            } <
            div className = "col-4 iconsContainer" >
            <
            img style = {
                {
                    width: '50px'
                }
            }
            src = {
                require('../tokens-pools/' + tokensPools + '.png')
            }
            alt = "" / >
            <
            /div> <
            div className = "col-8 poolRightTopInfo text-right" >
            <
            div className = "poolName" > {
                poolNameTitle
            } <
            /div> <
            div className = "tagsContainer" > {
                noFeeTag
            } <
            span className = "badge bg-primary" >
            x {
                poolInfo.allocPoint / 100
            } <
            /span> <
            /div> <
            div className = "text-right activeBadgeContainer" > {
                activeBadge
            } <
            /div> <
            /div> <
            div className = "col-12 aprContainer" >
            <
            div className = "row" >
            <
            div className = "aprTextContainer col-4" > {
                aprOrApyTxt
            }:
            <
            /div> <
            div className = "aprValueContainer col-8 text-right" > {
                calculatorLinkElement
            } {
                poolApr
            } %
            <
            /div> <
            /div> <
            /div> <
            div className = "col-12 earnContainer" >
            <
            div className = "row" >
            <
            div className = "earnTextContainer col-6" >
            Earn:
            <
            /div> <
            div className = "earnValueContainer col-6 text-right" > {
                earnTokenName
            } <
            /div> <
            /div> <
            /div> <
            div className = "col-12 depositFeeContainer" >
            <
            div className = "row" >
            <
            div className = "depositFeeTextContainer col-6" > {
                depositFeeText
            } <
            /div> <
            div className = "depositFeeValueContainer col-6 text-right" > {
                poolDepositFeePercent
            } %
            <
            /div> <
            /div> <
            /div> <
            div className = "col-12 earnedContainer" >
            <
            div className = "row" >
            <
            div className = "earnedTextContainer col-6" > {
                earnTokenName
            }
            earned: < br / >
            <
            div className = "amoundEarned" > {
                parseFloat(window.web3.utils.fromWei(dataUserPool.rewardDebt.toString(), 'Ether')).toFixed(7).toString().replace(/\B(?=(\d{7})+(?!\d))/g, ",")
            } <
            /div> <
            /div> <
            div className = "earnedValueContainer col-6 text-right" > {
                harvestButton
            } {
                compoundButton
            } <
            /div> <
            /div> <
            /div> <
            div className = "col-12 stakedContainer" >
            <
            div className = "row" >
            <
            div className = "stakedTextContainer col-6" >
            <
            span className = "stakedTokenName" > {
                poolName
            } < /span> <span className="textStaked">Staked:</span >
            <
            /div> <
            div className = "stakedValueContainer col-6 text-right" > {
                parseFloat(window.web3.utils.fromWei(dataUserPool.stakedAmount, 'Ether')).toFixed(5).toString().replace(/\B(?=(\d{5})+(?!\d))/g, ",")
            } <
            /div> <
            /div> <
            /div>


            {
                operateContent
            }

            <
            div className = "col-12 detailsPoolContainer text-center" >
            <
            div className = "row" >
            <
            div className = "col-12" > { /*<span className="detailsLink">Details</span>*/ }

            <
            div className = "row" >
            <
            div className = "col-12 poolDetailsContainer text-left" > {
                /*
                                                        <div className="detailsStakeContainer row">
                                                            <div className="col-6 detailsStakeTextContainer">
                                                                Stake:
                                                            </div>
                                                            <div className="col-6 detailsStakeTextValue text-right">
                                                                <a target="_blank" href="https://exchange.pancakeswap.finance/#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56/0x7cc46141ab1057b1928de5ad5ee78bb37efc4868">{poolName}</a>
                                                            </div>
                                                        </div>
                                                        */
            } <
            div className = "row" >
            <
            div className = "col-12 text-center" > {
                remainingBlocksText
            } <
            /div> <
            /div> <
            div className = "detailsTotalLiquidityContainer row" >
            <
            div className = "col-6 detailsStakeTextContainer" >
            Total Liquidity:
            <
            /div> <
            div className = "col-6 detailsTotalLiquidityTextValue text-right" >
            $ {
                poolTotalLiquidity
            } <
            /div> <
            /div> <
            div className = "detailsTotalLiquidityContainer row" >
            <
            div className = "col-6 detailsStakeTextContainer" >
            1 x {
                poolName
            }:
            <
            /div> <
            div className = "col-6 detailsTotalLiquidityTextValue text-right" >
            $ {
                poolStakingTokenPrice
            } <
            /div> <
            /div> <
            div className = "detailsViewOnBscScanContainer row" >
            <
            div className = "col-12 detailsViewOnBscScanTextContainer" >
            <
            a target = "_blank"
            href = {
                'https://bscscan.com/token/' + value.lpToken
            } > View on BscScan < /a> <
            /div> <
            /div> <
            div className = "detailsViewOnBscScanContainer row" >
            <
            div className = "col-12 detailsViewOnBscScanTextContainer" >
            <
            a target = "_blank"
            href = {
                getOnPancakeLink
            } > Get {
                poolName
            }
            on pancakeswap.finance < /a> <
            /div> <
            /div> <
            /div> <
            /div>

            <
            /div> <
            /div> <
            /div> <
            /div>

            <
            /div>
        )
    }
}

export default PoolBox;