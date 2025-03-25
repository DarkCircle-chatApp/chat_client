import React from "react";

const Test = () => {
  const handleClick = async (endpoint, port) => {
    const response = await fetch(`http://localhost:${port}/${endpoint}`);
    const text = await response.text();
    alert(text);
  };

  return (
    <div>
      <button onClick={() => handleClick("login", 5001)}>Test1 (Login)</button>
      <button onClick={() => handleClick("signIn", 5001)}>Test2 (SignIn)</button>
      <button onClick={() => handleClick("chat", 5003)}>Test3 (Chat)</button>
      <button onClick={() => handleClick("chat/admin", 5004)}>Test4 (Chat Admin)</button>
    </div>
  );
};

export default Test;
