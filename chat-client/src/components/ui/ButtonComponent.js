import React from "react";

import styled from "styled-components";

// 버튼 컴포넌트 생성
const StyledButton = styled.button`
    padding: 8px 16px; // 버튼의 내부 여백 설정
    font-size: 16px; // 글자 크기 설정
    border-width: 1px; // 테두리 두께 설정
    border-radius: 8px; // 버튼의 모서리를 둥글게 설정
    cursor: pointer; // 마우스를 올렸을 때 포인터 커서 표시
`;

// Button 컴포넌트 정의
function Button(props) {
  const { title, onClick } = props; // props에서 title과 onClick 구조 분해 할당

  // StyledButton을 렌더링, 클릭 이벤트와 버튼 텍스트 설정
  return <StyledButton onClick={onClick}>{title || "button"}</StyledButton>;
}

export default Button;
