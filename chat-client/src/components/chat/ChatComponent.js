import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../ui/TextInputComponent";
import Button from "../ui/ButtonComponent";

// 전체 채팅방 배경
const Wrapper = styled.div`
    position: relative;
    width: 2228px;
    height: 1325px;
    background: #5B86E5; /* 채팅방 배경색 */
`;

// 로그인 페이지 영역
const LoginPage = styled.div`
    position: absolute;
    width: 1920px;
    height: 1080px;
    left: 154px;
    top: 123px;
    background: #FFFFFF;
    border: 1px solid #DBDBDB;
    border-radius: 50px; /* 둥근 모서리 */
`;

// 반투명 배경
const Overlay = styled.div`
    position: absolute;
    width: 1920px;
    height: 1080px;
    left: 0;
    top: 0;
    background: rgba(91, 134, 229, 0.51);
    border-radius: 50px; /* 둥근 모서리 */
`;

// 채팅 메시지 표시 영역
const ChatContainer = styled.div`
    position: absolute;
    width: 1322px;
    height: 600px;  /* 메시지 영역 높이 */
    left: 25px;
    top: 120px;  /* 상단 여백 */
    padding: 16px;
    overflow-y: scroll;
    background-color: #f0f4f8;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  /* 그림자 효과 */
`;

// 개별 메시지 스타일
const Message = styled.div`
    padding: 8px;
    margin: 8px 0;
    border-radius: 8px;
    background-color: lightblue;
    max-width: 80%;
    word-wrap: break-word;
`;

// 하단 입력 필드, 버튼 영역
const MessageInputContainer = styled.div`
    position: absolute;
    width: 1322px;
    height: 275px;
    left: 25px;
    top: 791px;
    background: #D9D9D9;
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  /* 그림자 효과 */
`;

// 메시지 입력 필드 스타일
const StyledInput = styled(TextInput)`
    width: 90%;
    height: 40px;
    margin-bottom: 16px;
    border-radius: 20px;
    padding: 8px;
`;

// 메시지 보내기 버튼
const SendButton = styled(Button)`
    width: 90%;
    height: 60px;
    background: #5B86E5;
    border-radius: 50px;
    color: white;
    font-size: 18px;
`;
const MainTitleText = styled.p`
    font-size: 24px;
    font-weight: bold;
    text-align: left;
`;

function ChatPage(props) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage(""); // 메시지 입력 필드 초기화
        }
    };

    return (
        <Wrapper>
            <MainTitleText>2025 부경대 IoT 개발자 과정 채팅방</MainTitleText>
            <LoginPage>
                <Overlay />
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    {/* 채팅 메시지 표시 영역 */}
                    <ChatContainer>
                        {messages.map((msg, index) => (
                            <Message key={index}>{msg}</Message>
                        ))}
                    </ChatContainer>

                    {/* 메시지 입력 필드, 버튼 */}
                    <MessageInputContainer>
                        <StyledInput
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="메시지를 입력하세요"
                        />
                        <SendButton
                            title="전송"
                            onClick={handleSendMessage}
                        />
                    </MessageInputContainer>
                </div>
            </LoginPage>
        </Wrapper>
    );
}

export default ChatPage;
