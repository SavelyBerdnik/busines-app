import React, { useState } from 'react';
import styles from "./ordersTable.module.css";
import { Link } from 'react-router-dom';

const OrdersTable = ({ orders, role, onOrderId, onStatus, onError }) => {
    const [prevCheck, setPrevCheck] = useState('')
    const statuses = [
        {
            name: 'Новые заказы',
            value: 'new'
        },
        {
            name: 'Выполненные заказы',
            value: 'done'
        },
        {
            name: 'Текущие заказы',
            value: 'current'
        },
        {
            name: 'Отклоненные заказы',
            value: 'declined'
        },
    ]
    const client_statuses = ['new', 'declined', 'specification', 'confirmation']

    const onSelectOrder = (target, order) => {
        if (role !== 'director') {
            let tr = target.closest('TR');
            if (!tr)
                return
            if (tr.classList.contains(styles.check)) { // убрать существующую подсветку, если есть
                tr.classList.remove(styles.check);
                setPrevCheck("")
                onOrderId("")
                onError('')
            } else {
                if (role === 'client' && !client_statuses.includes(order.order_status)) {
                    console.log('HAha')
                    return
                }
                tr.classList.add(styles.check);
                if (prevCheck) {
                    prevCheck.classList.remove(styles.check);
                    setPrevCheck("")
                    onError('')
                }
                setPrevCheck(tr)
                onOrderId(order.order_id)
                console.log(order.order_id)
                tr.classList.add(styles.check);
            }
        }
    }

    return (
        <div>
            <select onChange={(e) => onStatus({ value: e.target.value, change: true })} className={styles.ordersSelect}>
                <option value=''>-- Выберите группу заказов --</option>
                {statuses.map((el) => <option value={el.value}>{el.name}</option>)}
            </select>
            {orders?.length ?
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <td>Номер заказа</td>
                            <td>Дата создания</td>
                            <td>Название</td>
                            <td>Статус</td>
                            <td>Цена</td>
                            <td>Клиент</td>
                            <td>Дата выполнения</td>
                            <td>Клиент менеджер</td>
                            {role === 'client_manager' && <td>Диаграмма Ганта</td>}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((el) =>
                            < tr onClick={(e) => { onSelectOrder(e.target, el) }} key={el.order_id}>
                                <td>{el.order_id}</td>
                                <td>{el.dt}</td>
                                <td>{el.order_name}</td>
                                <td>{el.order_status}</td>
                                <td>{el.price}</td>
                                <td>{el.customer_name}</td>
                                <td>{el.end_dt}</td>
                                <td>{el.manager_name}</td>
                                {role === 'client_manager' && <td><Link to={'/gantt/' + el.good_id}>Открыть</Link></td>}
                            </tr>
                        )}
                    </tbody>
                </table> : <></>
            }
        </div >

    )
}

export default OrdersTable;