import React, { useEffect, useState } from "react";

const EquipmentPage = () => {
    const [data, setData] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [addData, setAddData] = useState({});
    const [types, setTypes] = useState([]);

    const handleRemove = (id) => {
        fetch(`http://localhost:8080/equipment/remove?eqp_id=${id}`, {
            method: 'POST'
        })
            .then(() => {
                alert('Вы удалили ' + id);
                getData();
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            })
    }
    const handleAddItem = () => {
        setAddData(prev => ({ ...prev, eqp_type_id: types?.[0].eqp_type_id }))
        setIsAdd(prev => prev = !prev)
    }
    const handleAddSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/equipment/create`, {
            method: 'POST',
            body: JSON.stringify({ ...addData, eqp_descr: 'Mock', eqp_wear: 1, eqp_supplier: 1 })
        }).then(() => {
            getData();
            setIsAdd(false);
            setAddData({});
        })
    }
    const handleEdit = (id) => {
        setEditData(data.find(el => id === el.eqp_id));
        setEditData(prev => ({ ...prev, eqp_type_id: types?.[0].eqp_type_id }))
        setIsEdit(prev => prev = !prev)
    }
    const handleEditSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/equipment/edit?eqp_id=${editData.eqp_id}`, {
            method: 'POST',
            body: JSON.stringify({ ...editData, eqp_descr: 'Mock', eqp_wear: 1, eqp_supplier: 1 }),
        })
            .then(() => {
                setIsEdit(false);
                getData();
                setEditData({});
            })
    }

    const getData = () => {
        fetch('http://localhost:8080/equipment/get')
            .then(res => res.json())
            .then(res => setData(res))
            .catch(e => console.error(e))
    }

    useEffect(() => {
        getData();

        fetch('http://localhost:8080/equipment/types')
            .then(res => res.json())
            .then(res => setTypes(res))
    }, [])
    return (
        <>
            <button onClick={handleAddItem}>Добавить</button>
            {isEdit && <form style={{ marginBottom: '40px' }}>
                <label htmlFor="start">Дней с покупки: </label>
                <input type="date" id="start" value={editData?.eqp_buy_date} onChange={(e) => {
                    setEditData(prev => ({ ...prev, eqp_buy_date: e.target.value }))
                }} />
                <label htmlFor="eqp_qty">Количество: </label>
                <input id="eqp_qty" onChange={(e) => {
                    setEditData(prev => ({ ...prev, eqp_qty: +e.target.value }))
                }} value={editData?.eqp_qty || 0} type="number" />
                <label htmlFor="eqp_title">Наименование: </label>
                <input id="eqp_title" onChange={(e) => {
                    setEditData(prev => ({ ...prev, eqp_title: e.target.value }))
                }} value={editData?.eqp_title} type="text" />
                <label htmlFor="eqp_type_id">Тип инструмента: </label>
                <select name="select" id="eqp_type_id" onChange={(e) => {
                    setEditData(prev => ({ ...prev, eqp_type_id: +e.target.value }))
                }} defaultValue={editData?.eqp_type_id || 0}>
                    {types?.map(el => {
                        return <option value={el.eqp_type_id}>{el.eqp_type_name}</option>
                    })}
                </select>
                <button onClick={handleEditSubmit} type="submit">Отправить</button>
            </form>}
            {isAdd && <form style={{ marginBottom: '40px' }}>
                <label htmlFor="start">Дней с покупки: </label>
                <input type="date" id="start" value={addData?.eqp_buy_date} onChange={(e) => {
                    setAddData(prev => ({ ...prev, eqp_buy_date: e.target.value }))
                }} />
                <label htmlFor="eqp_qty">Количество: </label>
                <input id="eqp_qty" onChange={(e) => {
                    setAddData(prev => ({ ...prev, eqp_qty: +e.target.value }))
                }} value={addData?.eqp_qty} type="number" />
                <label htmlFor="eqp_title">Наименование: </label>
                <input id="eqp_title" onChange={(e) => {
                    setAddData(prev => ({ ...prev, eqp_title: e.target.value }))
                }} value={addData?.eqp_title} type="text" />
                <label htmlFor="eqp_type_id">Тип инструмента: </label>
                <select name="select" id="eqp_type_id" onChange={(e) => {
                    setAddData(prev => ({ ...prev, eqp_type_id: +e.target.value }))
                }} defaultValue={addData?.eqp_type_id}>
                    {types?.map(el => {
                        return <option value={el.eqp_type_id}>{el.eqp_type_name}</option>
                    })}
                </select>
                <button onClick={handleAddSubmit} type="submit">Отправить</button>
            </form>}
            {data.length !== 0 && <table border={1} style={{ width: '100%' }}>
                <tr>
                    <td>Дней с покупки</td>
                    <td>Количество</td>
                    <td>Наименование</td>
                    <td>Тип инструмента</td>
                    <td></td>
                    <td></td>
                </tr>
                {data.map((el) => {
                    return (<tr key={el.eqp_id}>
                        <td>{el.eqp_buy_date}</td>
                        <td>{el.eqp_qty}</td>
                        <td>{el.eqp_title}</td>
                        <td>{types?.find(({ eqp_type_id }) => el.eqp_type_id === eqp_type_id)?.eqp_type_name || ''}</td>
                        <td><button onClick={() => handleEdit(el.eqp_id)}>Редактировать</button></td>
                        <td><button onClick={() => handleRemove(el.eqp_id)}>Удалить</button></td>
                    </tr>)
                })}
            </table >}
        </>
    )
}

export default EquipmentPage;