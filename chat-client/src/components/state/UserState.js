import { atom } from "recoil";

export const userState = atom({
    key: "userState", // 키
    default: {
        token: localStorage.getItem("token"), // localStorage에서 토큰 가져오기
        login_id: null,  // 사용자 ID (로그인 시 설정)
        user_status: null, // 사용자 상태 (로그인 시 설정)
    },
});
