import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import styled from "styled-components";
import MainPageComponent from './components/pages/MainPageComponent'
import LoginComponent from './components/login/LoginComponent';
import SignupComponent from './components/signup/SignupComponent';
import ChatComponent from './components/chat/ChatComponent';
const MainTitleText = styled.p`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
`;

function App(props) {
  return (
    <BrowserRouter>
        {/* <MainTitleText>2025 부경대 IoT 개발자 과정 채팅방</MainTitleText> */}
        <Routes>
                <Route path="/" element={<MainPageComponent />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/signup" element={<SignupComponent />} />
                <Route path="/chat" element={<ChatComponent />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
