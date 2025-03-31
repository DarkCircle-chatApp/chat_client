import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaBan } from "react-icons/fa"; // 차단 아이콘

// 스타일링
const PageWrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #5B86E5;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AdminContainer = styled.div`
    width: 600px;
    height: 80vh;
    background: #FFFFFF;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const Title = styled.h2`
    font-family: 'Telegraf', sans-serif;
    font-weight: 800;
    font-size: 30px;
    color: #000000;
    margin-bottom: 20px;
`;

const UserList = styled.ul`
    list-style: none;
    width: 100%;
    padding: 0;
`;

const UserItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ddd;
`;

const BanButton = styled.button`
    background-color: #FF4C4C;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
        background-color: #D43F3F;
    }
`;

function AdminComponent() {
    const [users, setUsers] = useState([]);
    
    // 유저 목록 가져오기
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8080/admin/users");
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users); // 유저 데이터 설정
                } else {
                    console.error("Failed to fetch users:", response.status);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        
        fetchUsers();
    }, []);
    
    // 유저 차단 처리
    const handleBanUser = async (user_id) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/ban/${user_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("User has been banned!");
                // 차단된 유저는 목록에서 제거
                setUsers(users.filter(user => user.id !== user_id));
            } else {
                alert("Failed to ban user!");
            }
        } catch (error) {
            console.error("Error banning user:", error);
        }
    };

    return (
        <PageWrapper>
            <AdminContainer>
                <Title>Admin Dashboard</Title>
                <UserList>
                    {users.map(user => (
                        <UserItem key={user.id}>
                            <span>{user.name}</span>
                            <BanButton onClick={() => handleBanUser(user.id)}>
                                <FaBan /> Ban
                            </BanButton>
                        </UserItem>
                    ))}
                </UserList>
            </AdminContainer>
        </PageWrapper>
    );
}

export default AdminComponent;
