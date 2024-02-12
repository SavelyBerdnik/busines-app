import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import OrdersTable from "../../components/Orders/OrdersTable";
import styles from './orders.module.css';

const ClientManagerOrders = ({ token, role, onStatus, orders, onOrders, error, onError }) => {
    const [orderId, setOrderId] = useState('')
    const [reason, setReason] = useState('')
    const [isCancel, setIsCancel] = useState(false)

    const [isSpecify, setIsSpecify] = useState(false)
    const [price, setPrice] = useState('')
    const [endDate, setEndDate] = useState('')

    const navigate = useNavigate()

    const takeOrder = () => {
        let order = orders.filter(el => el.order_id === orderId)[0]
        if (orderId) {
            if (order.order_status === 'new'){
                api.post('/orders/take', {} , {headers: {Authorization: `Bearer ${token}`}, params: {order_id: orderId}})
                    .then((res) => {
                        console.log(res)
                        onOrders([])
                        onError('')
                    }).catch((e) => onError(e.response.data.message))
            } else {
                onError('Вы не можете принять заказ')
            }

        } else {
            onError('Выберите заказ со статусом new')
        }
    }

    const specifyOrder = () => {
        setIsSpecify(!isSpecify)
        api.post('/orders/specify', {order_id: orderId, price, end_dt: endDate}, {headers: {Authorization: `Bearer ${token}`}})
                .then((res) => {
                    console.log(res)
                    onError('')
                    onOrders([])
                }).catch((e) => onError(e.response.data.message))
    }

    const updateStatus = () => {
        let order = orders.filter(el => el.order_id === orderId)[0]
        if (orderId) {
            if (order.order_status === 'confirmation'){
                api.post('/orders/update', {},{headers: {Authorization: `Bearer ${token}`}, params: {status: 'purchase', order_id: orderId}})
                    .then((res) => {
                        console.log(res)
                        onError('')
                        onOrders([])
                    }).catch((e) => onError(e.response.data.message))
            } else {
                if (order.order_status === 'ready'){
                    api.post('/orders/update', {},{headers: {Authorization: `Bearer ${token}`}, params: {status: 'done', order_id: orderId}})
                        .then((res) => {
                            console.log(res)
                            onError('')
                            onOrders([])
                        }).catch((e) => onError(e.response.data.message))
                } else {
                    onError('Вы не можете повысить статус заказ')
                }
            }

        } else {
            onError('Выберите заказ со статусом confirmation или ready')
        }
    }

    const cancelOrder = () => {
        setIsCancel(!isCancel)
            api.post('/orders/cancel', {}, {headers: {Authorization: `Bearer ${token}`}, params: {reason, order_id: orderId}})
                .then((res) => {
                    console.log(res)
                    onError('')
                    onOrders([])
                }).catch((e) => onError(e.response.data.message))
    }

    return (
        <div className={styles.UserOrders}>
            <button type="button" onClick={() => navigate('/add-order', {replace: true})}>Добавить заказ</button>
            <OrdersTable orders={orders} role={role} onOrderId={setOrderId} onStatus={onStatus} onError={onError} />
            {orders?.length 
                ? <>
                    {error && <p className={styles.require}>{error}</p>}
                    <button type="button" onClick={takeOrder}>Принять заказ</button>
                    {/* <button type="button" onClick={deleteOrder}>Принять заказ</button> */}
                    {isSpecify ? 
                        <>
                            <input type="number" placeholder="Введите стоимость" onChange={(e) => setPrice(+e.target.value)} />
                            <input type="date" placeholder="Выберите дату окончания" onChange={(e) => setEndDate(e.target.value)} />
                            <button type="button" onClick={specifyOrder}>Отправить</button>
                        </>
                        :
                        <button type="button" onClick={() => {
                            if (orderId) {
                                let order = orders.filter(el => el.order_id === orderId)[0]
                                if ('specification' === order.order_status){
                                    setIsSpecify(!isSpecify)
                                } else {
                                    onError('Вы не можете закончить спецификацию этого заказа')
                                }
                            } else {
                                onError('Выберите заказ')
                            }
                        }}>Завершить спецификацию</button>
                    }
                    <button type="button" onClick={() => updateStatus()}>Повысить статус</button>
                    {isCancel ? 
                        <>
                            <textarea onChange={(e) => setReason(e.target.value)} placeholder="Введите причину отмены">
                            </textarea>
                            <button type="button" onClick={cancelOrder}>Отправить</button>
                        </>
                        :
                        <button type="button" onClick={() => {
                            if (orderId) {
                                let order = orders.filter(el => el.order_id === orderId)[0]
                                if ('new' === order.order_status || 'confirmation' === order.order_status){
                                    setIsCancel(!isCancel)
                                } else {
                                    onError('Вы не можете отменить этот заказ')
                                }
                            } else {
                                onError('Выберите заказ')
                            }
                        }}>Отменить заказ</button>
                    }
                </>
                : <p className={styles.require}>Заказов нет</p>
            }
        </div>
    )
}

export default ClientManagerOrders;