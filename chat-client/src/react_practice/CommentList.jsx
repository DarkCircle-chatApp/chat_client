import React from "react";
import Comment from "./Comment";

function CommentList(props) {
  return (
    <div>
        <Comment name={"성명건"} comment={"자 수업시작합니다."} />
        <Comment name={"성명건"} comment={"다들 fetch origin부터 하세요."} />
    </div>
  );
}

export default CommentList;