import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/api";
import styles from './specification.module.css';

const GoodSpecification = () => {
    const {goodId} = useParams()
    const [token, setToken] = useState(Cookies.get('token'))

    const [specify, setSpecify] = useState('')
    const [semifs, setSemifs] = useState([])
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setToken(Cookies.get('token'))
        if (!token) {
            navigate('/login', { replace: true })
        } else {
            api.get('specifications/goods/get', {headers: {Authorization: `Berear ${token}`}, params: {good_id: goodId}})
                .then((res) => {
                    console.log(res.data)
                    if (res.data.data.ings){
                        setSpecify(res.data.data)
                        setSemifs(res.data.semifs)
                    } else {
                        navigate(`/specify/create/${goodId}`, {replace: true})
                    }
                }).catch(e => setError(e.response.data.message))
        }
    }, [goodId, navigate, token])

    return (
        <div className={styles.GoodSpecification}>
            <h2>Спецификация изделия "{specify?.good_name}"</h2>
            <h3>Ингредиенты</h3>
            {specify.ings?.length && 
                <ol>
                    {specify.ings.map(el => <li>{el.ingredients_name} - {el.qty} {el.unit}</li>)}
                </ol>
            }
            <h3>Украшения</h3>
            {specify.decs?.length && 
                <ol>
                    {specify.decs.map(el => <li>{el.sku_name} - {el.qty} {el.unit}</li>)}
                </ol>
            }
            <h3>Полуфабрикаты</h3>
            {specify.semifs?.length && 
                <ol>
                    {specify.semifs.map(el => <li>{el.semifinished} - {el.qty} шт.</li>)}
                </ol>
            }    
            <h3>Операции</h3>
            {specify.opers?.length && 
                <ol>
                    {specify.opers.map(el => 
                        <>
                            <li>{el.operation}</li>
                            <ul>
                                <li><b>Тип оборудования:</b> {el.eqp_type_name}</li>
                                <li><b>Время на операцию:</b> {el.op_time} минут</li>
                            </ul>
                        </>)}
                </ol>
            }
            <h3>Замеры</h3>
            <p>{ specify.dimension }</p>
            <h3>Словесное описание</h3>
            <p>{ specify.operation_seq }</p>

            {semifs?.length ?
                semifs.map(el => 
                    <div>
                        <h2>Спецификация полуфабриката "{el.semifinished}"</h2>
                        <h3>Ингредиенты</h3>
                        <ol>
                            {el.semif_ings.map(ing => <li key={ing.ingredient_id}>{ing.ingredients_name} - {ing.qty} {ing.unit}</li>)}
                        </ol>
                        <h3>Операции</h3>
                        <ol>
                            {el.opers.map(oper => 
                            <>
                                <li>{oper.operation}</li>
                                <ul>
                                    <li><b>Тип оборудования:</b> {oper.eqp_type_name}</li>
                                    <li><b>Время на операцию:</b> {oper.op_time} минут</li>
                                </ul>
                            </>)}
                        </ol>
                    </div>
                ) : ''}
            {error && <p className={styles.require}>{ error }</p>}
            <button type="button" onClick={() => navigate(`/specify/edit/${goodId}`, {replace: true})}>Редактировать спецификацию</button>
        </div>
    )
}

export default GoodSpecification;