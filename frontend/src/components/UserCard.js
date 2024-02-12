import React from "react";

const UserCard = ({userImg, userName, role}) => {
    return (
        <div>
            <img src={'http://localhost:8080/static/' + userImg} alt="User img" width='47'/>
            <p>{userName} ({role})</p>
        </div>
    )
}

export default UserCard;