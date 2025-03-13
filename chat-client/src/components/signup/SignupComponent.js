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

function SignupPage(props) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = () => {
        // 회원가입 처리 로직
        console.log("회원가입 시도:", email, password);
        // 회원가입 후 로그인 페이지로 이동
        navigate("/login");
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
                    title="회원가입"
                    onClick={handleSignup}
                />
            </Container>
        </Wrapper>
    );
}

export default SignupPage;
