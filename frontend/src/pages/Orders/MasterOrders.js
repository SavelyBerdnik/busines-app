import React, { useState } from "react";
import styles from './orders.module.css';
import { api } from "../../utils/api";
import OrdersTable from "../../components/Orders/OrdersTable";

const MasterOrders = ({ token, role, onStatus, orders, onOrders, error, onError }) => {
    const [orderId, setOrderId] = useState('')

    const changeOrder = () => {
        if (orderId) {
            let order = orders.filter(el => el.order_id === orderId)[0]
            if (order.order_status === 'production'){
                api.post('/orders/update', {},{headers: {Authorization: `Bearer ${token}`}, params: {status: 'control', order_id: orderId}})
                    .then((res) => {
                        console.log(res)
                        onError('')
                        onOrders([])
                    }).catch((e) => onError(e.response.data.message))
            } else {
                if (order.order_status === 'control'){
                    api.post('/orders/update', {},{headers: {Authorization: `Bearer ${token}`}, params: {status: 'ready', order_id: orderId}})
                        .then((res) => {
                            console.log(res)
                            onError('')
                            onOrders([])
                        }).catch((e) => onError(e.response.data.message))
                } else {
                    onError('Вы не можете изменить статус этого заказа')
                }
            }
            
        } else {
            onError('Выберите заказ')
        }
    }

    return (
        <div className={styles.UserOrders}>
            <OrdersTable orders={orders} role={role} onOrderId={setOrderId} onStatus={onStatus} onError={onError}/>
            {orders.length 
                ? <>
                    {error && <p className={styles.require}>{error}</p>}
                    <button type="button" onClick={changeOrder}>Изменить статус заказ</button>
                </>
                : <p className={styles.require}>Заказов нет</p>
            }
        </div>
    )
}

export default MasterOrders;