import React, {
    Component
} from 'react'
import {
    toast
} from "react-toastify";

class Audit extends Component {

    render() {

        return ( <
            div className = "row rowReferral" >
            <
            div className = "col-12 text-center colReferral" >
            <
            h1 id = "earnRecommendingTitle" > Audited < /h1> <
            a target = "_blank"
            href = "https://github.com/SuperLionFinance/audit/blob/main/techrate-SuperLion%20Finance.pdf" > ✅TechRate <
            small > (paied versión) < /small> <
            /a> <
            /div> <
            /div>
        );
    }
}

export default Audit;