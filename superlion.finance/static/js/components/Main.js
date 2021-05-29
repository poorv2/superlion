import React, {
    Component
} from 'react'
import mss from '../mss.png'

const currentPoolPid = 0;

class Main extends Component {

    render() {

            let stakingTokenPrice = '1';
            let rewardTokenPrice = '1';
            let totalStaked = window.web3.utils.fromWei(this.props.SlionTokenMasterChefBalance, 'Ether');
            let tokenPerBlock = this.props.CAKE_PER_BLOCK;

            var accSlionPerShare = window.web3.utils.fromWei('208364124602130', 'Ether');

            console.log('accSlionPerShare');
            console.log(accSlionPerShare);
            /*
            let apy = this.props.getPoolApy(
                stakingTokenPrice,
                rewardTokenPrice,
                totalStaked,
                tokenPerBlock
            );
            */

            let apy = this.props.getFarmApy(
                stakingTokenPrice,
                stakingTokenPrice,
                totalStaked
            );

            let apyDia = apy / 365;
            let apyHora = apyDia / 24;
            let apyMinuto = apyHora / 60;

            let aGanarPorMinuto = parseFloat(window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')) * apyMinuto / 100;

            console.log('totalStaked');
            console.log(totalStaked);

            return ( <
                div id = "content"
                className = "mt-3" > {
                    /*
                                    <button
                                        className="btn btn-danger btn-block"
                                        onClick={(event => {
                                            event.preventDefault()
                                            this.props.issueTokens()
                                        })}
                                    >Repartir recompensas</button>
                                    */
                }

                <
                button className = "btn btn-danger btn-block"
                onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.transferOwnership();
                    })
                } >
                transferOwnership <
                /button>

                <
                button className = "btn btn-danger btn-block"
                onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.approveSpendToMasterChef();
                    })
                } >
                approveSpendToMasterChef <
                /button>

                <
                button className = "btn btn-primary btn-block"
                onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.getPools();
                    })
                } >
                Get Pools <
                /button>

                <
                button className = "btn btn-success btn-block"
                onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.addPool();
                    })
                } >
                Add Pool <
                /button>

                <
                button className = "btn btn-success btn-block"
                onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.setPool(currentPoolPid, 9999, 0);
                    })
                } >
                Set Pool <
                /button>

                <
                button className = "btn btn-success btn-block"
                onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.massUpdatePools();
                    })
                } >
                massUpdatePools <
                /button>

                <
                button className = "btn btn-success btn-block"
                onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.updatePool(1);
                    })
                } >
                updatePool 1 <
                /button>


                <
                h1 className = "text-center" > Master Chef Balance: {
                    parseFloat(window.web3.utils.fromWei(this.props.SlionTokenMasterChefBalance, 'Ether')).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                UMS < /h1>

                <
                table className = "table table-borderless text-muted text-center" >
                <
                thead >
                <
                tr >
                <
                th scope = "col" > APR < /th> <
                th scope = "col" > Staking Balance < /th> <
                th scope = "col" > Reward Balance < /th> <
                /tr> <
                /thead> <
                tbody >
                <
                tr >
                <
                td className = "text-right" >
                <
                strong > AÑO: < /strong> <br / > {
                    parseFloat(
                        apy
                    ).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                } % < br / >
                <
                strong > DÍA: < /strong><br / > {
                    parseFloat(
                        apyDia
                    ).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                } % < br / >
                <
                strong > HORA: < /strong><br / > {
                    parseFloat(
                        apyHora
                    ).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                } % < br / >
                <
                strong > MINUTO: < /strong><br / > {
                    parseFloat(
                        apyMinuto
                    ).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                } % < br / >
                <
                /td> <
                td > {
                    parseFloat(window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                UMS < br / >
                <
                br / >
                <
                strong > A ganar por minuto: < /strong> { aGanarPorMinuto.toFixed(3).toString().replace(/\
                B( ? = (\d {
                    3
                }) + ( ? !\d)) / g, ",")
        } <
        /td> <
        td > {
            parseFloat(window.web3.utils.fromWei(this.props.SlionTokenEarnBalance, 'Ether')).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
    UMS < /td> <
        /tr> <
        /tbody> <
        /table>

        <
        div className = "card mb-4" >

        <
        div className = "card-body" >

        <
        form className = "md-3"
    onSubmit = {
            (event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.deposit(currentPoolPid, amount)
            }
        } >
        <
        div >
        <
        label className = "float-left" > < strong > Stake Tokens < /strong></label >
        <
        span className = "float-right text-muted" >
        <
        a
    onClick = {
        (event => {
            event.preventDefault();
            var totalBalance = window.web3.utils.fromWei(this.props.SlionTokenBalance, 'Ether');
            this.input.value = totalBalance;
        })
    }
    href = "" >
        MAX < /a> |
    Balance: {
            parseFloat(window.web3.utils.fromWei(this.props.SlionTokenBalance, 'Ether')).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        } <
        /span> <
        /div> <
        div className = "input-group md-4" >
        <
        input
    type = "text"
    ref = {
        (input) => {
            this.input = input
        }
    }
    className = "form-control form-control-lg"
    placeholder = "0"
    required
        /
        >
        <
        div className = "input-group-append" >
        <
        div className = "input-group-text" >
        <
        img src = {
            mss
        }
    height = "32"
    alt = "" / >
        &
        nbsp; & nbsp;
    UMS
        <
        /div> <
        /div>

        <
        button
    type = "submit"
    className = "btn btn-warning btn-block btn-sm"
    onClick = {
            (event => {
                event.preventDefault()
                /*
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                                                                                                      this.props.approveContract(amount)
                 */
                this.props.approveContract()
            })
        } >
        Approve <
        /button>

        <
        button type = "submit"
    className = "btn btn-primary btn-block btn-lg" > Deposit < /button>

        <
        button
    type = "submit"
    className = "btn btn-link btn-block btn-sm"
    onClick = {
            (event => {
                event.preventDefault()
                var amount = window.web3.utils.fromWei(this.props.stakingBalance, 'Ether');
                amount = amount.toString();
                this.props.withdraw(currentPoolPid, amount)
            })
        } >
        UN - STAKE!!!
        <
        /button>

        <
        button
    type = "submit"
    className = "btn btn-primary btn-block btn-lg"
    onClick = {
            (event => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                amount = amount.toString();
                this.props.enterStaking(amount)
            })
        } >
        enterStaking < /button>

        <
        button
    type = "submit"
    className = "btn btn-primary btn-block btn-lg"
    onClick = {
            (event => {
                event.preventDefault()
                var amount = window.web3.utils.fromWei(this.props.stakingBalance, 'Ether');
                amount = amount.toString();
                this.props.leaveStaking(amount)
            })
        } >
        leaveStaking < /button>

        <
        /div> <
        /form>

        <
        /div>

        <
        /div>

        <
        /div>
);
}
}

export default Main;