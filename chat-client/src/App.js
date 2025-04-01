import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import styled from "styled-components";
// import MainPageComponent from './components/pages/MainPageComponent'
import MainComponent from './components/pages/MainComponent';
import SignupComponent from './components/signup/SignupComponent';
import ChatComponent from './components/chat/ChatComponent';
import AdminComponent from './components/admin/AdminComponent';
import MypageComponent from './components/mypage/MypageComponent';
import GatewayComponent from './components/pages/GatewayComponent';
import { RecoilRoot } from "recoil";
// import TestComponent from "./components/chat/TestComponent";
// const MainTitleText = styled.p`
//     font-size: 24px;
//     font-weight: bold;
//     text-align: center;
// `;

function App(props) {
  return (
    <RecoilRoot>
      <BrowserRouter>
          {/* <MainTitleText>2025 부경대 IoT 개발자 과정 채팅방</MainTitleText> */}
          <Routes>
                  <Route path="/" element={<MainComponent />} />
                  {/* <Route path="/" element={<TestComponent />} /> */}
                  <Route path="/signup" element={<SignupComponent />} />
                  <Route path="/chat/:login_id" element={<ChatComponent />} />
                  <Route path="/admin" element={<AdminComponent />} />
                  <Route path="/mypage" element={<MypageComponent />} />
                  <Route path="/gateway" element={<GatewayComponent />} />
          </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
