import Cookies from "js-cookie";
import React, { useEffect, useRef, useState, useId } from "react";
import styles from './index.module.css';

const SchemasPage = () => {
    const [token, setToken] = useState(Cookies.get('token'))
    const [curSchema, setCurSchema] = useState("1");
    const [pos, setPos] = useState(0);
    const [things, setThings] = useState({});
    const [ids, setIds] = useState({ eqp: 0, exit: 0, fire: 0, aid: 0 })

    const handleSelect = (e) => {
        setCurSchema(e.target.value);
        setThings({});
        setIds({ eqp: 0, exit: 0, fire: 0, aid: 0 });
        schema.current.innerHTML = '';
    }

    const handleLeft = () => {
        setPos(prev => prev - 90);
    }

    const handleRight = () => {
        setPos(prev => prev + 90);
    }

    const schema = useRef();
    const eqp = useRef();
    const exit = useRef();
    const fire = useRef();
    const aid = useRef();
    let draggedItem = null;
    const handleDragStart = (e, r) => {
        draggedItem = r.current
    }

    const handleDrop = (e) => {
        e.preventDefault();

        if (!draggedItem) return;

        // Проверяем, есть ли элемент внутри schema.current
        const existingItem = schema.current.querySelector(`.${draggedItem.className}`);

        if (!existingItem) {
            // Создаем копию элемента и устанавливаем его позицию в соответствии с положением мыши
            let clonedItem = draggedItem.cloneNode(true);
            clonedItem.classList.remove('menu-item'); // удаляем класс меню
            clonedItem.classList.add('icon'); // добавляем класс значка

            // Ограничиваем перемещение в пределах контейнера
            let maxX = schema.current.offsetWidth - clonedItem.offsetWidth;
            let maxY = schema.current.offsetHeight - clonedItem.offsetHeight;

            let x = Math.min(Math.max(e.clientX - schema.current.getBoundingClientRect().left - clonedItem.offsetWidth / 2, 0), maxX);
            let y = Math.min(Math.max(e.clientY - schema.current.getBoundingClientRect().top - clonedItem.offsetHeight / 2, 0), maxY);

            // Учтем угол наклона
            let angleRad = pos * (Math.PI / 180);
            let rotatedX = Math.cos(angleRad) * x - Math.sin(angleRad) * y;
            let rotatedY = Math.sin(angleRad) * x + Math.cos(angleRad) * y;

            clonedItem.style.left = rotatedX + 'px';
            clonedItem.style.top = rotatedY + 'px';

            schema.current.appendChild(clonedItem);
            const name = [...draggedItem.classList].at(-1).split('_')[1];
            const id = name + '_' + ids[name];
            setThings(prev => ({ ...prev, [id]: { x: rotatedX, y: rotatedY } }));
            setIds(prev => ({ ...prev, [name]: prev[name] + 1 }));
            clonedItem.classList.add(id);
            addThing({ x: rotatedX, y: rotatedY, map_name: +curSchema, image_name: id });
            draggedItem = null;
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    let activeItem = null;

    schema?.current?.addEventListener('mousedown', function (e) {
        activeItem = e.target;
        console.log(activeItem)
    });

    schema?.current?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        removeThing([...e.target.classList].at(-1));
        if (e.target.closest('.icon')) {
            e.target.remove();
        }
    })

    document.addEventListener('mousemove', function (e) {
        if (activeItem) {
            let x = Math.min(Math.max(e.clientX - schema.current.getBoundingClientRect().left - activeItem.offsetWidth / 2, 0), schema.current.offsetWidth - activeItem.offsetWidth);
            let y = Math.min(Math.max(e.clientY - schema.current.getBoundingClientRect().top - activeItem.offsetHeight / 2, 0), schema.current.offsetHeight - activeItem.offsetHeight);

            // Учтем угол наклона и инвертируем направление курсора
            let angleRad = -pos * (Math.PI / 180);
            let invertedX = Math.cos(angleRad) * x - Math.sin(angleRad) * y;
            let invertedY = Math.sin(angleRad) * x + Math.cos(angleRad) * y;

            activeItem.style.left = invertedX + 'px';
            activeItem.style.top = invertedY + 'px';
            const id = [...activeItem.classList].at(-1);
            setThings(prev => ({ ...prev, [id]: { x: invertedX, y: invertedY } }))
            editThing({ x: invertedX, y: invertedY, map_name: +curSchema, image_name: id });
        }
    });

    document.addEventListener('mouseup', function () {
        activeItem = null;
    });

    const refs = {
        eqp,
        fire,
        aid,
        exit
    }

    const getThings = () => {
        fetch(`http://localhost:8080/map/get?map_name=${curSchema}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(res => {
                setThings(res);
                Object.values(res).map(e => {
                    const draggedItem = refs[e.image_name.split('_')[0]].current;
                    let clonedItem = draggedItem.cloneNode(true);
                    clonedItem.classList.remove('menu-item'); // удаляем класс меню
                    clonedItem.classList.add('icon'); // добавляем класс значка

                    // Ограничиваем перемещение в пределах контейнера
                    let x = e.x;
                    let y = e.y;
                    let angleRad = pos * (Math.PI / 180);
                    let rotatedX = Math.cos(angleRad) * x - Math.sin(angleRad) * y;
                    let rotatedY = Math.sin(angleRad) * x + Math.cos(angleRad) * y;

                    clonedItem.style.left = rotatedX + 'px';
                    clonedItem.style.top = rotatedY + 'px';

                    schema.current.appendChild(clonedItem);
                    clonedItem.classList.add(e.image_name);
                })
            })
    }

    const addThing = ({ x, y, map_name, image_name }) => {
        fetch('http://localhost:8080/map/create', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                x,
                y,
                map_name: map_name + '',
                image_name,
            })
        }).then(res => console.log(res))
    }

    const editThing = ({ x, y, map_name, image_name }) => {
        fetch('http://localhost:8080/map/edit', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                x,
                y,
                map_name: map_name + '',
                image_name,
            })
        }).then(res => console.log(res))
    }

    const removeThing = (id) => {
        fetch(`http://localhost:8080/map/remove?id=${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setCurSchema(prev => prev))
    }

    useEffect(() => {
        getThings();
    }, [curSchema])

    return (
        <>
            <h1>Схемы</h1>
            <select className={styles.select} defaultValue={curSchema} onChange={handleSelect}>
                <option value="1">Заготовительный цех</option>
                <option value="2">Пекарный цех</option>
                <option value="3">Упаковочный цех</option>
                <option value="4">Цех монтажа тортов</option>
                <option value="5">Цех оформления</option>
            </select>
            <div className={styles.schema}
                style={{
                    transform: `rotate(${pos}deg)`,
                    backgroundImage: `url(/${curSchema}.png)`
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                ref={schema}
            >
            </div>
            <div className={styles.addControl}>
                <div className={`${styles.icon} ${styles.eqp}`} draggable="true" style={{ backgroundImage: `url(/Equipment.png)` }} onDragStart={(e) => handleDragStart(e, eqp)} ref={eqp}></div>
                <div className={`${styles.icon} ${styles.exit}`} draggable="true" style={{ backgroundImage: `url(/Exit.jpg)` }} onDragStart={(e) => handleDragStart(e, exit)} ref={exit}></div>
                <div className={`${styles.icon} ${styles.fire}`} draggable="true" style={{ backgroundImage: `url(/FireExtinguisher.png)` }} onDragStart={(e) => handleDragStart(e, fire)} ref={fire}></div>
                <div className={`${styles.icon} ${styles.aid}`} draggable="true" style={{ backgroundImage: `url(/FirstAid.png)` }} onDragStart={(e) => handleDragStart(e, aid)} ref={aid}></div>
            </div>
            <button onClick={handleLeft} className={styles.toLeft}>↩️</button>
            <button onClick={handleRight} className={styles.toRight}>↪️</button>
        </>)
}

export default SchemasPage;