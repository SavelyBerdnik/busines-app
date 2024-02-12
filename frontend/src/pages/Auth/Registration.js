import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/api";
import Cookies from "js-cookie";
import styles from './auth.module.css';

const Registration = () => {
    const {isCreateClient} = useParams()
    const navigate = useNavigate()
    const [fio, setFio] = useState('')
    const [userImg, setUserImg] = useState('')
    const formData = new FormData()
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const registrationUser = () => {
        formData.append('file', userImg)
        api.post("/user/registration", { login, password, full_name: fio, formData })
            .then((response) => {
                if (isCreateClient){
                    navigate(-1)
                } else {
                    Cookies.set('token', response.data.token)
                    Cookies.set('role', response.data.role)
                    Cookies.set('user_name', response.data.full_name)
                    Cookies.set('user_img', response.data.image_path)
                    console.log(response.data)
                    navigate('/', {replace: true})
                }
            }).catch((e) => setError(e.response.data.message.split('\n').join(', ')))
    }

    return (
        <div className={styles.login}>
            <h2>Регистрация</h2>
            <form className={styles.loginForm}>
                <input type="text" placeholder="Введите свое ФИО" onChange={(e) => setFio(e.target.value)} required/>
                <input type="file" name="file" id="selectFile" onChange={(e) => setUserImg(e.target.files[0])} required/>
                <input type="text" placeholder="Введите логин" onChange={(e) => setLogin(e.target.value)} required/>
                <input type="password" placeholder="Введите пароль" onChange={(e) => setPassword(e.target.value)} required/>
                <p>Пароль должен отвечать следующим требованиям:</p>
                <ul>
                    <li>Должен содержать от 5 до 20 символов</li>
                    <li>Не должен содержать логин</li>
                    <li>Должны встречаться заглавные буквы</li>
                    <li>Должны встречаться маленькие буквы</li>
                </ul>
                {!!error && <p className={styles.require}>{error}</p>}
                <button type="button" onClick={() => registrationUser()}>Зарегистрироваться</button>
                <button type="button" onClick={() => navigate(-1)} >Назад</button>
            </form>
        </div>
    )
}

export default Registration;