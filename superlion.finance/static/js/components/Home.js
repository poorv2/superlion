import React, {
    Component
} from 'react'
import TweetEmbed from 'react-tweet-embed';

class Home extends Component {

    render() {

        let ourTokenPrice = 'Loading...';

        var stateOurTokenPrice = this.props.ourTokenPrice

        if (!isNaN(stateOurTokenPrice)) {
            ourTokenPrice = stateOurTokenPrice.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '$';
        }

        let ourSecondTokenPrice = 'Loading...';

        var stateOurSecondTokenPrice = this.props.ourSecondTokenPrice

        if (!isNaN(stateOurSecondTokenPrice)) {
            ourSecondTokenPrice = stateOurSecondTokenPrice.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '$';
        }

        let tvl = 'Loading...';
        if (this.props.tvl > 0) {
            tvl = parseFloat(this.props.tvl).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        let poolAndReward = [];
        let poolAndRewardMlion = [];

        let totalTokenToHavestEther = 0;
        let totalTokenToHavestEtherMlion = 0;

        for (const [index, value] of this.props.pools.entries()) {

            let dataUserPool = this.props.getDataUserPool(value.masterchef, value.pid);

            let rewardEther = window.web3.utils.fromWei(dataUserPool.rewardDebt.toString(), 'Ether');

            if (dataUserPool.rewardDebt > 0) {
                if (value.masterchef == 0) {
                    poolAndReward.push({
                        pid: value.pid,
                        rewardEther: rewardEther,
                    })

                    totalTokenToHavestEther = parseFloat(totalTokenToHavestEther) + parseFloat(rewardEther);
                } else if (value.masterchef == 1) {
                    poolAndRewardMlion.push({
                        pid: value.pid,
                        rewardEther: rewardEther,
                    })

                    totalTokenToHavestEtherMlion = parseFloat(totalTokenToHavestEtherMlion) + parseFloat(rewardEther);
                }
            }

        }

        let harvestAllButton = <
            button className = "btn btn-secondary disabled harvestButton"
        disabled = "disabled" >
            Harvest all <
            /button>;

        let harvestAllButtonMlion = <
            button className = "btn btn-secondary disabled harvestButton"
        disabled = "disabled" >
            Harvest all <
            /button>;

        if (poolAndReward.length > 0) {
            harvestAllButton = <
                button
            className = "btn btn-primary harvestButton"
            onClick = {
                    (event => {
                        event.preventDefault()

                        var _this = this;

                        poolAndReward.forEach(function(data) {
                            let pid = data.pid;
                            //let reward = data.reward;
                            //let rewardEth = window.web3.utils.fromWei(reward, 'Ether');

                            //console.log(pid, rewardEth)

                            //_this.props.withdraw(pid, rewardEth);
                            _this.props.withdraw(0, pid, 0);
                        });


                    })
                } >
                Harvest all({
                    poolAndReward.length
                }) <
                /button>;
        }

        if (poolAndRewardMlion.length > 0) {
            harvestAllButtonMlion = <
                button
            className = "btn btn-primary harvestButton"
            onClick = {
                    (event => {
                        event.preventDefault()

                        var _this = this;

                        poolAndRewardMlion.forEach(function(data) {
                            let pid = data.pid;
                            //let reward = data.reward;
                            //let rewardEth = window.web3.utils.fromWei(reward, 'Ether');

                            //console.log(pid, rewardEth)

                            //_this.props.withdraw(pid, rewardEth);
                            _this.props.withdraw(1, pid, 0);
                        });


                    })
                } >
                Harvest all({
                    poolAndRewardMlion.length
                }) <
                /button>;
        }

        return ( <
            div className = "row homeContainer" >
            <
            div className = "col-12 welcomeCol" >
            <
            h1 id = "welcomeTo" > Make money with {
                this.props.defiName
            } < /h1> <
            div className = "descriptionProject text-center" >
            <
            p > Our contract does not have the possibility of rug pull. < /p> <
            p > Emission Reduction | Earn with Referral | Burning Mechanisms < /p> <
            /div> <
            /div> <
            div className = "col-12 col-md-6 text-center ourTokenContainer" >
            <
            div className = "row" >
            <
            div className = "col-12" >
            <
            div id = "makeMoneyContainer" >
            SuperLion <
            /div> <
            /div>

            <
            div className = "col-12" >
            <
            div className = "row" >
            <
            div className = "col-2 ourLogoTokenContainer" >
            <
            img style = {
                {
                    width: '50px'
                }
            }
            src = {
                require('../tokens-pools/0.png')
            }
            alt = "" / >
            <
            /div> <
            div className = "col-6 ourTokenNameAndPrice" >
            <
            span className = "ourTokenName" > {
                this.props.ourTokenName
            } <
            /span> <
            span className = "ourTokenPrice" > {
                ourTokenPrice
            } <
            /span> <
            /div> <
            div className = "col-4 buyOurTokenContainer" >
            <
            a className = "buyTokenButton btn btn-primary"
            href = {
                'https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=' + this.props.ourTokenContract
            }
            target = "_blank" >
            Buy {
                this.props.ourTokenName
            } <
            /a> <
            /div> <
            /div> <
            /div>

            <
            div className = "col-12" >
            <
            div className = "row" >
            <
            div className = "containerOurTokenToHarvest col-8" >
            <
            span className = "ourTokenToHarvest" > {
                this.props.ourTokenName
            }
            's to Harvest <
            /span> <
            span className = "ourTokenToHarvestValue" > {
                parseFloat(totalTokenToHavestEther).toFixed(5).toString().replace(/\B(?=(\d{5})+(?!\d))/g, ",")
            } <
            /span> <
            /div> <
            div className = "ourTokenToHarvestButtonContainer col-4" > {
                harvestAllButton
            } <
            /div> <
            /div> <
            /div>

            <
            div className = "col-12" >
            <
            span className = "tokenInYourWallet" > {
                this.props.ourTokenName
            }
            's in your wallet <
            /span> <
            span className = "tokenInYourWalletValue" > {
                parseFloat(this.props.tokensInYourWallet.toString()).toFixed(5).toString().replace(/\B(?=(\d{5})+(?!\d))/g, ",")
            } <
            /span> <
            /div>

            <
            div className = "col-12" >
            <
            div id = "makeMoneyContainer" >
            MegaLion <
            /div> <
            /div>

            <
            div className = "col-12" >
            <
            div className = "row" >
            <
            div className = "col-2 ourLogoTokenContainer" >
            <
            img style = {
                {
                    width: '50px'
                }
            }
            src = {
                require('../tokens-pools/1-0.png')
            }
            alt = "" / >
            <
            /div> <
            div className = "col-6 ourTokenNameAndPrice" >
            <
            span className = "ourTokenName" > {
                this.props.ourSecondTokenName
            } <
            /span> <
            span className = "ourTokenPrice" > {
                ourSecondTokenPrice
            } <
            /span> <
            /div> <
            div className = "col-4 buyOurTokenContainer" >
            <
            a className = "buyTokenButton btn btn-primary"
            href = {
                'https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=' + this.props.ourSecondTokenContract
            }
            target = "_blank" >
            Buy {
                this.props.ourSecondTokenName
            } <
            /a> <
            /div> <
            /div> <
            /div>

            <
            div className = "col-12" >
            <
            div className = "row" >
            <
            div className = "containerOurTokenToHarvest col-8" >
            <
            span className = "ourTokenToHarvest" > {
                this.props.ourSecondTokenName
            }
            's to Harvest <
            /span> <
            span className = "ourTokenToHarvestValue" > {
                parseFloat(totalTokenToHavestEtherMlion).toFixed(5).toString().replace(/\B(?=(\d{5})+(?!\d))/g, ",")
            } <
            /span> <
            /div> <
            div className = "ourTokenToHarvestButtonContainer col-4" > {
                harvestAllButtonMlion
            } <
            /div> <
            /div> <
            /div>

            <
            div className = "col-12" >
            <
            span className = "tokenInYourWallet" > {
                this.props.ourSecondTokenName
            }
            's in your wallet <
            /span> <
            span className = "tokenInYourWalletValue" > {
                parseFloat(this.props.secondTokenTokensInYourWallet.toString()).toFixed(5).toString().replace(/\B(?=(\d{5})+(?!\d))/g, ",")
            } <
            /span> <
            /div>


            <
            /div> <
            /div> <
            div className = "col-12 col-md-6 tokenStats" >
            <
            div className = "tokenStatsTitle" > {
                this.props.ourTokenName
            }
            Stats <
            /div> <
            table className = "tokenStatsTable" >
            <
            tr >
            <
            td className = "tokenStatsTableLabel" > Total {
                this.props.ourTokenName
            }
            Supply < /td> <
            td className = "tokenStatsTableValue text-right" > {
                parseFloat(this.props.tokenTotalSupply).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } < /td> <
            /tr> <
            tr >
            <
            td className = "tokenStatsTableLabel" > Total {
                this.props.ourTokenName
            }
            Burned < /td> <
            td className = "tokenStatsTableValue text-right" > {
                parseFloat(this.props.totalTokenBurned).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } < /td> <
            /tr> <
            tr >
            <
            td className = "tokenStatsTableLabel" > Market Cap < /td> <
            td className = "tokenStatsTableValue text-right" > $ {
                parseFloat(this.props.marketCap).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } < /td> <
            /tr> <
            tr >
            <
            td className = "tokenStatsTableLabel" > New {
                this.props.ourTokenName
            }
            per block < /td> <
            td className = "tokenStatsTableValue text-right" > {
                parseFloat(this.props.slionPerBlockEther).toFixed(5)
            } < /td> <
            /tr> <
            /table> <
            div className = "tokenStatsTitle" > {
                this.props.ourSecondTokenName
            }
            Stats <
            /div> <
            table className = "tokenStatsTable" >
            <
            tr >
            <
            td className = "tokenStatsTableLabel" > Total {
                this.props.ourSecondTokenName
            }
            Supply < /td> <
            td className = "tokenStatsTableValue text-right" > {
                parseFloat(this.props.ourSecondTokenTotalSupply).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } < /td> <
            /tr> <
            tr >
            <
            td className = "tokenStatsTableLabel" > Total {
                this.props.ourSecondTokenName
            }
            Burned < /td> <
            td className = "tokenStatsTableValue text-right" > {
                parseFloat(this.props.totalSecondTokenBurned).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } < /td> <
            /tr> <
            tr >
            <
            td className = "tokenStatsTableLabel" > Market Cap < /td> <
            td className = "tokenStatsTableValue text-right" > $ {
                parseFloat(this.props.ourSecondTokenMarketCap).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            } < /td> <
            /tr> <
            tr >
            <
            td className = "tokenStatsTableLabel" > New {
                this.props.ourSecondTokenName
            }
            per block < /td> <
            td className = "tokenStatsTableValue text-right" > {
                parseFloat(this.props.mlionPerBlockEther).toFixed(5)
            } < /td> <
            /tr> <
            /table> <
            div className = "totalValueLockedContainer" >
            <
            div className = "totalValueLockedTitle" >
            Total Value Locked(TVL) <
            /div> <
            div className = "totalValueLockedValue" >
            $ {
                tvl
            } <
            /div> <
            div className = "totalValueLockedFooter" >
            <
            small > Across all Farms and Pools of {
                this.props.defiName
            } < /small> <
            /div> <
            /div> <
            /div> <
            div className = "col-12 col-md-6 twitterContainer text-center" >
            <
            div className = "AnnouncementsTitle" >
            Announcements <
            /div> <
            div className = "twitterEmbed" >
            <
            a target = "_blank"
            className = "twitter-timeline"
            width = "100%"
            height = "350"
            href = "https://twitter.com/SuperLionBSC?ref_src=twsrc%5Etfw" > Tweets by SuperLionDefi < /a> <
            script async src = "https://platform.twitter.com/widgets.js"
            charSet = "utf-8" > < /script> <
            /div> <
            /div> <
            /div>
        );
    }
}

export default Home;