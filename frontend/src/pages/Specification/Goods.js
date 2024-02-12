import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import styles from './specification.module.css';

const Goods = () => {
    const [token, setToken] = useState(Cookies.get('token'))
    const [goods, setGoods] = useState([])
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setToken(Cookies.get('token'))
        if (!token) {
            navigate('/login', { replace: true })
        } else {
            api.get('/goods/get ', {headers: {Authorization: `Berear ${token}`}})
                .then((res) => {
                    console.log(res.data)
                    if (res.data){
                        setGoods(res.data)
                        setError('')
                    } else {
                        setGoods([])
                        setError('Изделий нет')
                    }
                }).catch(e => setError(e.response.data.message))
        }
    }, [token, navigate])
    return (
        <div className={styles.Goods}>
            <h2>Изделия</h2>
            {goods?.length ?
                <table className={styles.goodsTable}>
                    <thead>
                        <tr>
                            <td><b>ID</b></td>
                            <td><b>Название</b></td>
                            <td><b>Описание</b></td>
                            <td><b>Замеры</b></td>
                        </tr>
                    </thead>
                    <tbody>
                        {goods.map(el => 
                            <tr onClick={() => navigate(`/specify/${ el.good_id }`, {replace: true})}>
                                <td>{ el.good_id }</td>
                                <td>{ el.goods_name }</td>
                                <td>{ el.goods_description }</td>
                                <td>{ el.dimensions }</td>
                            </tr>)}
                    </tbody>
                </table>
                : <p className={styles.require}>{error}</p>}
        </div>
    )
}

export default Goods;