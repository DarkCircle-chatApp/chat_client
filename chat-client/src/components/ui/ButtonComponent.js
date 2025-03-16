import React from "react";

import styled from "styled-components";

// 버튼 컴포넌트 생성
const StyledButton = styled.button`
    padding: 8px 20px;
    font-size: 16px;
    border-width: 1px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Button 컴포넌트 정의
function Button(props) {
  const { title, onClick } = props; // props에서 title과 onClick 구조 분해 할당

  // StyledButton 렌더링, 클릭 이벤트 및 버튼 텍스트 설정
  return <StyledButton onClick={onClick}>{title || "button"}</StyledButton>;
}

export default Button;
