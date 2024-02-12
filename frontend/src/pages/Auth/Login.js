import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../../utils/api';
import styles from './auth.module.css';

const Login = () => {
    const navigate = useNavigate()
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const counter = +Cookies.get('counter') || 0;
    const [isDisabled, setIsDisables] = useState(false);

    const loginUser = () => {
        api.post("/user/login", { login, password })
            .then((response) => {
                Cookies.remove('counter')
                Cookies.set('token', response.data.token)
                Cookies.set('role', response.data.role)
                Cookies.set('user_name', response.data.full_name)
                Cookies.set('user_img', response.data.image_path)
                console.log(response.data)
                navigate('/', { replace: true })
            }).catch((e) => {
                if (counter + 1 === 3) {
                    console.log('timeout')
                    setIsDisables(true)
                    setError('Вы отключены на 5 секунд')
                    setTimeout(() => {
                        Cookies.remove('counter')
                        setIsDisables(false)
                        setError(e.response.data.message)
                    }, 5000)
                } else {
                    Cookies.set('counter', counter + 1)
                    setError(e.response.data.message)
                }
            })
    }

    return (
        <div className={styles.login} >
            <h2>Вход</h2>
            <form className={styles.loginForm} >
                <input type="text" name="login" placeholder="Введите логин" onChange={(e) => setLogin(e.target.value)} disabled={isDisabled} required />
                <input type="password" name="password" placeholder="Введите пароль" onChange={(e) => setPassword(e.target.value)} disabled={isDisabled} required />
                {!!error && <p className={styles.require}>{error}</p>}
                <a href='/registration'>Зарегистрироваться</a>
                <button type="button" onClick={() => loginUser()} disabled={isDisabled}>Вход</button>
                <button type="button" onClick={() => window.location.href = 'https://google.com'}>Выход</button>
            </form>
        </div>
    )
}

export default Login;