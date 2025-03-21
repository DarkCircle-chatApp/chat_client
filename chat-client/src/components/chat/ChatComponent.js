import React, { useState, useEffect, useRef } from "react";
import TextInput from "../ui/TextInputComponent";
import Button from "../ui/ButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import "./ChatPage.css";

function ChatPage() {
    const [messages, setMessages] = useState([]); // 메시지 목록
    const [message, setMessage] = useState(""); // 입력 메시지
    // const [userid] = useState(1); // 임시방편
    const { userid } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // 메시지 목록 랜더링
    const getAllMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8090/chat/getAllMessages`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data); // 서버에서 받은 메시지 목록 업데이트
                scrollToBottom();
            } else {
                console.error("Failed to fetch messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // 메시지 전송
    const sendMessageHandler = async () => {
        console.log(message);
        if (message.trim()) {
            try {
                // semdMessage 호출
                const response = await fetch(`http://localhost:8090/chat/${userid}/sendMessage`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: message, // 보낼 메시지
                    }),
                });

                if (response.ok) {
                    // 메시지 전송 후 메시지 목록 업데이트
                    setMessages([...messages, { message }]);
                    setMessage(""); // 입력 필드 초기화
                } else {
                    console.error("Failed to send message");
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    // 엔터 키 입력 핸들러
    const keyDownHandler = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // 기본 줄바꿈 방지
            sendMessageHandler(); // 메시지 전송
        }
    };

    //스크롤 항상 맨 아래
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // messages가 변경될 때마다 스크롤 맨 아래에 위치
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 페이지 처음 로드될 때, 메시지 변경될 때마다 메시지 목록 조회
    useEffect(() => {
        getAllMessages(); // 페이지 로드 시
    },[]);

    return (
        <div className="page-wrapper">
            <div className="chat-container">
                {/* 왼쪽: 채팅 영역 */}
                <div className="chat-section">
                    <h2 className="title" onClick={() => navigate("/")}>2025 부경대 IoT 개발자 과정 채팅방</h2>

                    {/* 채팅 메시지 표시 영역 */}
                    <div className="message-list">
                        {Array.isArray(messages) && messages.map((msg, index) => (
                            <div key={index} className="message">{msg.message}</div>
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
                    <div className="participant">박관호</div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
