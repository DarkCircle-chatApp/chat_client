import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaBan } from "react-icons/fa"; // 차단 아이콘
import { FaUndo } from "react-icons/fa"; // 되돌리기 아이콘
import { useRecoilValue } from "recoil";
import { userState } from "../state/UserState";
import Loading from "../load/Loading";


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
    width: 800px;
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
    height: 100%;
    overflow-y: auto;
`;

const UserItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    // padding: 0 5px;

    span {
        text-align: left;
        flex: 1;
        // min-width: 10px;
    }
`;

const BanButton = styled.button`
    background-color: #FF4C4C;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-right: 10px;
    
    &:hover {
        background-color: #D43F3F;
    }
`;

const UserHeader = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-weight: bold;
    background-color: #f4f4f4;
    border-bottom: 2px solid #ddd;

    span {
        text-align: left;
        flex: 1;
        // min-width: 10px;
        padding: 0 5px;
    }
`;

function AdminComponent() {
    const [users, setUsers] = useState([]);
    const {token, login_id:recoilLoginId} = useRecoilValue(userState);
    const [loading, setLoading] = useState(false); // 로딩 상태
    // const [user_id, setUser_id] = useState([]);
    // const [user_name, setUser_name] = useState([]);
    // const [login_id, setLogin_id] = useState([]);
    // const [user_status, setUser_status] = useState([]);
    
    // 유저 목록 조회
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/chat/admin/admin_select`);
            if (response.ok) {
                setLoading(false);
                const data = await response.json();
                const usersData = data.map(user => ({
                    user_id: user.user_id,
                    user_name: user.user_name,
                    login_id: user.login_id,
                    user_status: user.user_status,
                }));
                setUsers(usersData);
            } else {
                console.error("Failed to fetch users:", response.status);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
        
    // 유저 차단
    const handleBanUser = async (user_id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/chat/admin/user_delete`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user_id, }),
            });

            if (response.ok) {
                setLoading(false);
                fetchUsers();
                alert("User has been banned.");
            } else {
                alert("Failed to ban user");
            }
        } catch (error) {
            console.error("Error banning user:", error);
        }
    };

    const handleUnbanUser = async (user_id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/chat/admin/unban`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user_id, }),
            });

            if (response.ok) {
                setLoading(false);
                fetchUsers();
                alert("차단이 해제되었습니다.");
            } else {
                alert("Failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAdminStat = async (user_id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/chat/admin/status_update`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user_id, }),
            });

            if (response.ok) {
                setLoading(false);
                fetchUsers();
                alert("관리자 설정 완료");
            } else {
                alert("Failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: return "관리자";
            case 1: return "일반 사용자";
            case 2: return "차단된 사용자";
            case 3: return "채팅 차단됨";
            default: return "알 수 없음";
        }
    };

    return (
        <PageWrapper>
            {loading ? <Loading /> : null}
            <AdminContainer>
                <Title>Admin Dashboard</Title>
                <UserList>
                    <UserHeader>
                        <span>Name</span>
                        <span>ID / Status</span>
                        {/* <span>Status</span> */}
                        <span>Controller</span>
                    </UserHeader>
                    {users.map(user => (
                        <UserItem key={user.user_id}>
                            <span>{user.user_name}</span>
                            <span>{user.login_id}</span>
                            <span>{getStatusText(user.user_status)}</span>
                            <BanButton onClick={() => handleBanUser(user.user_id)}>
                                <FaBan /> Chat Ban
                            </BanButton>
                            <BanButton onClick={() => handleBanUser(user.user_id)}>
                                <FaBan /> Ban
                            </BanButton>
                            <BanButton onClick={() => handleUnbanUser(user.user_id)}>
                                <FaUndo /> Unban
                            </BanButton>
                            <BanButton title="관리자 설정" onClick={() => {handleAdminStat(user.user_id)}} >
                                관리자 설정
                            </BanButton>
                        </UserItem>
                    ))}
                </UserList>
            </AdminContainer>
        </PageWrapper>
    );
}

export default AdminComponent;
