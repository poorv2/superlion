import React, {
    Component
} from 'react'
import Calculator from '../img/calculator.svg'
import PoolBox from "./PoolBox";
import Menu from "./Menu";
import Home from "./Home";

class Farms extends Component {

    render() {

        const pools = []

        for (const [index, value] of this.props.pools.entries()) {

            let showBox = false;

            if (this.props.native == 1 && (value.token1Name == 'SLION' || value.token1Name == 'MLION' || value.token2Name == 'SLION' || value.token2Name == 'MLION')) {
                showBox = true;
            } else if (this.props.native == 0 && (value.token1Name != 'SLION' && value.token1Name != 'MLION') && (value.token2Name != 'SLION' && value.token2Name != 'MLION')) {
                showBox = true;
            }

            if (
                value.token2Name &&
                showBox
            ) {
                pools.push( <
                    PoolBox key = {
                        'Pool' + value.masterchef + '-' + value.pid
                    }
                    index = {
                        index
                    }
                    value = {
                        value
                    }
                    approveContract = {
                        this.props.approveContract.bind(this)
                    }
                    deposit = {
                        this.props.deposit.bind(this)
                    }
                    withdraw = {
                        this.props.withdraw.bind(this)
                    }
                    enterStaking = {
                        this.props.enterStaking.bind(this)
                    }
                    leaveStaking = {
                        this.props.leaveStaking.bind(this)
                    }
                    connectWalletConnect = {
                        this.props.connectWalletConnect.bind(this)
                    }
                    hasApprovedContract = {
                        this.props.hasApprovedContract.bind(this)
                    }
                    getDataUserPool = {
                        this.props.getDataUserPool.bind(this)
                    }
                    getDataUserBalance = {
                        this.props.getDataUserBalance.bind(this)
                    }
                    getPoolInfo = {
                        this.props.getPoolInfo.bind(this)
                    }
                    getLiquidityPools = {
                        this.props.getLiquidityPools.bind(this)
                    }
                    handleOpenModal = {
                        this.props.handleOpenModal.bind(this)
                    }
                    setAprToModal = {
                        this.props.setAprToModal.bind(this)
                    }
                    getFarmApy = {
                        this.props.getFarmApy.bind(this)
                    }
                    getPoolApy = {
                        this.props.getPoolApy.bind(this)
                    }
                    getTokenPriceBySymbol = {
                        this.props.getTokenPriceBySymbol.bind(this)
                    }
                    getTokenPriceByContract = {
                        this.props.getTokenPriceByContract.bind(this)
                    }
                    getPairPriceByContract = {
                        this.props.getPairPriceByContract.bind(this)
                    }
                    account = {
                        this.props.account
                    }
                    ourTokenName = {
                        this.props.ourTokenName
                    }
                    ourTokenPrice = {
                        this.props.ourTokenPrice
                    }
                    slionPerBlockEther = {
                        this.props.slionPerBlockEther
                    }
                    totalAllocPoint = {
                        this.props.totalAllocPoint
                    }
                    ourSecondTotalAllocPoint = {
                        this.props.ourSecondTotalAllocPoint
                    }

                    ourSecondTokenName = {
                        this.props.ourSecondTokenName
                    }
                    ourSecondTokenPrice = {
                        this.props.ourSecondTokenPrice
                    }
                    ourSecondTokenContract = {
                        this.props.ourSecondTokenContract
                    }
                    mlionPerBlockEther = {
                        this.props.mlionPerBlockEther
                    }
                    />
                )
            }
        }

        return ( <
            div className = "row rowFarms" >
            <
            div className = "col-12 text-center colFarms" >
            <
            h1 id = "ourPools" > Our farms < /h1> <
            div className = "ourPoolsDescription" >
            Stake < strong > LP v2 < /strong> tokens to earn {this.props.ourTokenName} <
            /div> <
            div className = "ourPoolsDescription" > 🦁A part of deposit Fee is used
            for Buyback and Burn {
                this.props.ourTokenName
            }
            and pump the price </div> </div> 
            <div className = "col-12" >
            <
            div className = "row"
            id = "poolsContainer" > {
                pools
            } <
            /div> <
            /div> <
            /div>
        );
    }
}

export default Farms;