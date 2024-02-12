import React, { useEffect, useState } from "react";
import styles from './reports.module.css';
import { api } from "../../utils/api";

const IngredientsDecorationsReport = ({token, onBack, role}) => {
    const [reportType, setReportType] = useState(0)
    const [error, setError] = useState('')

    const [ingredientsTypes, setIngredientsTypes] = useState([])
    const [ingredients, setIngredients] = useState([])

    const [decorationsTypes, setDecorationsTypes] = useState([])
    const [decorations, setDecorations] = useState([])

    const [page, setPage] = useState(0)
    const [type, setType] = useState('')
    const [showTypes, setShowTypes] = useState(false)

    useEffect(() => {
        api.get('/ingredients/get-pages', {headers: {Authorization: `Berear ${token}`}, params: {page, type}})
            .then(res => {
                console.log(res.data)
                setIngredients(res.data)
            }).catch(e => setError(e.response.data.message))
        api.get('/ingredients/get-types', {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                console.log(res.data)
                setIngredientsTypes(res.data)
            }).catch(e => setError(e.response.data.message))
        api.get('/cakedecorations/get-pages', {headers: {Authorization: `Berear ${token}`}, params: {page, type}})
            .then(res => {
                console.log(res.data)
                setDecorations(res.data)
            }).catch(e => setError(e.response.data.message))
        api.get('/cakedecorations/get-types', {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                console.log(res.data)
                setDecorationsTypes(res.data)
            }).catch(e => setError(e.response.data.message))
    }, [page, token, type])

    return (
        <div className={styles.CurrentReport}>
            <h2>Отчёт по остаткам {reportType === 0 ? 'ингредиентов': 'украшений'} для торта</h2>
            <select onChange={(e) => setReportType(+e.target.value)}>
                <option value='0'>Ингредиенты</option>
                <option value='1'>Украшения</option>
            </select>
            <select onChange={(e) => setType(e.target.value)} defaultValue={type}>
                <option value=''>-- Выберите тип --</option>
                {reportType === 0 ? 
                    ingredientsTypes.map(el => <option value={ el.ingredients_type }>{ el.ingredients_type }</option>)
                    : decorationsTypes.map(el => <option value={ el.cake_decor_type }>{ el.cake_decor_type }</option>) 
                }
            </select>
            <button type="button" onClick={() => setShowTypes(!showTypes)}>{showTypes ? 'Скрыть': 'Вывести'} типы</button>
            {showTypes ? 
                <>
                    <h3>Типы</h3>
                    <ul>
                        {reportType === 0 ?
                            ingredientsTypes.map(el => <li>{ el.ingredients_type }</li>)
                            : decorationsTypes.map(el => <li>{ el.cake_decor_type }</li>)
                        }
                    </ul>
                </>
                : ''
            }
            {(ingredients?.length && reportType === 0) || (decorations?.length && reportType === 1) ? 
                <table>
                    <thead>
                        <tr>
                            <td><b>Название</b></td>
                            <td><b>Дата</b></td>
                            <td><b>Количество</b></td>
                            <td><b>Единицы количества</b></td>
                        </tr>
                    </thead>
                    <tbody>
                        {reportType === 0 ? 
                            ingredients.map(el => 
                                <tr>
                                    <td>{ el.ingredients_name }</td>
                                    <td>{ el.exp_date }</td>
                                    <td>{ el.qty }</td>
                                    <td>{ el.unit }</td>
                                </tr>)
                            : decorations.map(el => 
                                <tr>
                                    <td>{ el.sku_name }</td>
                                    <td>{ el.exp_date }</td>
                                    <td>{ el.qty }</td>
                                    <td>{ el.unit }</td>
                                </tr>)
                        }
                    </tbody>
                </table> : ''
            }
            
            {page > 0 && <button type="button" onClick={() => setPage(page - 1)}>{'<-'}</button>}
            <button type="button" onClick={() => setPage(page + 1)}>{'->'}</button>
            {role === 'director' && <button type="button" onClick={() => onBack('')}>Назад</button>}
        </div>
    )
}

export default IngredientsDecorationsReport;