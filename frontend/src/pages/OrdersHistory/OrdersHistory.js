import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import styles from './ordersHistory.module.css';

const OrdersHistory = () => {
    const [token, setToken] = useState(Cookies.get('token'))
    const [history, setHistory] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setToken(Cookies.get('token'))
        if (!token) {
            navigate('/login', { replace: true })
        } else {
            api.get('/orders/logs', {headers: {Authorization: `Berear ${token}`}})
                .then((res) => {
                    console.log(res.data)
                    if (res.data){
                        setHistory(res.data)
                        setError('')
                    } else {
                        setHistory([])
                        setError('История пуста')
                    }
                    
                }).catch(e => setError(e.response.data.message))
        }
    }, [navigate, token])

    return (
        <div className={styles.OrdersHistory}>
            <h2>История заказов</h2>
            {history ?
                <table className={styles.historyTable}>
                    <thead>
                        <tr>
                            <td><b>Номер заказа</b></td>
                            <td><b>Дата изменения</b></td>
                            <td><b>Новый статус</b></td>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((el) => 
                            <tr>
                                <td>{el.order_id}</td>
                                <td>{el.dt}</td>
                                <td>{el.new_status}</td>
                            </tr>
                            )}
                    </tbody>
                </table> 
                : <p className={styles.require}>{error}</p>
            }
        </div>
    )
}

export default OrdersHistory;