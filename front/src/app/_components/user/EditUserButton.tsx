import { PencilLineIcon } from "lucide-react";
import React from "react";

const EditUserButton = () => {
  const handleGoToEditUser = () => {
    console.log("사용자 정보 수정하는 이벤트가 발생하는 함수 위치입니다.");
  };
  return <PencilLineIcon onClick={() => handleGoToEditUser()} size={16} />;
};

export default EditUserButton;
