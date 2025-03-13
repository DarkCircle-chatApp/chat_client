import React from "react";

import styled from "styled-components";

// textarea
const StyledTextarea = styled.textarea`
    width: calc(100% - 32px);

    // height prop이 존재하는 경우 해당 값 적용
    ${(props) => props.height &&
      `
      height: ${props.height}px;
      `}
      
    padding: 16px;
    font-size: 16px;
    line-height: 20px;
`;

// TextInput 컴포넌트 정의
function TextInput(props) {
    const { height, value, onChange } = props; // props에서 height, value, onChange 구조 분해 할당

    // StyledTextarea 렌더링. height, value, onChange 속성 전달
    return <StyledTextarea height={height} value={value} onChange={onChange} />;
}

export default TextInput;
