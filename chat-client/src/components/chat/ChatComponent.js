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
    const [page, setPage] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);
    const setLoginId = useSetRecoilState(userState);
    const [participantList, setParticipantList] = useState([]);


    const MYIP = "210.119.12.54";
    
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getAllMessages(0); // 초기 로딩
      }, []);

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
                body: JSON.stringify({ user_id: Number(user_id), }),
            });
            
            if (response.status === 200) {
                setUser_status(3);
                console.log("User banned successfully.");
                alert("채팅밴 완료")
                
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
                setUser_status(1);
                console.log("User unbanned successfully.");
                alert("채팅밴 해제 완료")
                
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
    const getAllMessages = async (page) => {
        try {
            const response = await fetch(`http://${MYIP}:8881/chat/messages?page=${page}`);
            if (response.ok) {
                const data = await response.json();
                // setMessages(data); // 메시지 목록 초기화
                setMessages(prev => [...data, ...prev]);
                if (page === 0 && autoScroll) scrollToBottom();
            } else {
                console.error("Failed to fetch messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const loadOlderMessages = () => {
        const nextPage = page + 1;
        setAutoScroll(false); // 자동 스크롤 끄기
        getAllMessages(nextPage);
        setPage(nextPage);
      };

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
                        user_id: Number(storedUserId),
                        user_status: user_status,
                        msg_text: message, // 보낼 메시지
                        user_name: user_name,
                    }),
                });

                if (response.ok) {
                    console.log("user_id", user_id);
                    // 메시지 전송 후 메시지 목록 업데이트
                    // setMessages(prevMessages => [...prevMessages, { message }]);
                    setMessage(""); // 입력 필드 초기화
                    setAutoScroll(true);
                } else {
                    const data = await response.json();
                    console.error("Failed to send message", response.status, data);
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
        if (autoScroll) {
            scrollToBottom();
        }
    }, [messages, autoScroll]);

    const exitChatRoom = async () => {
        const storedUserId = localStorage.getItem("user_id");
        try {
            const response = await fetch(`http://${MYIP}:8881/chat/exit`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: Number(storedUserId), }),
            });
            console.log("보내는 유저 정보:", storedUserId);
            // const responseBody = await response.text(); // 로그 찍어보는 용. 나중에 지울 것
            if (response.status === 200) {
                // setUser_status(3);
                console.log("Exit chat room successfully.");
                navigate(`/gateway`);
            } else {
                console.error("Failed to exit chat room:", response.status);
            }
        } catch (error) {
            console.error("exit error: ", error);
        }
    };

    // SSE 구독 (실시간 메시지 받기)
    useEffect(() => {
        const eventSourceRef = { current: null };
        let reconnectTimer = null;
    
        const connectSSE = () => {
            if (eventSourceRef.current) {
                console.log("이전 SSE 닫기");
                eventSourceRef.current.close();
            }
    
            const es = new EventSource(`http://${MYIP}:8881/chat/sse`);
            eventSourceRef.current = es;
            console.log("SSE 객체 생성됨:", es);
    
            es.onopen = () => {
                console.log("SSE 연결 성공! ReadyState:", es.readyState);
            };
    
            es.onmessage = (event) => {
                console.log("SSE Received:", event.data);
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "participants") {
                    const mappedParticipants = parsedData.participants.map(p => ({
                        id: p.user_id,
                        name: p.user_name
                    }));
                    console.log("참여자 목록 매핑 완료:", mappedParticipants);
                    setParticipantList(mappedParticipants);
                } else {
                    setMessages((prevMessages) => [...prevMessages, parsedData]);
                }
                scrollToBottom();
            };
    
            es.onerror = (err) => {
                console.error("SSE 연결 오류:", err);
                es.close();
    
                // 일정 시간 후 자동 재연결
                reconnectTimer = setTimeout(() => {
                    console.log("SSE 재연결 시도...");
                    connectSSE();
                }, 3000);
            };
        };
    
        connectSSE();
    
        return () => {
            console.log("SSE 완전 종료");
            if (eventSourceRef.current) eventSourceRef.current.close();
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

    // 참여자 목록

    const finalParticipants = [...participantList];

    // 서버에 내 정보가 없을 경우만 추가
    if (
    typeof user_id === 'number' &&
    user_name &&
    !finalParticipants.some((p) => p.id === user_id)
    ) {
    finalParticipants.push({ id: user_id, name: user_name });
    }

    // const getUserNameById = (id) => {
    //     const user = finalParticipants.find((p) => p.id === id);
    //     return user ? user.name : "알 수 없음";
    //   };

    console.log("최종 참여자 ID 목록:", finalParticipants);

    useEffect(() => {
        if (user_name && login_id) {
            setParticipants((prevParticipants) => {
                const alreadyExists = prevParticipants.some(p => p.id === user_id);
                if (!alreadyExists) {
                    return [...prevParticipants, {
                        id: user_id,
                        name: user_name,
                        login_id: login_id
                    }];
                }
                return prevParticipants;
            });
        }
    }); //, [user_name, login_id]);

    return (
        <div className="page-wrapper">
            <div className="chat-container">
                {/* 왼쪽: 채팅 영역 */}
                <div className="chat-section">
                    <h2 className="title" onClick={() => navigate("/gateway")}>2025 부경대 IoT 개발자 과정 채팅방</h2>
                    <button className="exit-button" onClick={exitChatRoom}>나가기</button>

                    {/* 채팅 메시지 표시 영역 */}
                    <div className="message-list">
                    <button className="load-button" onClick={loadOlderMessages}>
                        이전 기록 불러오기
                    </button>
                    {messages.map((msg) => {
                        const storedUserId = Number(localStorage.getItem("user_id"));
                        const isMyMessage = Number(msg.user_id) === storedUserId;
                        const senderName = msg.user_name || "알 수 없음";
                        // const sender = finalParticipants.find((p) => p.id === Number(msg.user_id));
                        // const senderName = sender ? sender.name : "알 수 없음";
                        return (
                            <div
                                key={msg.timestamp || msg.id}
                                className={`message-wrapper ${isMyMessage ? "my-message" : "other-message-wrapper"}`}
                            >
                                {/* <div className="sender-name">{senderName}</div> */}
                                {!isMyMessage && <div className="sender-name">{senderName}</div>}
                                <div className={isMyMessage ? "message" : "other-message"}>
                                    {msg.msg_text}
                                </div>
                            </div>
                            // <div key={msg.timestamp || msg.id} className={isMyMessage ? "message" : "other-message"}>
                            //     {msg.msg_text}
                            // </div>
                        );
                    })}
                    {/* {messages.map((msg, index) => {
                        const storedUserId = Number(localStorage.getItem("user_id"));
                        // console.log("로컬스토리지: ", storedUserId);
                        // console.log("메시지 user_id: ", Number(msg.user_id));
                        const isMyMessage = Number(msg.user_id) === storedUserId;
                        // console.log("isMyMessage : ", isMyMessage);
                        return (
                            <div key={index} className={isMyMessage ? "message" : "other-message"}>
                                {msg.msg_text}
                            </div>
                        );
                    })} */}
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
                    <h3 className="participants-title">채팅 멤버</h3>
                    {finalParticipants.map((participant) => (
                        <div key={participant.id} className="participant">
                            <div className="participant-name">
                                {participant.name}
                            </div>
                            {/* 관리자일 때만 채팅밴 버튼 활성화 */}
                            {/* {user_status === 0 && (
                                <div className="ban-buttons">
                                    <BanButton
                                        title="채팅밴"
                                        className={bannedUsers.has(participant.id) ? "ban-button red" : "ban-button"}
                                        onClick={() => banUserChat("chat/admin/ban", 8080, participant.id)}
                                    />
                                    <BanButton
                                        title="해제"
                                        className="unban-button"
                                        onClick={() => banUserChat("chat/admin/ban", 8080, participant.id)}
                                    />
                                </div>
                            )} */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
