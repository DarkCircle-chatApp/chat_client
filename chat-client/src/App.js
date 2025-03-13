import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import styled from "styled-components";
import MainPage from "./components/pages/MainPageComponent";
import PostWritePage from "./components/pages/PostWritePageComponent";
import PostViewPage from "./components/pages/PostViewPageComponent";

const MainTitleText = styled.p`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
`;

function App(props) {
  return (
    <BrowserRouter>
        <MainTitleText>2025 부경대 IoT 개발자 과정 채팅방</MainTitleText>
        <Routes>
            <Route index element={<MainPage />} />
            <Route path="post-write" element = {<PostWritePage />} />
            <Route path="post/:postId" element = {<PostViewPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
