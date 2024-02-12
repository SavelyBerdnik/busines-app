import { useEffect, useState } from "react";
import styles from '../Auth/auth.module.css'

const DecorationsPage = () => {
    const [decorations, setDecorations] = useState([]);
    const [expDt, setExpDt] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [error, setError] = useState('')

    const getData = () => {
        fetch(`http://localhost:8080/cakedecorations/get${expDt ? '_with_filter?dt=' + expDt : ''}`)
            .then(res => res.json())
            .then(res => setDecorations(res))
            .catch((e) => setError(e.response.data.message))
    }

    useEffect(() => {
        getData();
    }, [expDt])

    const handleExpDt = (expDt) => {
        if (expDt <= 0 && expDt !== '') return
        setExpDt(expDt)
    }

    const handleRemove = (id) => {
        fetch(`http://localhost:8080/cakedecorations/remove?id=${id}`, {
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

    const handleEdit = (id) => {
        setEditData(decorations.Data.find(el => id === el.sku_id));
        setIsEdit(prev => prev = !prev)
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/cakedecorations/update`, {
            method: 'POST',
            body: JSON.stringify({ ...editData }),
        })
            .then(() => {
                setIsEdit(false);
                getData();
                setEditData({});
            }).catch((e) => setError(e.response.data.message))
    }

    return (
        <>
            {error && <p className={styles.require}>{error}</p>}
            {isEdit && <form style={{ marginBottom: '40px' }}>
                <label htmlFor="sku_name">sku_name: </label>
                <input type="text" id="sku_name" value={editData?.sku_name} onChange={(e) => {
                    setEditData(prev => ({ ...prev, sku_name: e.target.value }))
                }} />
                <label htmlFor="unit">unit: </label>
                <input id="unit" onChange={(e) => {
                    setEditData(prev => ({ ...prev, unit: e.target.value }))
                }} value={editData?.unit} type="text" />
                <label htmlFor="qty">qty: </label>
                <input id="qty" onChange={(e) => {
                    setEditData(prev => ({ ...prev, qty: +e.target.value }))
                }} value={editData?.qty || 0} type="number" />
                <label htmlFor="cake_decor_type">cake_decor_type: </label>
                <input type="text" id="cake_decor_type" value={editData?.cake_decor_type} onChange={(e) => {
                    setEditData(prev => ({ ...prev, cake_decor_type: e.target.value }))
                }} />
                <button onClick={handleUpdate} type="submit">Отправить</button>
            </form>}
            <h1>purchase_sum: {decorations.purchase_sum}</h1>
            <h1>count: {decorations.count}</h1>
            <label for="exp_dt">Срок годности: </label>
            <input id="exp_dt" type="number" min="1" onChange={(e) => handleExpDt(e.target.value)} />
            <table border={1}>
                <tr>
                    <td>edt</td>
                    <td>exp_dt</td>
                    <td>purchase_price</td>
                    <td>qty</td>
                    <td>sku_id</td>
                    <td>sku_name</td>
                    <td>supplier_id</td>
                    <td>supplier_name</td>
                    <td>unit</td>
                    <td></td>
                </tr>
                {decorations && decorations?.Data?.map(el => {
                    return (
                        <tr key={el.sku_id}>
                            <td>{el.edt}</td>
                            <td>{el.exp_dt}</td>
                            <td>{el.purchase_price}</td>
                            <td>{el.qty}</td>
                            <td>{el.sku_id}</td>
                            <td>{el.sku_name}</td>
                            <td>{el.supplier_id}</td>
                            <td>{el.supplier_name}</td>
                            <td>{el.unit}</td>
                            <td><button onClick={() => handleEdit(el.sku_id)}>Редактировать</button></td>
                            <td><button onClick={() => {
                                if (window.confirm('Вы уверены, что хотите удалить?')) handleRemove(el.sku_id);
                            }}>Удалить</button></td>
                        </tr>
                    )
                })}
            </table>
        </>
    )
}

export default DecorationsPage;