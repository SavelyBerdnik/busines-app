import React, { useEffect, useState } from "react";
import styles from './reports.module.css';
import { api } from "../../utils/api";

const EquipmentBuyReport = ({token, onBack}) => {
    const [report, setReport] = useState([])

    useEffect(() => {
        api.get('/suppliers/eqp-report', {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                console.log(res.data)
                setReport(res.data)
            })
    }, [token])

    return (
        <div className={styles.CurrentReport}>
            <h2>Отчёт по закупкам оборудования</h2>
            <p>
                {report ? 
                    Object.values(report).map(el => {
                        console.log(el)
                        if (el) {
                            return <span><b>{el[0]?.eqp_title}</b> ({el.map(element => `${element.supplier_name}: ${element.qty}; `)}), </span>
                        }
                        return ''
                    })
                    : ''
                }
            </p>
            <button type="button" onClick={() => onBack('')}>Назад</button>
        </div>
    )
}

export default EquipmentBuyReport;