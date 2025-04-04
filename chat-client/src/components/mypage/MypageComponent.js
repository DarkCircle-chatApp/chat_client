import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState  } from "recoil";
import { userState } from "../state/UserState";  // 로그인 정보 가져오기
import Loading from "../load/Loading";

// 스타일링
const PageWrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #5B86E5;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ProfileContainer = styled.div`
    width: 850px;
    height: auto;
    background: #FFFFFF;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
`;

const Title = styled.h2`
    font-family: 'Telegraf', sans-serif;
    font-weight: 800;
    font-size: 30px;
    color: #000000;
    margin-bottom: 20px;
`;

const InfoWrapper = styled.div`
    width: 100%;
    margin-bottom: 20px;
`;

const InfoItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 25px;
    border-bottom: 1px solid #ddd;
`;

const InfoLabel = styled.span`
    font-weight: bold;
`;

const InfoValue = styled.span`
    color: #555;
`;

const EditButton = styled.button`
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        background-color: #45a049;
    }
`;

const PasswordSection = styled.div`
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const PasswordLabel = styled.label`
    font-weight: bold;
    margin-bottom: 8px;
`;

const PasswordInput = styled.input`
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
`;

const PasswordButton = styled.button`
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 15px 20px;
    cursor: pointer;
    font-size: 15px;

    &:hover {
        background-color: #e53935;
    }
`;

const EyeIcon = styled.div`
    position: absolute;
    right: 10px;
    cursor: pointer;
    color: #9D9D9D;
    font-size: 20px;
`;

function MyPage() {
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { token } = useRecoilValue(userState); // 로그인된 정보 가져오기
    const { login_id } = useRecoilValue(userState);
    const [seePassword, setSeePassword] = useState(false); // 기본값 : 비밀번호 숨김
    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false); // 로딩 상태
    
    const MYIP = "210.119.12.54";

    const setLoginId = useSetRecoilState(userState);

    const seePasswordHandler = () => {
        setSeePassword(!seePassword);
    };

    const handlePasswordCheckChange = (event) => {
        const value = event.target.value;
        setPasswordCheck(value);
    
        if (confirmPassword !== value) {
            setPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setPasswordError("");
        }
    };

    useEffect(() => {
        // 로컬 스토리지에서 login_id가 없으면 로그인 정보가 비어있을 때 가져오기
        const storedLoginId = localStorage.getItem("login_id");
        if (storedLoginId && !login_id) {
            setLoginId({ login_id: storedLoginId, token });
        }
    }, [login_id, token, setLoginId]);

    useEffect(() => {
        // 로그인 정보가 없으면 페이지를 리디렉션 또는 로컬 저장소에 로그인 정보가 없다면 이를 처리하는 로직을 추가
        if (login_id) {
            localStorage.setItem("login_id", login_id);
        }
    }, [login_id]);

    useEffect(() => {
        const fetchUserInfo = async (login_id) => {
            try {
                setLoading(true);
                const response = await fetch(`http://${MYIP}:8080/chat/admin/user_select`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ login_id: login_id }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setLoading(false);
                    setUser(data[0]); // 배열에서 첫 번째 데이터만 사용
                } else {
                    setLoading(false);
                    console.error("Failed to fetch user information");
                }
            } catch (error) {
                setLoading(false);
                console.error("Error fetching user information:", error);
            }
        };

        if (login_id) {
            fetchUserInfo(login_id);
        }
    }, [token, login_id]);

    const handleEdit = () => {
        alert("수정 기능을 추가해주세요!");
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await fetch(`http://${MYIP}:8080/chat/admin/change_password`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    login_id: login_id,
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            if (response.ok) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                alert("비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("비밀번호 변경 실패:", error);
            alert("비밀번호 변경에 실패했습니다.");
        }
    };

    return (
        <PageWrapper>
            {loading ? <Loading /> : null}
            <ProfileContainer>
                <Title>My Page</Title>
                <InfoWrapper>
                    <InfoItem>
                        <InfoLabel>Name</InfoLabel>
                        <InfoValue>{user?.user_name || "정보 없음"}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Email</InfoLabel>
                        <InfoValue>{user?.user_email || "정보 없음"}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Login ID</InfoLabel>
                        <InfoValue>{user?.login_id || "정보 없음"}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Phone</InfoLabel>
                        <InfoValue>{user?.user_phone || "정보 없음"}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Address</InfoLabel>
                        <InfoValue>{user?.user_addr || "정보 없음"}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Birth-date</InfoLabel>
                        <InfoValue>{user?.user_birthdate || "정보 없음"}</InfoValue>
                    </InfoItem>
                </InfoWrapper>

                {/* <EditButton onClick={handleEdit}>Edit Profile</EditButton> */}

                {/* 비밀번호 변경 섹션 */}
                <PasswordSection>
                    <PasswordLabel>Current Password</PasswordLabel>
                    <PasswordInput
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호"
                    />
                    <PasswordLabel>New Password</PasswordLabel>
                    <PasswordInput
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호"
                    />
                    <EyeIcon onClick={seePasswordHandler}>
                        {seePassword ? <FaEye /> : <FaEyeSlash />}
                    </EyeIcon>
                    <PasswordLabel>Confirm New Password</PasswordLabel>
                    <PasswordInput
                        type="password"
                        value={passwordCheck}
                        onChange={handlePasswordCheckChange}
                        placeholder="새 비밀번호 확인"
                        // type={seePassword ? "text" : "password"}
                    />
                </PasswordSection>
                    <EditButton onClick={handleEdit}>비밀번호 변경</EditButton>
            </ProfileContainer>
        </PageWrapper>
    );
}

export default MyPage;
