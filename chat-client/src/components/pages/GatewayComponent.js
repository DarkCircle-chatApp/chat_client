import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../state/UserState';  // 로그인 정보 가져오기

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

const NavigationContainer = styled.div`
    width: 700px;
    height: 50vh;
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

const Button = styled.button`
    background-color:rgb(136, 152, 240);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 15px 30px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px 0;
    width: 100%;

    &:hover {
        background-color:rgb(66, 141, 238);
    }
`;

const LogoutButton = styled.button`
    background-color:rgb(236, 94, 92);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 15px 30px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px 0;
    width: 100%;
    margin-top: 220px;

    &:hover {
        background-color:rgb(236, 55, 52);
    }
`;

function Navigation() {
    const navigate = useNavigate();
    const { token, login_id } = useRecoilValue(userState); // 로그인된 userState에서 login_id 가져오기
    const setLoginId = useSetRecoilState(userState);
    const setUser = useSetRecoilState(userState);
    const [user_name, setUser_name] = useState("");

    const storedUserName = localStorage.getItem("user_name");
    const storedUserId = localStorage.getItem("user_id");

    const MYIP = "210.119.12.54";

    console.log("++++++Current login_id:", login_id);

    useEffect(() => {
        // 페이지 로드 시 로컬 스토리지에서 login_id 가져오기
        const storedLoginId = localStorage.getItem('login_id');
        if (storedLoginId && !login_id) {
            // 로그인 정보가 로컬 스토리지에 있을 경우 Recoil 상태에 설정
            setLoginId({ login_id: storedLoginId });
        }
    }, [login_id, setLoginId]);

    const handleNavigate = (path) => {
        if (!login_id) {
            alert('로그인 아이디 못가져옴');
            return; // 로그인 ID가 없으면 navigate 하지 않음
        }
        navigate(path);
    };

    const enterChatRoom = async () => {
        try {
            const response = await fetch(`http://${MYIP}:8881/chat/enter`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: Number(storedUserId), user_name: storedUserName, }),
            });
            console.log("보내는 유저 정보:", storedUserId, storedUserName); 
            // const responseBody = await response.text(); // 로그 찍어보는 용. 나중에 지울 것
            if (response.status === 200) {
                // setUser_status(3);
                console.log("Enter chat room successfully.");
                handleNavigate(`/chat/${login_id}`)
            } else {
                console.error("Failed to enter chat room:", response.status);
            }
        } catch (error) {
            console.error("entering error: ", error);
        }
    };

    const logoutHandler = () => {
        console.log("Logging out...");
        localStorage.removeItem("token");    // 토큰 삭제
        localStorage.removeItem("user_id");  // 유저 ID 삭제
        setUser("");                        // Recoil 상태 초기화
        navigate("/");                   // 로그인 페이지로 이동
    };

    return (
        <PageWrapper>
            <NavigationContainer>
                <Title>페이지 목록</Title>
                {/* 로그인 ID를 동적으로 포함시켜서 '/chat/:login_id'로 네비게이션 */}
                <Button onClick={enterChatRoom}>채팅방 접속</Button>
                <Button onClick={() => handleNavigate('/mypage')}>마이페이지</Button>
                <Button
                    onClick={() => {
                        if (storedUserName === "안성주" || storedUserName === "성명건") {
                            handleNavigate('/admin');
                        } else {
                            alert("접근 권한이 없습니다.");
                        }
                    }}
                >
                    강사 전용 페이지
                </Button>
                {/* <Button onClick={() => handleNavigate('/admin')}>관리자 페이지</Button> */}
                <LogoutButton onClick={logoutHandler}>로그아웃</LogoutButton>
            </NavigationContainer>
        </PageWrapper>
    );
}

export default Navigation;
