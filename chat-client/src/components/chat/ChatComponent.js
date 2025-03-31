import React, { useState, useEffect, useRef } from "react";
import TextInput from "../ui/TextInputComponent";
import Button from "../ui/ButtonComponent";
import BanButton from "../ui/BanButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../state/UserState";
import "./ChatPage.css";

function ChatPage() {
    const [messages, setMessages] = useState([]); // 메시지 목록
    const [message, setMessage] = useState(""); // 입력 메시지
    // const [user_id] = useState(1); // 임시방편
    const { login_id } = useParams();
    const [user_status, setUser_status] = useState("Loading...");
    const [user_name, setUser_name] = useState("");
    const [participants, setParticipants] = useState([]);
    const user = useRecoilValue(userState); // recoil 로그인 상태 데이터
    // const [token, setToken] = useState(null); // 로그인 토큰 상태
    const {token, login_id:recoilLoginId} = useRecoilValue(userState);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // useEffect(() => {
    //     const storedToken = localStorage.getItem("token");
    //     if (storedToken) {
    //         setToken(storedToken);
    //     }
    // }, []);
    
    // user_name 조회
    const getUserName = async (login_id, endpoint, port, token) => {
        try {
            const response = await fetch(`http://localhost:${port}/${endpoint}/${login_id}`, {
                headers: {
                    "Authorization" : `Bearer ${token}`,
                },
            });
            console.log("response status: ", response.status);
            if (response.ok) {
                const responseText = await response.text(); // 응답 본문 확인
                console.log("Raw response text:", responseText);

                try {
                    const data = JSON.parse(responseText); // 직접 JSON 파싱
                    if (data.user_name) {  // user_name이 응답에 포함되어 있는지 확인
                        setUser_name(data.user_name); // user_name을 상태로 저장
                        console.log("Parsed response data:", data);
                    } else {
                        setUser_name("Unknown");
                        console.error("User name not found in response");
                    }
                } catch (error) {
                    console.error("Failed to parse response as JSON:", error);
                    setUser_name("Error parsing user name");
                }
            } else {
                console.error("Failed to fetch user name:", response.status);
                if (response.status === 404) {
                    setUser_name("User not found");
                } else {
                    setUser_name("Error fetching user name");
                }
            }
        } catch (error) {
            console.error("Error fetching user_status: ", error);
        }
    }

    // user_status값 조회
    const getUserStatus = async (login_id, endpoint, port, token) => {
        try {
            const response = await fetch(`http://localhost:${port}/${endpoint}/${login_id}`, {
                headers: {
                    "Authorization" : `Bearer ${token}`,
                },
            });
            console.log("response status: ", response.status);
            if (response.ok) {
                const responseText = await response.text(); // 응답 본문 확인
                console.log("Raw response text:", responseText);

                try {
                    const data = JSON.parse(responseText); // 직접 JSON 파싱
                    console.log("Parsed response data:", data);
                    if (data.user_status !== undefined) {
                        setUser_status(data.user_status);
                    } else {
                        setUser_status("Error fetching user status");
                    }
                } catch (error) {
                    console.error("Failed to parse response as JSON:", error);
                    setUser_status("Error parsing user status");
                }
            } else {
                console.error("Failed to fetch user status:", response.status);
                if (response.status === 404) {
                    setUser_status("User not found");
                } else {
                    setUser_status("Error fetching user status");
                }
            }
        } catch (error) {
            console.error("Error fetching user_status: ", error);
        }
    }
    useEffect(() => {
        if (token) {
            console.log("Recoil login_id:", login_id);
            console.log("Recoil token:", token);
            const currentLoginId = login_id || recoilLoginId;
            getUserStatus(currentLoginId, "statCheck", 8080, token);
        }
    }, [token, login_id, recoilLoginId]);

    // 메시지 목록 랜더링
    // const getAllMessages = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:8090/chat/getAllMessages`);
    //         if (response.ok) {
    //             const data = await response.json();
    //             setMessages(data); // 메시지 목록 초기화
    //             scrollToBottom();
    //         } else {
    //             console.error("Failed to fetch messages");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching messages:", error);
    //     }
    // };

    // 메시지 전송
    const sendMessageHandler = async () => {
        console.log(message);
        if (message.trim()) {
            try {
                // semdMessage 호출
                const response = await fetch(`http://localhost:8090/chat/${login_id}/sendMessage`, {
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
                    setMessages(prevMessages => [...prevMessages, { message }]);
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
            // sendMessageHandler(); // 메시지 전송
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


    useEffect(() => {
        // getAllMessages(); // 페이지 로드 시
        // getUserStatus(user_id, "statCheck", 8080, token);
    },[]);

    // SSE 구독 (실시간 메시지 받기)
    // useEffect(() => {
    //     const eventSource = new EventSource("http://localhost:8090/chat/subscribe");

    //     eventSource.onmessage = (event) => {
    //         setMessages((prevMessages) => [...prevMessages, { message: event.data }]);
    //         scrollToBottom();
    //     };

    //     eventSource.onerror = () => {
    //         console.error("SSE 연결 오류");
    //         eventSource.close();
    //     };

    //     return () => {
    //         eventSource.close();
    //     };
    // }, []);

    // 채팅밴 버튼 핸들러
    const banUserHandler = (participant_id) => {
        console.log(`User with id ${participant_id} banned by admin`);
        // 아래에 채팅밴 기능 api 연동
    };

    useEffect(() => {
        if (token && login_id) {
            console.log("Fetching user name for:", login_id);
            getUserName(login_id, "getName", 8080, token);
        }
    }, [token, login_id]);

    // user_name을 participants에 추가하는 부분
    useEffect(() => {
        if (user_name) {
            setParticipants((prevParticipants) => [
                ...prevParticipants,
                { id: login_id, name: user_name },
            ]);
        }
    }, [user_name, login_id]);

    // useEffect(() => {
    //     if (token && login_id) {
    //         console.log("Fetching user name for:", login_id);
    //         getUserName(login_id, "getName", 8080, token);
    //         // participants에 user_name 추가
    //         setParticipants((prevParticipants) => [
    //             ...prevParticipants,
    //             { id: login_id, name: user_name },
    //         ]);
    //     }
    // }, [token, login_id, user_name]);

    // 임의의 참여자 추가 (관리자로 로그인했을 때 확인할 수 있도록)
    useEffect(() => {
        setParticipants((prevParticipants) => [
            ...prevParticipants,
            { id: "ronaldo7", name: "호날두" },
        ]);
    }, []);

    useEffect(() => {
        console.log("User status updated:", user_status);
    }, [user_status]);

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
                    {participants.map((participant) => (
                        <div key={participant.name} className="participant">
                            {participant.name}
                            {/* 관리자일 때만 채팅밴 버튼 활성화 */}
                            {user_status === 0 && (
                                <BanButton title="채팅밴" onClick={() =>{ 
                                    console.log("Banning user with id:", participant.id);
                                    banUserHandler(participant.id)} }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
