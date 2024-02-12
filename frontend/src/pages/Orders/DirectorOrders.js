import React from "react";
import OrdersTable from "../../components/Orders/OrdersTable";
import styles from './orders.module.css';

const DirectorOrders = ({ role, orders, error, onStatus }) => {
    return (
        <div>
            <OrdersTable orders={orders} role={role} onStatus={onStatus} />
            {orders.length 
                ? <>
                    {error && <p className={styles.require}>{error}</p>}
                </>
                : <p className={styles.require}>Заказов нет</p>
                }
        </div>
    )
}

export default DirectorOrders;