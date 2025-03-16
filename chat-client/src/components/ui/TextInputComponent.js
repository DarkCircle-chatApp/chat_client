import React from "react";

import styled from "styled-components";

// password input박스
const StyledInput = styled.input`
    border: none;
    width: calc(90% - 32px);
    padding: 16px;
    font-size: 20px;
    line-height: 15px;

    ${(props) => props.height &&
      `
      height: ${props.height}px;
      `}
`;

// textarea
const StyledTextarea = styled.textarea`
    border: none;
    resize: none;  // 크기 조정 방지 
    width: calc(90% - 32px);

    // height prop이 존재하는 경우 해당 값 적용
    ${(props) => props.height &&
      `
      height: ${props.height}px;
      `}
      
    padding: 16px;
    font-size: 20px;
    line-height: 15px;
`;

// TextInput 컴포넌트
function TextInput({ height, value, onChange, onKeyDown, type }) {
  return type === "password" ? (
      <StyledInput
          type="password"
          height={height}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
      />
  ) : (
      <StyledTextarea
          height={height}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
      />
  );
}

export default TextInput;
