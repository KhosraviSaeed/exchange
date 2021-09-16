import * as React from "react";
import { useSelector } from 'react-redux'
import * as qs from 'query-string'

import DashboardLayout from '../Layouts/Dashboard'
import Charts from '../components/Charts'

import { selectorDashCardPrices } from "../ducks/currencies/currencies-selectors";

import { initiateSocket, subscribe } from '../helpers/socket'

function ChartsPage (props) {
    let query = qs.parse(props.location.search);
    let currencies = useSelector(selectorDashCardPrices);
    const currencyId = currencies.find((v) => v.shortName === query.cur)._id
    const rialId = currencies.find((v) => v.shortName === 'IRR')._id

    React.useEffect(() => {
        const socket = initiateSocket()
        subscribe(socket, 'new_offer')

         return ()=>{
            console.log("unmount")
            socket.disconnect()
            console.log(socket)
        }
    }, [])

    return (
        <DashboardLayout>
            <Charts
                currencyId={currencyId}
                rialId={rialId}
            />
        </DashboardLayout>
    );
}

export default ChartsPage