import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientManagerOrders from "./ClientManagerOrders";
import ClientOrders from "./ClientOrders";
import DirectorOrders from "./DirectorOrders";
import MasterOrders from "./MasterOrders";
import PurchaseManagerOrders from "./PurchaseManagerOrders";
import styles from './orders.module.css';
import { api } from "../../utils/api";


const OrderPage = () => {
    const [token, setToken] = useState(Cookies.get('token'))
    const [role, setRole] = useState('')
    const [error, setError] = useState('')

    const [orders, setOrders] = useState([])
    const [status, setStatus] = useState({value: '', change: false})

    const navigate = useNavigate()

    useEffect(() => {
        setToken(Cookies.get('token'))
        if (!token) {
            navigate('/login', { replace: true })
        } else {
            setRole(Cookies.get('role'))
            if ((!orders?.length && !status.value) || status.change){
                api.get('/orders/get', {headers: {Authorization: `Bearer ${token}`}, params: {status: status.value}})
                    .then((res) => {
                        console.log(res)
                        if (res.data){
                            setOrders(res.data)
                        } else {
                            setOrders([])
                        }
                        setError('')
                        status.change = false
                    }).catch((e) => setError(e.response.data.message))
                }
        }
    }, [token, role, navigate, orders?.length, status])

    return (
        <div className={styles.OrderPage}>
            <h2>Заказы</h2>
            {role === 'client'
                ? <ClientOrders role={role} token={token} orders={orders} onOrders={setOrders} onStatus={setStatus} error={error} onError={setError} />
                : role === 'client_manager'
                    ? <ClientManagerOrders role={role} token={token} orders={orders} onOrders={setOrders} onStatus={setStatus} error={error} onError={setError} />
                    : role === 'director'
                        ? <DirectorOrders role={role} orders={orders} error={error} onStatus={setStatus} />
                        : role === 'purchase_manager'
                            ? <PurchaseManagerOrders role={role} token={token} orders={orders} onOrders={setOrders} error={error} onError={setError} onStatus={setStatus} />
                            : <MasterOrders role={role} token={token} orders={orders} onOrders={setOrders} error={error} onError={setError} onStatus={setStatus} />
            }
        </div>
    )
}

export default OrderPage;