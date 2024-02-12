import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Gantt = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const [data, setData] = useState({});
    const [length, setLength] = useState(100);
    const token = Cookies.get('token')

    const min = [];
    for (let i = 5; i <= length; i += 5) {
        min.push(i)
    }

    const getColor = () => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        while (color === '#fffff') {
            color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        return color;
    }

    useEffect(() => {
        fetch('http://localhost:8080/gandon/get?good_id=' + id, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(r => {
                setData(r)
                setLength(r[Object.keys(r)[0]].reduce((a, t) => a + t.size, 0))
            })
    }, [])

    return (
        <div>
            <table border="1">
                <tr>
                    <td>Оборудование / Минуты</td>
                    {min.map(el => <td key={el} style={{ width: '100px' }}>{el}</td>)}
                </tr>
                {Object.keys(data).map(key => {
                    return (<tr key={key} style={{ height: '100px' }}>
                        <td>{key}</td>
                        {data[key].map(el => {
                            return (
                                <td colSpan={el.size / 5} style={{ backgroundColor: el.text ? getColor() : 'white' }}>{el.text || ''}</td>
                            )
                        })}
                    </tr>)
                })}
            </table>
        </div >
    )
}

export default Gantt;