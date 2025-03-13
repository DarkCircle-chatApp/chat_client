import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/ButtonComponent";

// Wrapper
const Wrapper = styled.div`
    padding: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f4f8;
`;

// Container
const Container = styled.div`
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

// Heading
const Heading = styled.h1`
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 32px;
    color: #333;
`;

// ButtonGroup: 버튼들 사이에 여백을 주기 위한 컨테이너
const ButtonGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px; /* 각 버튼 사이의 간격 */
`;

// MainPage 컴포넌트 정의
function MainPage(props) {
    const navigate = useNavigate(); // useNavigate 훅 사용

    return (
        <Wrapper>
            <Container>
                <Heading>2025 부경대 IoT 개발자 과정 채팅방</Heading>

                {/* 버튼들을 감싸는 컨테이너 */}
                <ButtonGroup>
                    {/* 로그인 페이지로 이동 버튼 */}
                    <Button
                        title="로그인"
                        onClick={() => {
                            navigate("/login"); // /login 경로로 이동
                        }}
                    />

                    {/* 회원가입 페이지로 이동 버튼 */}
                    <Button
                        title="회원가입"
                        onClick={() => {
                            navigate("/signup"); // /signup 경로로 이동
                        }}
                    />

                    {/* 채팅 페이지로 이동 버튼 */}
                    <Button
                        title="채팅하기"
                        onClick={() => {
                            navigate("/chat"); // /chat 경로로 이동
                        }}
                    />
                </ButtonGroup>
            </Container>
        </Wrapper>
    );
}

export default MainPage;
