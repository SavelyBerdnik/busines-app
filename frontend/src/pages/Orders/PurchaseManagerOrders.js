import React, { useState } from "react";
import { api } from "../../utils/api";
import OrdersTable from "../../components/Orders/OrdersTable";
import styles from './orders.module.css';

const PurchaseManagerOrders = ({ token, role, onStatus, orders, onOrders, error, onError }) => {
    const [orderId, setOrderId] = useState('')

    const changeOrder = () => {
        if (orderId) {
            let order = orders.filter(el => el.order_id === orderId)[0]
            if (order.order_status === 'purchase'){
                api.post('/orders/update', {},{headers: {Authorization: `Bearer ${token}`}, params: {status: 'production', order_id: orderId}})
                    .then((res) => {
                        console.log(res)
                        onError('')
                        onOrders([])
                    }).catch((e) => onError(e.response.data.message))
            }else {
                onError('Вы не можете изменить статус этого заказа')
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
                    <button type="button" onClick={changeOrder}>Изменить статус заказа</button>
                </>
                : <p className={styles.require}>Заказов нет</p>
            }
        </div>
    )
}

export default PurchaseManagerOrders;