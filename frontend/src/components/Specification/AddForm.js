import React, { useEffect, useState } from "react";
import styles from './addSpecification.module.css';
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const AddForm = ({openIndex, setOpenIndex, action, goodId, error, setError, token}) => {
    const [ingredients, setIngredients] = useState(action === 'create' ? [
        {
            good_id: +goodId,
            ingredient_id: 0,
            qty: 0
        }] : [])
    const [AllIngredients, setAllIngredients] = useState([])

    const [decorations, setDecorations] = useState([])
    const [AllDecorations, setAllDecorations] = useState([])
    
    const [semifinished, setSemifinished] = useState([])

    const [operations, setOperations] = useState([])
    const [equipments, setEquipmets] = useState([])
    const [checkResult, setCheckResult] = useState('')

    const [finished, setFinished] = useState({
        good_id: +goodId,
        operation_sequence: '',
        dimensions: ''
    })

    const navigate = useNavigate()

    useEffect(() => {
        api.get('/ingredients/get', {headers: {Authorization: `Berear ${token}`}})
            .then((res) => {
                console.log(res.data.data)
                if (res.data?.data){
                    setAllIngredients(res.data?.data)
                    setError('')
                } else {
                    setAllIngredients([])
                    setError('Ингредиентов нет')
                }
            }).catch(e => console.log(e.response?.data.message))
        api.get('/cakedecorations/get', {headers: {Authorization: `Berear ${token}`}})
            .then((res) => {
                console.log(res.data.Data)
                if (res.data?.Data){
                    setAllDecorations(res.data?.Data)
                    setError('')
                } else{
                    setAllDecorations([])
                    setError('Декораций нет')
                }
            }).catch(e => console.log(e.response?.data.message))
        api.get('/equipment/get', {headers: {Authorization: `Berear ${token}`}})
            .then((res) => {
                console.log(res.data)
                if (res.data){
                    setEquipmets(res.data)
                    setError('')
                } else {
                    setEquipmets([])
                    setError('Ингредиентов нет')
                }
            }).catch(e => console.log(e.response?.data.message))
        if (action === 'edit') {
            api.get('/specifications/ingredients/get', {headers: {Authorization: `Berear ${token}`}, params: {good_id: goodId}})
                .then(res => {
                    console.log(res.data)
                    if (res.data){
                        setIngredients(res.data)
                    }
                }).catch(e => console.log(e.response?.data.message))
            api.get('/specifications/decorations/get', {headers: {Authorization: `Berear ${token}`}, params: {good_id: goodId}})
                .then(res => {
                    console.log(res.data)
                    if (res.data){
                        setDecorations(res.data)
                    }
                }).catch(e => console.log(e.response?.data.message))
            api.get('/specifications/semifinished/get', {headers: {Authorization: `Berear ${token}`}, params: {good_id: goodId}})
                .then(res => {
                    if (res.data){
                        setSemifinished(res.data)
                    }
                }).catch(e => console.log(e.response?.data.message))
            api.get('/specifications/operation/get', {headers: {Authorization: `Berear ${token}`}, params: {good_id: goodId}})
                .then(res => {
                    if (res.data){
                        setOperations(res.data)
                    }
                }).catch(e => console.log(e.response?.data.message))
            api.get('/specifications/final/get', {headers: {Authorization: `Berear ${token}`}, params: {good_id: goodId}})
                .then(res => {
                    if (res.data){
                        setFinished(res.data)
                    }
                }).catch(e => setError(e.response?.data.message))
        }
    }, [action, token])

    const checkOperations = () => {
        api.post('/specifications/operation/validate', operations, {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                setCheckResult('Успешно')
            }).catch((e) => {
                setCheckResult(e.response.data?.message || e.response.data)
            })
    }

    const sendSpecify = () => {
        console.log(ingredients)
        api.post('/specifications/ingredients/create', ingredients, {headers: {Authorization: `Berear ${token}`}})
            .then(res => res)
            .catch((e) => setError(e.response.data.message))
        if (decorations.length) {
            api.post('/specifications/decorations/create', decorations, {headers: {Authorization: `Berear ${token}`}})
                .then(res => res)
                .catch((e) => setError(error + e.response.data.message))
        }
        if (semifinished.length) {
            api.post('/specifications/semifinished/create', semifinished, {headers: {Authorization: `Berear ${token}`}})
                .then(res => res)
                .catch((e) => setError(error + e.response.data.message))
        }
        if (operations.length) {
            api.post('/specifications/operation/create', operations, {headers: {Authorization: `Berear ${token}`}})
                .then(res => res)
                .catch((e) => setError(error + e.response.data.message))
        }
        api.post('/specifications/finish/create', finished, {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                setTimeout(() => {
                if (!error){
                    navigate(`/specify/${goodId}`,{replace: true})
                }}, 500)
            })
            .catch((e) => setError(error + e.response.data.message))
    }

    return (
        <form className={styles.AddForm}>
                {openIndex === 0 ?
                <>
                    {ingredients.map((ing) => 
                        <div className={styles.AddElement}>
                            <select onChange={(e) => ing.ingredient_id = +e.target.value} defaultValue={`${ing.ingredient_id}`} >
                                {AllIngredients.map(all_ing => 
                                    <option value={all_ing.ingredient_id}>{all_ing.ingredients_name}</option>)}
                            </select>
                            <input type="number" onChange={(e) => ing.qty = +e.target.value} defaultValue={`${ing.qty}`} />
                            {ingredients.length > 1 
                                ? <button type="button" onClick={() => {
                                    setIngredients(ingredients.filter(current_ing => current_ing !== ing))
                                    setOpenIndex(1)
                                    setTimeout(() => {setOpenIndex(0)}, 100)
                                }}>Удалить</button> 
                                : ''}
                        </div>
                        )}
                    <button type="button" className={styles.AddButton} onClick={() => setIngredients([...ingredients, {
                        good_id: +goodId,
                        ingredient_id: 1,
                        qty: 0
                    }])}>Добавить ингредиент</button>
                </> :
                    openIndex === 1 ?
                        <>
                            {decorations.map((el) => 
                                <div className={styles.AddElement}>
                                    <select onChange={(e) => el.sku_id = +e.target.value} defaultValue={`${el.sku_id}`} >
                                        {AllDecorations.map(dec => 
                                            <option value={dec.sku_id}>{dec.sku_name}</option>)}
                                    </select>
                                    <input type="number" onChange={(e) => el.qty = +e.target.value} defaultValue={`${el.qty}`} />
                                    <button type="button" onClick={() => {
                                        setDecorations(decorations.filter(dec => dec !== el))
                                        setOpenIndex(0)
                                        setTimeout(() => {setOpenIndex(1)}, 10)
                                    }}>Удалить</button>
                                </div>
                                )}
                            <button type="button" onClick={() => setDecorations([...decorations, {
                                good_id: +goodId,
                                sku_id: 1,
                                qty: 0
                            }])}>Добавить декорации</button>
                        </> :
                            openIndex === 2 ?
                                <>
                                    {semifinished.map(element => 
                                        <div className={styles.semifinish}>
                                            <input placeholder="Введите название полуфабриката" onChange={(e) => element.semifinished = e.target.value} defaultValue={element.semifinished} />
                                            <input type="number" onChange={(e) => element.qty = +e.target.value} defaultValue={element.qty} />
                                            {element.semif_ings?.length ? <h3>Ингредиенты</h3>: ''}
                                            {element.semif_ings.map((el) => 
                                                <div className={styles.AddElement}>
                                                    <select onChange={(e) => el.ingredient_id = +e.target.value} defaultValue={`${el.ingredient_id}`} >
                                                        {AllIngredients.map(ing => 
                                                            <option value={ing.ingredient_id}>{ing.ingredients_name}</option>)}
                                                    </select>
                                                    <input type="number" onChange={(e) => el.qty = +e.target.value} defaultValue={el.qty} />
                                                    <button type="button" onClick={() => {
                                                        element.semifs_ings = element.semifs_ings.filter(ing => ing !==  el)
                                                        setOpenIndex(1)
                                                        setTimeout(() => {setOpenIndex(2)}, 1)
                                                    }}>Удалить</button>
                                                </div>
                                                )}
                                            <button type="button" onClick={() => {
                                                element.semif_ings = [...element.semif_ings, {
                                                    ingredient_id: 1,
                                                    qty: 0
                                                }]
                                                setOpenIndex(1)
                                                setTimeout(() => {setOpenIndex(2)}, 1)
                                            }}>Добавить ингредиент</button>
                                            <button type="button" onClick={() => {
                                                setSemifinished(semifinished.filter(semif => semif !== element))
                                                setOpenIndex(1)
                                                setTimeout(() => {setOpenIndex(2)}, 1)
                                            }}>Удалить полуфабрикат</button>
                                        </div>
                                    )}
                                    <button type="button" onClick={() => setSemifinished([...semifinished, {
                                        good_id: +goodId,
                                        semif_ings: [],
                                        qty: 0, 
                                        semifinished: '',
                                    }])}>Добавить полуфабрикат</button>
                                </> :
                                    openIndex === 3 ?
                                    <>
                                        {operations.map(el => 
                                            <div className={styles.operation}>
                                                <div className={styles.AddElement}>
                                                    <input type="number" min='1' onChange={(e) => el.operation_seq = +e.target.value} defaultValue={el.operation_seq} />
                                                    <input placeholder="Введите название операции" onChange={(e) => el.operation = e.target.value} defaultValue={el.operation} />
                                                </div>
                                                <select onChange={(e) => el.semif = e.target.value} defaultValue={el.semif} >
                                                    <option value=""> Изделие </option>
                                                    {semifinished.map(el => 
                                                        <option value={el.semifinished}>Полуфабрикат "{el.semifinished}"</option>)}
                                                </select>
                                                <select onChange={(e) => el.eqp_type_id = +e.target.value} defaultValue={`${el.eqp_type_id}`} >
                                                    {equipments.map(el => 
                                                        <option value={el.eqp_type_id}>{el.eqp_title}</option>)}
                                                </select>
                                                <div className={styles.AddElement}>
                                                    <input type="number" min="1" onChange={(e) => el.op_time = +e.target.value} defaultValue={el.op_time} />
                                                    <p>минут</p>
                                                </div>
                                                
                                                <button type="button" onClick={() => {
                                                    setOperations(operations.filter(element => element !== el))
                                                    setOpenIndex(1)
                                                    setTimeout(() => {setOpenIndex(3)}, 1)
                                                }}>Удалить операцию</button>
                                            </div>
                                        )}
                                        <button type="button" onClick={() => setOperations([...operations, {
                                            goods_id: +goodId,
                                            operation_seq: operations.length + 1,
                                            operation: '',
                                            eqp_type_id: 0,
                                            op_time: 1,
                                            semif: '',
                                        }])}>Добавить операцию</button>
                                        {checkResult === 'Успешно' ? 
                                            <p className={styles.good}>{ checkResult }</p>: 
                                            checkResult ? 
                                                <p className={styles.require}>{ checkResult }</p> : ''}
                                        {operations.length ? <button type="button" onClick={checkOperations}>Проверить</button> : ''}
                                    </> : 
                                        <>
                                            <textarea placeholder="Введите словестное описание" onChange={(e) => finished.operation_sequence = e.target.value} defaultValue={finished.operation_sequence}></textarea>
                                            <textarea placeholder="Введите замеры" onChange={(e) => finished.dimensions = e.target.value} defaultValue={finished.dimensions}></textarea> 
                                        </>}
                {error && <p className={styles.require}>{ error }</p>}
                {openIndex < 4 && <button type="button" onClick={() => {
                    setOpenIndex(openIndex + 1)
                    setCheckResult('')
                    }}>Далее</button>}
                {openIndex === 4 && <button type="button" onClick={() => sendSpecify()}>Отправить</button>}
                {openIndex > 0 && <button type="button" onClick={() => setOpenIndex(openIndex - 1)}>Назад</button>}
            </form>

    )
}

export default AddForm;