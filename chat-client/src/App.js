import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import styled from "styled-components";
// import MainPageComponent from './components/pages/MainPageComponent'
import MainComponent from './components/pages/MainComponent';
import SignupComponent from './components/signup/SignupComponent';
import ChatComponent from './components/chat/ChatComponent';
// const MainTitleText = styled.p`
//     font-size: 24px;
//     font-weight: bold;
//     text-align: center;
// `;

function App(props) {
  return (
    <BrowserRouter>
        {/* <MainTitleText>2025 부경대 IoT 개발자 과정 채팅방</MainTitleText> */}
        <Routes>
                <Route path="/" element={<MainComponent />} />
                <Route path="/signup" element={<SignupComponent />} />
                <Route path="/chat/:userid" element={<ChatComponent />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
