import React, { useState, useEffect, useRef } from "react";
import TextInput from "../ui/TextInputComponent";
import Button from "../ui/ButtonComponent";
import BanButton from "../ui/BanButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../state/UserState";
import "./ChatPage.css";

function ChatPage() {
    const [messages, setMessages] = useState([]); // 메시지 목록
    const [message, setMessage] = useState(""); // 입력 메시지
    // const [user_id] = useState(1); // 임시방편
    const { login_id } = useParams();
    const [user_status, setUser_status] = useState("Loading...");
    const [user_name, setUser_name] = useState("");
    const [user_id, setUser_id] = useState("");
    const [participants, setParticipants] = useState([]);
    const user = useRecoilValue(userState); // recoil 로그인 상태 데이터
    // const [token, setToken] = useState(null); // 로그인 토큰 상태
    const {token, login_id:recoilLoginId} = useRecoilValue(userState);
    const [bannedUsers, setBannedUsers] = useState(new Set());
    const setLoginId = useSetRecoilState(userState);

    const MYIP = "210.119.12.54";
    
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("user_id");
        const storedUserName = localStorage.getItem("user_name");
        console.log("로컬스토리지 user_id:", storedUserId);
        console.log("로컬스토리지 user_name:", storedUserName);

        if (storedUserName && storedUserId) {
            setUser_id(storedUserId); // 상태 업데이트
            setUser_name(storedUserName);
        }
    }, []);

    useEffect(() => {
            // 페이지 로드 시 로컬 스토리지에서 login_id 가져오기
            const storedLoginId = localStorage.getItem('login_id');
            if (storedLoginId && !login_id) {
                // 로그인 정보가 로컬 스토리지에 있을 경우 Recoil 상태에 설정
                setLoginId({ login_id: storedLoginId });
            }
    }, [login_id, setLoginId]);

    // 채팅밴
    const banUserChat = async (endpoint, port, user_id) => {
        try {
            const response = await fetch(`http://${MYIP}:${port}/${endpoint}`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: user_id, }),
            });
            
            // const responseBody = await response.text(); // 로그 찍어보는 용. 나중에 지울 것
            if (response.status === 200) {
                console.log("User banned successfully.");
                
            } else {
                console.error("Failed to ban user:", response.status);
            }
        } catch (error) {
            console.error("ban user chat error: ", error);
        }
    };

    // 채팅밴 해제
    const unbanUserChat = async (endpoint, port, user_id) => {
        try {
            const response = await fetch(`http://${MYIP}:${port}/${endpoint}`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: user_id, }),
            });
            
            // const responseBody = await response.text(); // 로그 찍어보는 용. 나중에 지울 것
            if (response.status === 200) {
                console.log("User unbanned successfully.");
                
            } else {
                console.error("Failed to unban user:", response.status);
            }
        } catch (error) {
            console.error("unban user chat error: ", error);
        }
    };

    // user_id 조회
    const getUserId = async (login_id, endpoint, port, token) => {
        try {
            const response = await fetch(`http://${MYIP}:${port}/${endpoint}/${login_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.user_id) {
                    // setUser_id(data.user_id); // user_id 저장
                    console.log("Fetched user_id:", data.user_id);
                    return data.user_id;
                } else {
                    console.error("User not found in response");
                    // return null;
                }
            } else {
                console.error("Failed to fetch user_id:", response.status);
                // return null;

            }
        } catch (error) {
            console.error("Error fetching user_id:", error);
            // return null;

        }
    };

    // user_status값 조회
    const getUserStatus = async (login_id, endpoint, port, token) => {
        try {
            const response = await fetch(`http://${MYIP}:${port}/${endpoint}/${login_id}`, {
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
        const storedUserId = localStorage.getItem("user_id");
        if (message.trim()) {
            console.time("Message Send Time"); // 요청 시작 시간 측정
            // const tempMessage = { user_id, message };
            // setMessages((prevMessages) => [...prevMessages, tempMessage]);
            try {
                // semdMessage 호출
                const response = await fetch(`http://${MYIP}:8881/chat/room`, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user_id: storedUserId,
                        msg_text: message, // 보낼 메시지
                    }),
                });

                if (response.ok) {
                    console.log("user_id", user_id);
                    // 메시지 전송 후 메시지 목록 업데이트
                    // setMessages(prevMessages => [...prevMessages, { message }]);
                    setMessage(""); // 입력 필드 초기화
                } else {
                    console.error("Failed to send message");
                }
                console.timeEnd("Message Send Time"); // 요청 끝나는 시간 측정
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


    useEffect(() => {
        // getAllMessages(); // 페이지 로드 시
        // getUserStatus(user_id, "statCheck", 8080, token);
    },[]);

    // SSE 구독 (실시간 메시지 받기)
    useEffect(() => {
        let eventSource = null;
        let reconnectTimer = null;
    
        const connectSSE = () => {
            eventSource = new EventSource(`http://${MYIP}:8881/chat/sse`);
            console.log("SSE 객체 생성됨:", eventSource);
    
            eventSource.onopen = () => {
                console.log("SSE 연결 성공! ReadyState:", eventSource.readyState);
            };
    
            eventSource.onmessage = (event) => {
                console.log("SSE Received:", event.data);
                // const parsedData = JSON.parse(event.data);
                // console.log("Parsed Message Data:", parsedData);
                // setMessages((prevMessages) => [...prevMessages, parsedData]);
                setMessages((prevMessages) => [...prevMessages, { message: event.data }]);
                // console.log("+++++++++++", messages.user_id)
                scrollToBottom();
            };
    
            eventSource.onerror = (err) => {
                console.error("SSE 연결 오류:", err);
                eventSource.close();
    
                // 일정 시간 후 자동 재연결 (예: 3초 후)
                reconnectTimer = setTimeout(() => {
                    console.log("SSE 재연결 시도...");
                    connectSSE();
                }, 3000);
            };
        };
    
        connectSSE(); // 최초 연결
    
        return () => {
            console.log("SSE 연결 종료");
            if (eventSource) eventSource.close();
            if (reconnectTimer) clearTimeout(reconnectTimer);
        };
    }, []);

    // 채팅밴 버튼 핸들러
    const banUserHandler = async (login_id) => {
        console.log(`User with id ${login_id} banned by admin`);
        
        const user_id = await getUserId(login_id, "showId", 8080, token);

        // console.log("Banning user with id:", user_id);
    
        if (user_id) {
            console.log("Banning user with id:", user_id);
            const response = await banUserChat("chat/admin/ban", 8080, user_id);

            if (response?.status === 200) {
                setBannedUsers((prev) => new Set([...prev, login_id])); // 밴된 유저 추가
            }
        } else {
            console.error("ban failed");
        }
    };

     // 채팅밴 해제 버튼 핸들러
     const unbanUserHandler = async (login_id) => {
        console.log(`User with id ${login_id} unbanned by admin`);
        
        const user_id = await getUserId(login_id, "showId", 8080, token);

        // console.log("Banning user with id:", user_id);
    
        if (user_id) {
            console.log("Unbanning user with id:", user_id);
            const response = await unbanUserChat("chat/admin/unban", 8080, user_id);

            // if (response?.status === 200) {
            //     setBannedUsers((prev) => new Set([...prev, login_id])); // 밴된 유저 추가
            // }
        } else {
            console.error("ban failed");
        }
    };

    // user_name -> participants에 추가
    useEffect(() => {
        if (user_name) {
            setParticipants((prevParticipants) => [
                ...prevParticipants,
                { id: login_id, name: user_name },
            ]);
        }
    }, [user_name, login_id]);

    useEffect(() => {
        console.log("User status updated:", user_status);
    }, [user_status]);

    return (
        <div className="page-wrapper">
            <div className="chat-container">
                {/* 왼쪽: 채팅 영역 */}
                <div className="chat-section">
                    <h2 className="title" onClick={() => navigate("/gateway")}>2025 부경대 IoT 개발자 과정 채팅방</h2>

                    {/* 채팅 메시지 표시 영역 */}
                    <div className="message-list">
                    {messages.map((msg, index) => {
                        const storedUserId = Number(localStorage.getItem("user_id"));
                        // console.log("로컬스토리지: ", storedUserId);
                        // console.log("메시지 user_id: ", Number(msg.user_id));
                        const isMyMessage = Number(msg.user_id) === storedUserId;
                        // console.log("isMyMessage : ", isMyMessage);
                        return (
                            <div key={index} className={isMyMessage ? "message" : "other-message"}>
                                {msg.message}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                    </div>

                    {/* 채팅 메시지 표시 영역 */}
                    {/* <div className="message-list">
                        {Array.isArray(messages) && messages.map((msg, index) => (
                            <div key={index} className="message">{msg.message}</div>
                        ))}
                    </div> */}

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
                            <div className="participant-name">
                                {participant.name}
                            </div>
                            {/* 관리자일 때만 채팅밴 버튼 활성화 */}
                            {user_status === 0 && (
                                <div className="ban-buttons">
                                    <BanButton
                                        title="채팅밴"
                                        className={bannedUsers.has(participant.id) ? "ban-button red" : "ban-button"}
                                        onClick={() => banUserHandler(participant.id)}
                                    />
                                    <BanButton
                                        title="해제"
                                        className="unban-button"
                                        onClick={() => unbanUserHandler(participant.id)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
