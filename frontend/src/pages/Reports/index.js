import React, { useEffect, useState } from "react";
import EquipmentBuyReport from "./EquipmentBuyReport";
import Cookies from "js-cookie";
import styles from './reports.module.css';
import { useNavigate } from "react-router-dom";
import EquipmentCrashReport from "./EquipmentCrashReport";
import IngredientsDecorationsReport from "./IngredientsDecorationsReport";

const Reports = () => {
    const [token, setToken] = useState(Cookies.get('token'))
    const [role, setRole] = useState(Cookies.get('role'))
    const [selectReport, setSelectReport] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setToken(Cookies.get('token'))
        if (!token) {
            navigate('/login', { replace: true })
        } else {
            setRole(Cookies.get('role'))
            setSelectReport(role === 'director' ? '': 'ingridients and decorations')
        }
    }, [navigate, token])

    return (
        <>
            {!selectReport ?
                <div className={styles.Reports}>
                    <h2>Отчёты</h2>
                    <button type="button" onClick={() => setSelectReport('equipment-buy')}>Отчёт по закупкам оборудования</button>
                    <button type="button" onClick={() => setSelectReport('equipment-crash')}>Отчёт по сбоям оборудования</button>
                    <button type="button" onClick={() => setSelectReport('ingridients and decorations')}>Отчёт по ингредиентам и украшениям для торта</button>
                </div>
                : selectReport === 'equipment-buy' ? 
                    <EquipmentBuyReport token={token} onBack={setSelectReport} /> 
                    : selectReport === 'equipment-crash' ? 
                        <EquipmentCrashReport token={token} onBack={setSelectReport} /> 
                        : <IngredientsDecorationsReport token={token} onBack={setSelectReport} role={role} />}
        </>
    )
}

export default Reports;