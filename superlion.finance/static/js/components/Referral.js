import React, {
    Component
} from 'react'
import Calculator from '../img/calculator.svg'
import PoolBox from "./PoolBox";
import {
    toast
} from "react-toastify";

class Referral extends Component {

    render() {

        let account = this.props.account;

        let earnRecommendingContent = < button
        className = "btn btn-primary"
        onClick = {
                (event => {
                    event.preventDefault();
                    this.props.connectWalletConnect(true);
                })
            } >
            Connect Wallet <
            /button>;

        if (account !== '0x0') {
            let referralUrl = this.props.defiUrl + '?ref=' + account;
            earnRecommendingContent = <
                a
            href = "javascript:void(0);"
            onClick = {
                    (event => {
                        event.preventDefault();
                        navigator.clipboard.writeText(referralUrl)
                        toast('URL copied', {
                            autoClose: 5000,
                        });
                    })
                } >
                {
                    referralUrl
                } < /a>;
        }

        let whoHasReferredMe = 'Nobody';
        if (this.props.whoHasReferredMe != '0x0000000000000000000000000000000000000000') {
            whoHasReferredMe = this.props.whoHasReferredMe;
        }

        return ( <
            div className = "row rowReferral" >
            <
            div className = "col-12 text-center colReferral" >
            <
            h1 id = "earnRecommendingTitle" > Earn {
                this.props.ourTokenName
            }
            's recommending {this.props.defiName}!</h1> <
            div className = "earnRecommendingContent" > {
                earnRecommendingContent
            } <
            /div> <
            div className = "earnRecommendingFooter" >
            <
            small > We will automatically send you {
                this.props.ourTokenName
            }
            directly to your wallet, every time a user recommended by you, makes harvests or withdraws from our Farms or Pools. < /small> <
            /div> <
            /div> <
            div className = "col-12 text-center colReferral" >
            <
            h2 id = "earnRecommendingTitle1" > Who has referred me < /h2> <
            div className = "earnRecommendingFooter" > {
                whoHasReferredMe
            } <
            /div> <
            /div> <
            div className = "col-12 text-center colReferral" >
            <
            h2 id = "earnRecommendingTitle2" > How many users I have referred have deposited < /h2> <
            div className = "earnRecommendingFooter" >
            <
            h2 > {
                this.props.referredCount
            } < /h2> <
            /div> <
            p >
            <
            small > Unfortunately we cannot obtain a list of the users you have referred, our contract doesn 't have a method to obtain this information.<br />
            Sorry
            for the inconvenience < /small> <
            /p> <
            /div>

            <
            div className = "col-12 colReferral" >
            <
            div className = "text-center" >
            <
            strong > When a user you 've referred deposits:</strong><br/> -
            MasterChef saves who has referred that user < br / >
            -In your referral counter it increases by 1 <
            /div> {
                /*
                                    <pre>
                                        {"// Set Referral Address for a user\n" +
                                        "    function setReferral(address _user, address _referrer) internal {\n" +
                                        "        if (_referrer == address(_referrer) && referrers[_user] == address(0) && _referrer != address(0) && _referrer != _user) {\n" +
                                        "            referrers[_user] = _referrer;\n" +
                                        "            referredCount[_referrer] += 1;\n" +
                                        "            emit Referral(_user, _referrer);\n" +
                                        "        }\n" +
                                        "    }"}
                                    </pre>
                                    */
            } <
            /div> <
            /div>
        );
    }
}

export default Referral;