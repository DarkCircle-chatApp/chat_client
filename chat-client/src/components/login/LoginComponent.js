import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/ButtonComponent";
import TextInput from "../ui/TextInputComponent";

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;
    
    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

function LoginPage(props) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // 로그인 처리 로직
        console.log("로그인 시도:", email, password);
        // 로그인 성공 시 채팅 페이지로 이동
        navigate("/chat");
    };

    return (
        <Wrapper>
            <Container>
                <TextInput
                    height={20}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="이메일 입력"
                />
                <TextInput
                    height={20}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="비밀번호 입력"
                    type="password"
                />
                <Button
                    title="로그인"
                    onClick={handleLogin}
                />
                <Button
                    title="회원가입"
                    onClick={() => navigate("/signup")}
                />
            </Container>
        </Wrapper>
    );
}

export default LoginPage;
