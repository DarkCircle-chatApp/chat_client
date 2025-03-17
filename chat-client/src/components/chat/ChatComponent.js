import React, { useState } from "react";
// import styled, { createGlobalStyle } from "styled-components";
import TextInput from "../ui/TextInputComponent";
import Button from "../ui/ButtonComponent";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css";

function ChatPage() {
    const [messages, setMessages] = useState([]); // 메시지 목록
    const [message, setMessage] = useState(""); // 입력 메시지
    const [participants] = useState(["박관호"]); // 참여자 목록. 나중에 하드코딩 대신 db에서 로그인정보 불러와야함
    const navigate = useNavigate();

    // 메시지 전송 핸들러
    const sendMessageHandler = () => {
        // console.log(message);
        if (message.trim()) { // 공백일때는 실행 x
            setMessages([...messages, message]); // 기존 메시지에 새 메시지 추가
            setMessage(""); // 입력 필드 초기화
        }
    };

    // 엔터 키 입력 핸들러
    const keyDownHandler = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // 기본 줄바꿈 방지
            sendMessageHandler(); // 메시지 전송
        }
    };

    return (
        <div className="page-wrapper">
            <div className="chat-container">
                {/* 왼쪽: 채팅 영역 */}
                <div className="chat-section">
                    <h2 className="title" onClick={() => navigate("/")}>2025 부경대 IoT 개발자 과정 채팅방</h2>

                    {/* 채팅 메시지 표시 영역 */}
                    <div className="message-list">
                        {messages.map((msg, index) => (
                            <div key={index} className="message">{msg}</div>
                        ))}
                    </div>

                    {/* 메시지 입력 필드 + 전송 버튼 */}
                    <div className="message-input-container">
                        <TextInput
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={keyDownHandler}
                            placeholder="메시지를 입력하세요"
                        />
                        <Button title="send" className="send-button" onClick={sendMessageHandler} />
                    </div>
                </div>

                {/* 오른쪽: 참여자 목록 */}
                <div className="participants-container">
                    <h3 className="participants-title">참여자 목록</h3>
                    {participants.map((participant, index) => (
                        <div key={index} className="participant">{participant}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
