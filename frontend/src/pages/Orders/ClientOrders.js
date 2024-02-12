import React, { useState } from "react";
import styles from './orders.module.css';
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import OrdersTable from "../../components/Orders/OrdersTable";

const ClientOrders = ({ token, role, onStatus, orders, onOrders, error, onError }) => {
    const [orderId, setOrderId] = useState('')

    const navigate = useNavigate()

    const editOrder = (action) => {
        let order = orders.filter(el => el.order_id === orderId)[0]
        if (orderId) {
            console.log('Удалён заказ ', order)
            if (order.order_status === 'new'){
                switch (action) {
                    case 'удалить':
                        api.post('/orders/remove', {} , {headers: {Authorization: `Bearer ${token}`}, params: {order_id: orderId}})
                            .then((res) => {
                                console.log(res)
                                onOrders([])
                                onError('')
                            }).catch((e) => onError(e.response.data.message))
                        break;
                    case 'редактировать': 
                        navigate(`/edit-order/${orderId}`, {replace: true})
                        break;
                    default:
                        return
                }
                
            } else {
                onError(`Вы не можете ${action} заказ`)
            }

            
        } else {
            onError('Выберите заказ со статусом новый')
        }
    }

    const cancelOrder = () => {
        if (orderId) {
            let order = orders.filter(el => el.order_id === orderId)[0]
            if (['new', 'specification', 'confirmation'].includes(order.order_status)){
                api.post('/orders/cancel', {},{headers: {Authorization: `Bearer ${token}`}, params: {order_id: orderId}})
                    .then((res) => {
                        console.log(res)
                        onError('')
                        onOrders([])
                    }).catch((e) => onError(e.response.data.message))
            }else {
                onError('Вы не можете отменить этот заказ')
            }
            
        } else {
            onError('Выберите заказ')
        }
    }

    return (
        <div className={styles.UserOrders}>
            <button type="button" onClick={() => navigate('/add-order', {replace: true})}>Добавить заказ</button>
            <OrdersTable orders={orders} role={role} onOrderId={setOrderId} onStatus={onStatus} onError={onError} />
            {orders.length 
                ? <>
                    {error && <p className={styles.require}>{error}</p>}
                    <button type="button" onClick={() => editOrder('редактировать')}>Редактировать заказ</button>
                    <button type="button" onClick={() => editOrder('удалить')}>Удалить заказ</button>
                    <button type="button" onClick={cancelOrder}>Отменить заказ</button>
                </>
                : <p className={styles.require}>Заказов нет</p>
            }
        </div>
    )
}

export default ClientOrders;