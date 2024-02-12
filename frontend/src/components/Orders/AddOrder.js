import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/api";
import styles from "./addOrders.module.css";

const AddOrder = () => {
    const { orderId } = useParams()

    const token = Cookies.get('token')
    const role = Cookies.get('role')

    const [orderName, setOrderName] = useState('')
    const [orderDescription, setOrderDescription] = useState('')
    const [dimensions, setDimensions] = useState('')
    const [orderImg, setOrderImg] = useState('')
    const [getImg, setGetImg] = useState('')

    const [clients, setClients] = useState([])
    const [clientId, setClientId] = useState('')

    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (orderId) {
            api.get('/orders/get', {headers: {Authorization: `Bearer ${token}`}, params: {status: ''}})
            .then((res) => {
                console.log(res)
                let order = res.data.filter((el) => el.order_id === orderId)[0]
                setOrderName(order.order_name)
                setOrderDescription(order.goods_description)
                setDimensions(order.dimensions)
                setGetImg(order.image_paths)
                setError('')
            }).catch((e) => setError(e.response.data.message))
        }
        if (!clients.length && role === 'client_manager'){
            api.get('/user/get', {headers: {Authorization: `Berear ${token}`}})
                .then((res) => {
                    let data = res.data.filter(el => el.Role === 'client')
                    setClients(data)
                    if (!clientId){
                        setClientId(data[0].id)
                    }
                    setError('')
                }).catch((e) => setError(e.response.data.message))
        }
    }, [clients, navigate, orderId, role, token])

    const createOrder = () => {
        let order = new FormData()
        order.append('order_name', orderName)
        order.append('goods_description', orderDescription)
        order.append('goods_dimensions', dimensions)
        for (let i of orderImg){
            order.append('files', i)
        }
        for (let i of getImg){
            order.append('files', i)
        }
        if (role === 'client_manager'){
            order.append("customer_id", clientId)
        }
        api.post('/orders/create', order, {headers: {Authorization: `Berear ${token}`}})
            .then(() =>{ 
                navigate('/', {replace: true})
            })
            .catch(e => setError(e.response.data.message))
    }

    const editOrder = () => {
        let order = {
            "order_id": orderId,
            "order_name": orderName,
            "goods_description": orderDescription,
            "goods_dimensions": dimensions
        }
        api.post('/orders/edit', order, {headers: {Authorization: `Berear ${token}`}})
            .then(() =>{ 
                navigate('/', {replace: true})
            })
            .catch(e => setError(e.response.data.message))
    }

    return (
        <div className={styles.addOrder}>
            <h2>{orderId ? 'Редактирование': 'Создание'} заказа</h2>
            <form className={styles.addOrderForm}>
                <input type="text" placeholder="Введите название заказа" onChange={(e) => setOrderName(e.target.value)} defaultValue={orderName} />
                {role === 'client_manager' && 
                    <select defaultValue={clientId} onChange={(e) => setClientId(e.target.value)}>
                        {clients.map((el) => 
                            <option value={el.id} key={el.id}>{el.full_name}</option>
                        )}
                    </select>
                }
                <textarea placeholder="Введите описание заказа" onChange={(e) => setOrderDescription(e.target.value)} defaultValue={orderDescription}></textarea>
                <input type="text" placeholder="Введите замеры" onChange={(e) => setDimensions(e.target.value)} defaultValue={dimensions}/>
                {error && <p className={styles.require}>{error}</p>}
                {orderId ?
                    <button type="button" onClick={() => editOrder()}>Редактировать заказ</button> :
                    <>
                        <input type="file" name="file" multiple="multiple" id="selectFile" accept="image" onChange={(e) => setOrderImg(e.target.files)} required/>
                        <button type="button" onClick={() => createOrder()}>Создать заказ</button>
                    </>
                    
                }
                <button type="button" onClick={() => navigate('/', {replace: true})}>Назад</button>
            </form>
            
        </div>
    )
}

export default AddOrder;