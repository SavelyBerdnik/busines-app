import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../img/logo_colors.png';
import UserCard from "./UserCard";
import styles from './header.module.css';

const Header = () => {
    const [token, setToken] = useState(Cookies.get('token'))
    const [role, setRole] = useState('')
    const [userImg, setUserImg] = useState('')
    const [userName, setUserName] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setToken(Cookies.get('token'))
        if (token){
            setRole(Cookies.get('role'))
            setUserImg(Cookies.get('user_img'))
            setUserName(Cookies.get('user_name'))
        }
        
    }, [token, role, userImg, userName, navigate])

    const onLogout = () => {
        Cookies.remove('token')
        Cookies.remove('role')
        Cookies.remove('user_img')
        Cookies.remove('user_name')
        setToken('')
        setRole('')
        navigate('/login', { replace: true })
    }

    return (
        <header className={styles.header}>
            <img src={logo} className="image-logo" alt="logo" srcSet={logo + ' 5000w'} />
            {token &&
                <nav className={styles.navigation}>
                    <NavLink to='/'>Главная</NavLink>
                    {/* <NavLink to={role === '1' ? '/flights': '/booking'}>{role === '1' ? 'Flights' : 'Booking'}</NavLink>
                <NavLink to={role === '2' ? '/amenities': '/amenities-report'}>{role === '2' ? 'Amenities': 'Amenities Report'}</NavLink>
                {role === '1' && <>
                    <NavLink to='/survey'>Survey</NavLink>
                    <NavLink to='/summary'>Summary</NavLink> 
                </>} */}
                    {role !== 'client' && 
                    <>
                        <NavLink to='/ingridients'>Ингредиенты</NavLink>
                        <NavLink to='/decorations'>Декорации</NavLink>
                    </>}
                    {role === 'client_manager' &&
                        <NavLink to='/orders-history'>История заказов</NavLink>
                    }
                    {role === 'purchase_manager' && 
                        <NavLink to='/reports'>Отчёты</NavLink>
                    }
                    {role === 'master' &&
                        <NavLink to='/specify'>Спецификация</NavLink>}
                    {role === 'director' && 
                    <>
                        <NavLink to='/orders-history'>История заказов</NavLink>
                        <NavLink to='/equipment'>Учет</NavLink>
                        <NavLink to='/schemas'>Схемы</NavLink>
                        <NavLink to='/reports'>Отчёты</NavLink>
                    </>}
                </nav>}
                {token && <UserCard userImg={userImg} userName={userName} role={role} />}
                {token && <button type="button" onClick={() => onLogout()} className={styles.logoutButton}>Logout</button>}
        </header>
    )
}

export default Header;