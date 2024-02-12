import React, { useEffect, useState } from "react";
import styles from './reports.module.css';
import { api } from "../../utils/api";

const EquipmentCrashReport = ({token, onBack}) => {
    const [report, setReport] = useState([])
    const [equipments, setEquipments] = useState([])
    const [diagfailure, setDiagFailure] = useState([])
    const [showDiagram, setShowDiagram] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get('/equipment/get-failure', {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                console.log(res.data)
                setReport(res.data)
            }).catch(e => setError(e.response.data.message))
        api.get('/equipment/get', {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                console.log(res.data)
                setEquipments(res.data)
            }).catch(e => setError(e.response.data.message))
        api.get('/equipment/get-failure-diag', {headers: {Authorization: `Berear ${token}`}})
            .then(res => {
                console.log(res.data)
                setDiagFailure(res.data)
            }).catch(e => setError(e.response.data.message))
    }, [token])

    const getColor = () => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        while (color === '#fffff') {
            color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        return color;
    }

    return (
        <div className={styles.CurrentReport}>
            <h2>Отчёт по закупкам оборудования (за последние 10 дней)</h2>
            {!showDiagram ? 
            <>
                <button type="button" onClick={() => setShowDiagram(!showDiagram)}>Графическая сводка</button>
                {report?.length ?
                    <table>
                        <thead>
                            <tr>
                                <td>Причина</td>
                                <td>Оборудование</td>
                                <td>Дата</td>
                                <td>Длительность устранения</td>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map(el => {
                                console.log(el)
                                if (el) {
                                    let equipment = equipments.filter(element => element.eqp_id === el.eqp_id)[0]
                                    console.log(equipments.filter(element => element.eqp_id === el.eqp_id)) 
                                    return <tr>
                                        <td>{el.reason}</td>
                                        <td>{equipment?.eqp_title}</td>
                                        <td>{el.fail_date}</td>
                                        <td>{el.fail_time}</td>
                                    </tr>
                                }
                                return ''
                            })}
                        </tbody>
                    </table> 
                    : ''
                }
                {error && <p style={{color: 'red'}}>{ error }</p>}
            </> 
            : <>
                <button type="button" onClick={() => setShowDiagram(!showDiagram)}>Табличная сводка</button>
                {diagfailure.map(el => 
                <>
                    <p>{el.reason} ({el.sum_fail_time})</p>
                    <div style={{ backgroundColor: getColor(), width: el.sum_fail_time, height: "20px"}}></div>
                </>)}
                {error && <p style={{color: 'red'}}>{ error }</p>}
            </>
            }
            <button type="button" onClick={() => onBack('')}>Назад</button>
        </div>
    )
}

export default EquipmentCrashReport;