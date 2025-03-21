import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/ButtonComponent";
import TextInput from "../ui/TextInputComponent";

const PageWrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #5B86E5;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SignupContainer = styled.div`
    position: relative;
    width: 1325px;
    height: 1080px;
    background: #FFFFFF;
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h2`
    font-family: 'Telegraf', sans-serif;
    font-weight: 800;
    font-size: 30px;
    color: #000000;
    margin-bottom: 20px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 575px;
`;

const InputLabel = styled.label`
    font-family: 'Telegraf', sans-serif;
    font-size: 16px;
    color: #9D9D9D;
    width: 100%;
    margin-bottom: 5px;
`;

const Line = styled.div`
    width: 575px;
    height: 1px;
    background: #9D9D9D;
    margin-bottom: 20px;
`;

const SignupButton = styled(Button)`
    width: 575px;
    height: 60px;
    background: #5B86E5;
    border-radius: 8px;
    font-weight: 800;
    font-size: 16px;
    color: #FFFFFF;
    margin-top: 10px;
`;

const LoginText = styled.p`
    font-family: 'Telegraf', sans-serif;
    font-size: 16px;
    color: #000000;
    margin-top: 10px;
    cursor: pointer;
`;

function SignupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signupHandler = () => {
        console.log("회원가입 시도:", name, email, password);
        navigate("/");
    };

    return (
        <PageWrapper>
            <SignupContainer>
                <Title>Create Account</Title>
                <InputContainer>
                    <InputLabel>Full Name</InputLabel>
                    <TextInput 
                        height={20}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="이름 입력"
                    />
                    <Line />
                    <InputLabel>Email</InputLabel>
                    <TextInput 
                        height={20}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="이메일 입력"
                    />
                    <Line />
                    <InputLabel>Password</InputLabel>
                    <TextInput
                        height={20}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="비밀번호 입력"
                        type="password"
                    />
                    <Line />
                </InputContainer>
                <SignupButton title="회원가입" onClick={signupHandler} />
                <LoginText onClick={() => navigate("/")}>
                    Already have an account? Login
                </LoginText>
            </SignupContainer>
        </PageWrapper>
    );
}

export default SignupPage;
