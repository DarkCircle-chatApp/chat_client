import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 눈 모양 아이콘 추가
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

const LoginContainer = styled.div`
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
    border: none;
`;

const InputLabel = styled.label`
    font-family: 'Telegraf', sans-serif;
    font-size: 16px;
    color: #9D9D9D;
    width: 100%;
    margin-bottom: 5px;
`;

const PasswordWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
`;

const EyeIcon = styled.div`
    position: absolute;
    right: 10px;
    cursor: pointer;
    color: #9D9D9D;
    font-size: 20px;
`;

const Line = styled.div`
    width: 575px;
    height: 1px;
    background: #9D9D9D;
    margin-bottom: 20px;
`;

const LoginButton = styled(Button)`
    width: 575px;
    height: 60px;
    background: #5B86E5;
    border-radius: 8px;
    font-weight: 800;
    font-size: 16px;
    color: #FFFFFF;
    margin-top: 10px;
`;

const SignupText = styled.p`
    font-family: 'Telegraf', sans-serif;
    font-size: 16px;
    color: #000000;
    margin-top: 10px;
    cursor: pointer;
`;

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [seePassword, setSeePassword] = useState(false); // 기본값 : 비밀번호 숨김
    // const [loginCheck, setLoginCheck] = useState(false);   // 로그인 상태

    const seePasswordHandler = () => {
        setSeePassword(!seePassword);
    };

    const loginHandler = () => {
        console.log("로그인 시도:", email, password);
        navigate("/chat/1");    // 나중에 userid부분 수정
    };

    const keyDownHandler = (e) => {
        console.log("Key pressed:", e.key);
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            loginHandler();
        }
    };

    return (
        <PageWrapper>
            <LoginContainer>
                <Title>Sign-in</Title>
                <InputContainer>
                    <InputLabel>Email</InputLabel>
                    <TextInput 
                        height={20}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="이메일 입력"
                    />
                    <Line />
                    <InputLabel>Password</InputLabel>
                    <PasswordWrapper>
                        <TextInput
                            height={20}
                            value={password}
                            type={seePassword ? "text" : "password"} // 상태에 따라 input 타입 변경
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyDown={keyDownHandler}
                            placeholder="비밀번호 입력"
                        />
                        <EyeIcon onClick={seePasswordHandler}>
                            {seePassword ? <FaEye /> : <FaEyeSlash  />}
                        </EyeIcon>
                    </PasswordWrapper>
                    <Line />
                </InputContainer>
                <LoginButton title="로그인" onClick={loginHandler} />
                <SignupText onClick={() => navigate("/signup")}>
                    Don’t have an account? Signup Here
                </SignupText>
            </LoginContainer>
        </PageWrapper>
    );
}

export default LoginPage;
