import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../ui/ButtonComponent";
import TextInput from "../ui/TextInputComponent";
import Loading from "../load/Loading";

const PageWrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #5B86E5;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SignupContainer = styled.div`
    position: relative;
    width: 1325px;
    height: 1080px;
    background: #FFFFFF;
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h2`
    font-family: 'Telegraf', sans-serif;
    font-weight: 800;
    font-size: 30px;
    color: #000000;
    margin-bottom: 20px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 575px;
`;

const InputLabel = styled.label`
    font-family: 'Telegraf', sans-serif;
    font-size: 16px;
    color: #9D9D9D;
    width: 100%;
    margin-bottom: 5px;
`;

const Line = styled.div`
    width: 575px;
    height: 1px;
    background: #9D9D9D;
    margin-bottom: 20px;
`;

const SignupButton = styled(Button)`
    width: 575px;
    height: 60px;
    background: #5B86E5;
    border-radius: 8px;
    font-weight: 800;
    font-size: 16px;
    color: #FFFFFF;
    margin-top: 10px;
`;

const AddressWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const AddressButton = styled.button`
    background: #5B86E5;
    color: white;
    border: none;
    padding: 12px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    text-align: center;
    white-space: nowrap;
`;

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const ModalContent = styled.div`
    background: white;
    padding: 10px;
    border-radius: 10px;
    z-index: 10000;
    font-size: 20px;
    font-family: 'Telegraf', sans-serif;
    overflow: auto;
`;

const LoginText = styled.p`
    font-family: 'Telegraf', sans-serif;
    font-size: 16px;
    color: #000000;
    margin-top: 10px;
    cursor: pointer;
`;
const EyeIcon = styled.div`
    position: absolute;
    right: 10px;
    cursor: pointer;
    color: #9D9D9D;
    font-size: 20px;
`;
const PasswordWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
`;
const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-top: 5px;
`;
const BirthdateWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
`;
const BirthdateButton = styled.button`
    background: #5B86E5;
    color: white;
    border: none;
    padding: 12px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    text-align: center;
    white-space: nowrap;
`;

function SignupPage() {
    const navigate = useNavigate();
    const [login_id, setLogin_id] = useState("");
    const [login_pw, setLogin_pw] = useState("");
    const [user_name, setUser_name] = useState("");
    const [user_addr, setUser_addr] = useState("");
    const [user_phone, setUser_phone] = useState("");
    const [emailUser, setEmailUser] = useState(""); // 이메일 아이디
    const [emailDomain, setEmailDomain] = useState(""); // 이메일 도메인
    const [customDomain, setCustomDomain] = useState(""); // 도메인 직접 입력
    const [isCustom, setIsCustom] = useState(false); // 직접 입력 여부
    const [user_email, setUser_email] = useState("");
    const [user_birthdate, setUser_birthdate] = useState(null);
    const [seePassword, setSeePassword] = useState(false); // 기본값 : 비밀번호 숨김
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [idError, setIdError] = useState(""); // 아이디 중복 에러 메시지 상태
    const [addressModalOpen, setAddressModalOpen] = useState(false); // 주소 모달 상태
    const [birthdateModalOpen, setBirthdateModalOpen] = useState(false); // 생일 모달 상태
    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const domainOptions = ["naver.com", "daum.net", "gmail.com", "hanmail.net", "nate.com", "직접 입력"];

    const MYIP = "210.119.12.54";

    const seePasswordHandler = () => {
        setSeePassword(!seePassword);
    };

    const handlePasswordChange = (event) => {
        setLogin_pw(event.target.value);
    };
    
    const handlePasswordCheckChange = (event) => {
        const value = event.target.value;
        setPasswordCheck(value);
    
        if (login_pw !== value) {
            setPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setPasswordError("");
        }
    };

    const handleComplete = (data) => {
        let fullAddress = data.roadAddress;
        if (data.jibunAddress) {
            fullAddress += ` (${data.jibunAddress})`;
        }
        setUser_addr(fullAddress);
        setAddressModalOpen(false);
    };

    const handleBirthdateChange = (date) => {
        setUser_birthdate(date);
        setBirthdateModalOpen(false);
    };

     // 아이디 중복 체크
     const checkIdExist = async (login_id, endpoint, port) => {
        try {
            const response = await fetch(`http://${MYIP}:${port}/${endpoint}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login_id: login_id, }),
            });
            
            // const responseBody = await response.text(); // 로그 찍어보는 용. 나중에 지울 것
            if (response.status === 400) {
                // console.error(responseBody);
                setIdError("이미 존재하는 아이디");
            } else if (response.status === 200) {
                // console.log(responseBody);
                setIdError("");
            }
        } catch (error) {
            console.error("Error checking ID: ", error);
        }
    };

    const signupHandler = async (endpoint, port) => {
        console.log("회원가입 시도:", login_id, login_pw, user_name, 
                                      user_addr, user_phone, user_email, user_birthdate);
        if (login_id.trim() && login_pw.trim() && user_name.trim() && user_addr.trim() && user_phone.trim() && user_email.trim() && user_birthdate) {
            try {
                setLoading(true); // 로딩 시작
                // const [year, month, day] = user_birthdate.split('-').map(Number);
                const [year, month, day] = [user_birthdate.getFullYear(), user_birthdate.getMonth() + 1, user_birthdate.getDate()];

                const response = await fetch(`http://${MYIP}:${port}/${endpoint}`, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        login_id: login_id,
                        login_pw: login_pw,
                        user_name: user_name,
                        user_addr: user_addr,
                        user_phone: user_phone,
                        user_email: user_email,
                        user_birthdate: { year, month, day },
                    }),
                });
                
                if (response.status === 400) {
                    // 아이디 중복 처리
                    alert("이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요.");
                    setLoading(false); // 로딩 종료
                } else if (response.ok) {
                    setLoading(false); // 로딩 종료
                    const data = await response.json();
                    console.log("회원가입 성공: ", data);
                    navigate(`/`);  // 회원가입 후 홈으로 이동
                } else {
                    console.error("회원가입 실패. 상태: ", response.status);
                    setLoading(false); // 로딩 종료
                }
            } catch (error) {
                console.error("Error message: ", error);
                setLoading(false); // 로딩 종료
            }
        } else {
            alert("모든 회원정보를 입력해주세요");
        }
        // navigate("/");
    };

    const handleEmailUserChange = (event) => {
        const newUser = event.target.value;
        setEmailUser(newUser);
        setUser_email(`${newUser}@${isCustom ? customDomain : emailDomain}`);
    };

    const handleDomainChange = (event) => {
        const selectedDomain = event.target.value;
        if (selectedDomain === "직접 입력") {
            setIsCustom(true);
            setEmailDomain("");
            setCustomDomain("");
            setUser_email(`${emailUser}@`);
        } else {
            setIsCustom(false);
            setEmailDomain(selectedDomain);
            setUser_email(`${emailUser}@${selectedDomain}`);
        }
    };

    const handleCustomDomainChange = (event) => {
        const newCustomDomain = event.target.value;
        setCustomDomain(newCustomDomain);
        setUser_email(`${emailUser}@${newCustomDomain}`);
    };

    useEffect(() => {
        if (login_id) {
            checkIdExist(login_id, "idCheck", 8080);
        }
    }, [login_id]);

    const handleBirthdateInput = (event) => {
        let value = event.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 받기
    
        // 날짜 형식이 길어지면 YYYY-MM-DD 형식으로 변환
        if (value.length >= 5 && value.length <= 6) {
            value = value.replace(/(\d{4})(\d{2})/, "$1-$2");
        } else if (value.length >= 7 && value.length <= 8) {
            value = value.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        }
    
        // YYYY-MM-DD 형식에 맞추기 위해 마지막 길이가 10인 경우만 허용
        if (value.length <= 10) {
            setUser_birthdate(value);
        }
    };

    //  // 아이디 변경될 때마다 중복 체크
    //  const handleLoginIdChange = (event) => {
    //     const value = event.target.value;
    //     setLogin_id(value);
    //     if (value.trim()) {
    //         checkIdExist(value, "idCheck", 8080);
    //     } else {
    //         setIdError(""); // 아이디가 비어있으면 오류 메시지 제거
    //     }
    // };

    return (
        <PageWrapper>
            {loading ? <Loading /> : null}
            <SignupContainer>
                <Title>Create Account</Title>
                <InputContainer>
                    <InputLabel>Login ID</InputLabel>
                    <TextInput 
                        height={20}
                        value={login_id}
                        onChange={(e) => setLogin_id(e.target.value)}
                        placeholder="로그인 아이디 입력"
                    />
                    {idError && <ErrorMessage>{idError}</ErrorMessage>}
                    <Line />
    
                    <InputLabel>Password</InputLabel>
                    <PasswordWrapper>
                        <TextInput
                            height={20}
                            value={login_pw}
                            onChange={(event) => setLogin_pw(event.target.value)}
                            placeholder="비밀번호 입력"
                            type={seePassword ? "text" : "password"}
                        />
                        <EyeIcon onClick={seePasswordHandler}>
                            {seePassword ? <FaEye /> : <FaEyeSlash />}
                        </EyeIcon>
                    </PasswordWrapper>
                    <Line />

                    <InputLabel>Password Check</InputLabel>
                    <PasswordWrapper>
                        <TextInput
                            height={20}
                            value={passwordCheck}
                            onChange={handlePasswordCheckChange}
                            placeholder="비밀번호 확인"
                            type={seePassword ? "text" : "password"}
                        />
                        <EyeIcon onClick={seePasswordHandler}>
                            {seePassword ? <FaEye /> : <FaEyeSlash />}
                        </EyeIcon>
                    </PasswordWrapper>
                    {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                    <Line />
    
                    <InputLabel>Full Name</InputLabel>
                    <TextInput
                        height={20}
                        value={user_name}
                        onChange={(event) => setUser_name(event.target.value)}
                        placeholder="이름 입력"
                    />
                    <Line />

                    <InputLabel>Address</InputLabel>
                    <AddressWrapper>
                        <TextInput 
                            height={20}
                            value={user_addr}
                            readOnly
                            placeholder="주소 검색을 클릭하세요"
                            style={{ flex: 1 }}
                        />
                        <AddressButton onClick={() => setAddressModalOpen(true)}>주소 검색</AddressButton>
                    </AddressWrapper>
                    {addressModalOpen && (
                        <ModalWrapper onClick={() => setAddressModalOpen(false)}>
                            <ModalContent onClick={(e) => e.stopPropagation()}>
                                <DaumPostcode onComplete={handleComplete} autoClose={false} />
                            </ModalContent>
                        </ModalWrapper>
                    )}
                    <Line />
    
                    <InputLabel>Phone Number</InputLabel>
                    <TextInput 
                        height={20}
                        value={user_phone}
                        onChange={(event) => {
                            let value = event.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력
                            if (value.length > 3 && value.length <= 7) {
                                value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
                            } else if (value.length > 7) {
                                value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
                            }
                            setUser_phone(value);
                        }}
                        placeholder="휴대폰 번호 입력 (예: 010-1234-5678)"
                        maxLength={13}
                    />
                    <Line />
    
                    <InputLabel>Email</InputLabel>
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <TextInput value={emailUser} onChange={handleEmailUserChange} placeholder="이메일 아이디" style={{ flex: 2 }} />
                        <span style={{ margin: "0 8px", fontSize: "18px" }}>@</span>
                        {!isCustom ? (
                            <select onChange={handleDomainChange} style={{ flex: 2, height: "40px", fontSize: "16px", padding: "5px" }}>
                                <option value="">선택</option>
                                {domainOptions.map((domain) => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
                        ) : (
                            <TextInput value={customDomain} onChange={handleCustomDomainChange} placeholder="선택" style={{ flex: 2 }} />
                        )}
                    </div>

                    <Line />
    
                    <InputLabel>Birthdate</InputLabel>
                    <BirthdateWrapper>
                        <TextInput
                            height={20}
                            value={user_birthdate ? user_birthdate.toLocaleDateString() : ""}
                            readOnly
                            placeholder="생일을 선택하세요"
                            style={{ flex: 1 }}
                        />
                        <BirthdateButton onClick={() => setBirthdateModalOpen(true)}>달력 열기</BirthdateButton>
                    </BirthdateWrapper>
                    {birthdateModalOpen && (
                        <ModalWrapper onClick={() => setBirthdateModalOpen(false)}>
                            <ModalContent onClick={(e) => e.stopPropagation()}>
                                <DatePicker
                                    selected={user_birthdate}
                                    onChange={handleBirthdateChange} // 날짜 변경 시 호출
                                    dateFormat="yyyy-MM-dd" // 날짜 포맷 설정
                                    placeholderText="생년월일을 선택하세요"
                                    showYearDropdown
                                    yearDropdownItemNumber={90}
                                    scrollableYearDropdown
                                    maxDate={new Date()} // 오늘 이전 날짜만 선택 가능
                                    isClearable
                                />
                            </ModalContent>
                        </ModalWrapper>
                    )}
                    <Line />
                </InputContainer>
    
                <SignupButton title="회원가입" onClick={() => signupHandler("signIn", 8080)} />
                <LoginText onClick={() => navigate("/")}>
                    Already have an account? Login
                </LoginText>
            </SignupContainer>
        </PageWrapper>
    );
    
}

export default SignupPage;
