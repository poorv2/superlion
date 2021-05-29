import React, {
    Component
} from 'react'
import farmer from '../farmer.png'
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";

import {
    Nav,
    Navbar,
    NavDropdown,
    MenuItem,
    Tabs,
    ButtonToolbar,
    Button,
    Table,
    ButtonGroup,
    Row,
    Col,
    Grid,
    Panel,
    FormGroup,
    FormControl
} from 'react-bootstrap';


class Menu extends Component {

    render() {
        /*
        let account = <button
          className="btn btn-primary"
          onClick={(event => {
              event.preventDefault();
              this.props.connectWalletConnect();
          })}
        >
          Connect Wallet
        </button>;
        */

        let logoutButton = '';

        let account = < button
        className = "btn btn-primary"
        onClick = {
                (event => {
                    event.preventDefault();
                    this.props.connectWalletConnect(true);
                })
            } >
            Connect Wallet <
            /button>;

        if (this.props.account !== '0x0') {
            account = this.props.account.substring(0, 6) + '...' + this.props.account.substr(this.props.account.length - 4);
            logoutButton = < button
            className = "btn btn-primary"
            onClick = {
                    (event => {
                        event.preventDefault();
                        this.props.disconnectWallet();
                    })
                } >
                Logout <
                /button>
        }

        let ourTokenPrice = '(Loading...)';

        var stateOurTokenPrice = this.props.ourTokenPrice

        if (!isNaN(stateOurTokenPrice)) {
            ourTokenPrice = stateOurTokenPrice.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '$';
        }

        let ourSecondTokenPrice = '(Loading...)';
        let stateOurSecondTokenPrice = this.props.ourSecondTokenPrice;

        if (!isNaN(stateOurSecondTokenPrice)) {
            ourSecondTokenPrice = stateOurSecondTokenPrice.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '$';
        }


        return (

            <
            Navbar id = "menu"
            bg = "light"
            expand = "lg" >
            <
            Navbar.Brand href = "#home" >
            <
            Link className = "navbar-brand col-sm-3 col-md-2 mr-0"
            to = "/" >
            <
            img id = "logo"
            src = "https://superlion.finance/lion.svg"
            className = "d-inline-block align-top"
            alt = "" / >
            &
            nbsp; {
                this.props.defiName
            } <
            span > .finance < /span> <
            /Link> <
            /Navbar.Brand> <
            Navbar.Toggle aria - controls = "basic-navbar-nav" / >
            <
            Navbar.Collapse id = "basic-navbar-nav" >
            <
            Nav >
            <
            Nav >
            <
            Link to = "/" > Home < /Link> <
            /Nav> <
            NavDropdown title = "Farm" >
            <
            NavDropdown.Item >
            <
            Link to = "/farm" > Native < /Link> <
            /NavDropdown.Item> <
            NavDropdown.Item >
            <
            Link to = "/farm-non-native" > Non Native < /Link> <
            /NavDropdown.Item> <
            /NavDropdown> <
            NavDropdown title = "Pool" >
            <
            NavDropdown.Item >
            <
            Link to = "/pool" > Native < /Link> <
            /NavDropdown.Item> <
            NavDropdown.Item >
            <
            Link to = "/pool-non-native" > Non Native < /Link> <
            /NavDropdown.Item> <
            /NavDropdown> <
            Nav >
            <
            Link to = "/referral" > Referral < /Link> <
            /Nav> <
            Nav >
            <
            a target = "_blank"
            href = "https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0xb9Fcb5B2935D57A8568B6309b3093200482C448D" > Exchange < /a> <
            /Nav> <
            Nav >
            <
            Link to = "/audit" > Audit < /Link> <
            /Nav> <
            Nav >
            <
            a target = "_blank"
            href = "https://superlion.gitbook.io/superlion-finance/" > Docs < /a> <
            /Nav> {
                /*
                                    <NavDropdown title="More" id="basic-nav-dropdown">
                                        <NavDropdown.Item target="_blank" href="https://github.com/SuperLionFinance/">Github</NavDropdown.Item>
                                        <NavDropdown.Item target="_blank" href="https://superlionfinance.gitbook.io/superlion-finance/">Docs</NavDropdown.Item>
                                    </NavDropdown>
                                    */
            } <
            Nav id = "tokenPrice" > { /* eslint-disable-next-line react/jsx-no-target-blank */ } <
            a href = {
                'https://poocoin.app/tokens/' + this.props.ourTokenContract
            }
            target = "_blank" >
            <
            span className = "tokenName" > {
                this.props.ourTokenName
            } < /span>&nbsp; <
            span className = "tokenPrice" > {
                ourTokenPrice
            } < /span> <
            /a> <
            span class = "separator" > | < /span> <
            a href = {
                'https://poocoin.app/tokens/' + this.props.ourSecondTokenContract
            }
            target = "_blank" >
            <
            span className = "tokenName" > {
                this.props.ourSecondTokenName
            } < /span>&nbsp; <
            span className = "tokenPrice" > {
                ourSecondTokenPrice
            } < /span> <
            /a> <
            /Nav> <
            Nav id = "account" >
            <
            div id = "accountAddr" > {
                account
            } <
            /div> <
            div id = "loggoutContainer" > {
                logoutButton
            } <
            /div> <
            /Nav> <
            /Nav> <
            /Navbar.Collapse> <
            /Navbar>
            /*

        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="/">Home</NavDropdown.Item>
            <NavDropdown.Item href="/farm">Farm</NavDropdown.Item>
            <NavDropdown.Item href="/pool">Pool</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item id="cuenta">
                {account} {logoutButton}
            </NavDropdown.Item>
        </NavDropdown>

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="http://cristian.pro"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={farmer} width="30" height="30" className="d-inline-block align-top" alt="" />
                    &nbsp; {this.props.defiName}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item float-left col-3">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="nav-item float-left col-3">
                            <Link to="/farm">Farm</Link>
                        </li>
                        <li className="nav-item float-left col-3">
                            <Link to="/pool">Pool</Link>
                        </li>

                        <li id="cuenta" className="nav-item float-left col-3">
                            {account} {logoutButton}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow col-12">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://cristian.pro"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={farmer} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; {this.props.defiName}
        </a>

        <ul id="menu" className="col-8">

                <li className="nav-item float-left col-3">
                    <Link to="/">Home</Link>
                </li>
                <li className="nav-item float-left col-3">
                    <Link to="/farm">Farm</Link>
                </li>
                <li className="nav-item float-left col-3">
                    <Link to="/pool">Pool</Link>
                </li>

            <li id="cuenta" className="nav-item float-left col-3">
                {account} {logoutButton}
            </li>
        </ul>
      </nav>
      */
        );
    }
}

export default Menu;