import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/api";
import styles from "./addSpecification.module.css";
import AddForm from "./AddForm";

const AddSpecification = () => {
    const {action, goodId} = useParams()
    const [token, setToken] = useState(Cookies.get('token'))
    const [error, setError] = useState('')
    
    const [openIndex, setOpenIndex] = useState(0)
    
    const [goodName, setGoodName] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setToken(Cookies.get('token'))
        if (!token) {
            navigate('/login', { replace: true })
        } else {
            api.get('/specifications/goods/get', {headers: {Authorization: `Berear ${token}`}, params: {good_id: goodId}})
            .then((res) => {
                console.log(res.data)
                if (res.data){
                    setGoodName(res.data.data.good_name)
                    setError('')
                } else {
                    setGoodName('')
                    setError('Изделий нет')
                }
            }).catch(e => setError(e.response.data.message))
        }
    }, [action, navigate, token])

    return (
        <div className={styles.AddSpecification}>
            <h2>{action === 'create' ? 'Создание':  'Редактирование'} спецификации изделия "{goodName}"</h2>
            <p>
                <span className={openIndex === 0 ? styles.check : ''} onClick={() => setOpenIndex(0)}>Ингредиенты</span>
                {action === 'edit' || openIndex > 0 ? <span className={openIndex === 1 ? styles.check : ''} onClick={() => setOpenIndex(1)}> > Декорации</span>: ''}
                {action === 'edit' || openIndex > 1 ? <span className={openIndex === 2 ? styles.check : ''} onClick={() => setOpenIndex(2)}> > Полуфабрикаты</span> : ''}
                {action === 'edit' || openIndex > 2 ? <span className={openIndex === 3 ? styles.check : ''} onClick={() => setOpenIndex(3)}> > Операции</span> : ''}
                {action === 'edit' || openIndex > 3 ? <span className={openIndex === 4 ? styles.check : ''} onClick={() => setOpenIndex(4)}> > Завершение</span> : ''}
            </p>
            <AddForm openIndex={openIndex} setOpenIndex={setOpenIndex} action={action} goodId={goodId} error={error} setError={setError} token={token} />
        </div>
    )
}

export default AddSpecification