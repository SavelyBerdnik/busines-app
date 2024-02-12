import { useEffect, useState } from "react";
import styles from '../Auth/auth.module.css'

const IngridientsPage = () => {
    const [ingredients, setIngridients] = useState([]);
    const [expDt, setExpDt] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});

    const getData = () => {
        fetch(`http://localhost:8080/ingredients/get${expDt ? '_with_filter?dt=' + expDt : ''}`)
            .then(res => res.json())
            .then(res => setIngridients(res))
            .catch((e) => setError(e.response.data.message))
    }

    const [error, setError] = useState('')

    useEffect(() => {
        getData();
    }, [expDt])

    const handleExpDt = (expDt) => {
        if (expDt <= 0 && expDt !== '') return
        setExpDt(expDt)
    }

    const handleEdit = (id) => {
        setEditData(ingredients.data.find(el => id === el.ingredient_id));
        setIsEdit(prev => prev = !prev)
    }
    const handleEditSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/ingredients/update?ingredient_id=${editData.ingredient_id}`, {
            method: 'POST',
            body: JSON.stringify({ ...editData }),
        })
            .then(() => {
                setIsEdit(false);
                getData();
                setEditData({});
            }).catch((e) => setError(e.response.data.message))
    }

    const handleRemove = (id) => {
        fetch(`http://localhost:8080/ingredients/remove?id=${id}`, {
            method: 'POST'
        })
            .then((res) => {
                if (res.status === 400) {
                    return res.json();
                }
                return res;
            })
            .then((data) => {
                if (data && data.message) {
                    setError(data.message);
                } else {
                    getData();
                }
            })
            .catch((e) => setError(e || 'An error occurred'));
    }


    return (
        <>
            {error && <p className={styles.require}>{error}</p>}
            {isEdit && <form style={{ marginBottom: '40px' }}>
                <label htmlFor="ingredients_name">ingredients_name: </label>
                <input type="text" id="ingredients_name" value={editData?.ingredients_name} onChange={(e) => {
                    setEditData(prev => ({ ...prev, ingredients_name: e.target.value }))
                }} />
                <label htmlFor="unit">Количество: </label>
                <input id="unit" onChange={(e) => {
                    setEditData(prev => ({ ...prev, unit: e.target.value }))
                }} value={editData?.unit} type="text" />
                <label htmlFor="qty">Наименование: </label>
                <input id="qty" onChange={(e) => {
                    setEditData(prev => ({ ...prev, qty: +e.target.value }))
                }} value={editData?.qty} type="number" />
                <button onClick={handleEditSubmit} type="submit">Отправить</button>
            </form>}
            <h1>purchase_sum: {ingredients.purchase_sum}</h1>
            <h1>count: {ingredients.count}</h1>
            <label htmlFor="exp_dt">Срок годности: </label>
            <input id="exp_dt" type="number" min="1" onChange={(e) => handleExpDt(e.target.value)} />
            <table border={1}>
                <tr>
                    <td>edt</td>
                    <td>exp_dt</td>
                    <td>ingredients_name</td>
                    <td>purchase_price</td>
                    <td>supplier_id</td>
                    <td>supplier_name</td>
                    <td>unit</td>
                    <td>qty</td>
                    <td></td>
                </tr>
                {ingredients && ingredients?.data?.map(el => {
                    return (
                        <tr>
                            <td>{el.edt}</td>
                            <td>{el.exp_dt}</td>
                            <td>{el.ingredients_name}</td>
                            <td>{el.purchase_price}</td>
                            <td>{el.supplier_id}</td>
                            <td>{el.supplier_name}</td>
                            <td>{el.unit}</td>
                            <td>{el.qty}</td>
                            <td><button onClick={() => handleEdit(el.ingredient_id)}>Редактировать</button></td>
                            <td><button onClick={() => {
                                handleRemove(el.ingredient_id);
                            }}>Удалить</button></td>
                        </tr>
                    )
                })}
            </table>
        </>
    )
}

export default IngridientsPage;