import React, { useEffect } from 'react';
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
    width: 600px;
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
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 15px 30px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px 0;
    width: 100%;

    &:hover {
        background-color: #45a049;
    }
`;

function Navigation() {
    const navigate = useNavigate();
    const { login_id } = useRecoilValue(userState); // 로그인된 userState에서 login_id 가져오기
    const setLoginId = useSetRecoilState(userState);

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

    return (
        <PageWrapper>
            <NavigationContainer>
                <Title>Navigate</Title>
                {/* 로그인 ID를 동적으로 포함시켜서 '/chat/:login_id'로 네비게이션 */}
                <Button onClick={() => handleNavigate(`/chat/${login_id}`)}>Go to Chat</Button>
                <Button onClick={() => handleNavigate('/mypage')}>Go to My Page</Button>
                <Button onClick={() => handleNavigate('/admin')}>Go to Admin</Button>
            </NavigationContainer>
        </PageWrapper>
    );
}

export default Navigation;
