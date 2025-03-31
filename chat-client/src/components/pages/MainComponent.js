import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 눈 모양 아이콘 추가
import Button from "../ui/ButtonComponent";
import TextInput from "../ui/TextInputComponent";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../state/UserState"; // 로그인 상태

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
    const [user_id, setUser_id] = useState("");
    const [login_id, setLogin_id] = useState("");
    const [login_pw, setLogin_pw] = useState("");
    const [seePassword, setSeePassword] = useState(false); // 기본값 : 비밀번호 숨김
    // const [user, setUser] = useRecoilState(userState);   // 로그인 상태
    const setUser = useSetRecoilState(userState);

    const seePasswordHandler = () => {
        setSeePassword(!seePassword);
    };

    // CORS 때문에 6시간 날림 ㅋㅋㅋ
    const loginHandler = async (endpoint, port) => {
        console.log("로그인 시도:", login_id, login_pw);
        if (login_id.trim() && login_pw.trim()) {
            try {
                const response = await fetch(`http://localhost:${port}/${endpoint}`, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        login_id: login_id,
                        login_pw: login_pw,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("login response: ", data);
                    localStorage.setItem("token", data.token);
                    // recoil 상태에 사용자 정보 설정
                    setUser({
                        token: data.token,
                        // login_id: data.login_id,  // 서버에서 반환한 login_id 설정
                        user_status: data.user_status, // 서버에서 반환한 user_status로 설정
                    });
                    // setUser(data);  // 로그인 성공 -> recoil 상태 업데이트
                    navigate(`/chat/${login_id}`);
                } else {
                    console.error("Login failed. Status:", response.status);
                }
            } catch (error) {
                console.error("Error message: ", error);
            }

        }

        // navigate("/chat/1");    // 나중에 userid부분 수정
    };

    const keyDownHandler = (e) => {
        // console.log("Key pressed:", e.key);
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            loginHandler("login", 8080);
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
                        value={login_id}
                        onChange={(event) => setLogin_id(event.target.value)}
                        placeholder="이메일 입력"
                    />
                    <Line />
                    <InputLabel>Password</InputLabel>
                    <PasswordWrapper>
                        <TextInput
                            height={20}
                            value={login_pw}
                            type={seePassword ? "text" : "password"} // 상태에 따라 input 타입 변경
                            onChange={(event) => setLogin_pw(event.target.value)}
                            onKeyDown={keyDownHandler}
                            placeholder="비밀번호 입력"
                        />
                        <EyeIcon onClick={seePasswordHandler}>
                            {seePassword ? <FaEye /> : <FaEyeSlash  />}
                        </EyeIcon>
                    </PasswordWrapper>
                    <Line />
                </InputContainer>
                <LoginButton title="로그인" onClick={() => loginHandler("login", 8080)} />
                <SignupText onClick={() => navigate("/signup")}>
                    Don’t have an account? Signup Here
                </SignupText>
            </LoginContainer>
        </PageWrapper>
    );
}

export default LoginPage;
