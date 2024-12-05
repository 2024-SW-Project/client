import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiCall, logoutUser } from '../utils/Api';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../atoms/atom';

const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    padding-top: 50px;
    min-width: 320px;
    background-color: #ffffff;
    box-sizing: border-box;
`;

const FormWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const InputContainer = styled.div`
    width: 100%;
    margin-bottom: 1.5rem;
`;

const Label = styled.label`
    font-size: 0.9rem;
    color: #666271;
    display: block;
    margin-bottom: 0.5rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    outline: none;
    font-size: 1rem;

    &:focus {
        border-bottom: 2px solid #4d7eff;
    }

    &::placeholder {
        color: #c0c0c0;
    }
`;

const WarningText = styled.div`
    color: red;
    font-size: 0.8rem;
    margin-top: 0.5rem;
`;

const Button = styled.button`
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#4d7eff")};
    border: none;
    border-radius: 5px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

    &:hover {
        background-color: ${({ disabled }) => (disabled ? "#ccc" : "#3c5fbf")};
    }
`;

const ChangePasswordPage = () => {
    const [form, setForm] = useState({ current_password: "", new_password: "" });
    const [warnings, setWarnings] = useState({ current_password: "", new_password: "" });
    const [userInfo, setUserInfo] = useRecoilState(userInfoState);
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        let newWarnings = { current_password: "", new_password: "" };


        if (!form.current_password.trim()) {
            newWarnings.current_password = "현재 비밀번호를 입력해주세요.";
            isValid = false;
        }

        if (!form.new_password.trim()) {
            newWarnings.new_password = "새 비밀번호를 입력해주세요.";
            isValid = false;
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/.test(form.new_password)) {
            newWarnings.new_password = "8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요.";
            isValid = false;
        } else if (form.current_password === form.new_password) {
            newWarnings.new_password = "이전 비밀번호와 다른 새 비밀번호를 입력해주세요.";
            isValid = false;
        }

        setWarnings(newWarnings);
        return isValid;
    };

    const handleInputChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setWarnings((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // API 요청
            const response = await apiCall(
                "put",
                `${import.meta.env.VITE_SERVER_URL}/mypage/change-password`,
                {
                    current_password: form.current_password,
                    new_password: form.new_password,
                },
                setUserInfo
            );

            // API 응답 확인
            console.log("비밀번호 변경 응답:", response.data);

            if (response?.data?.message === "Password changed successfully") {
                alert("비밀번호가 변경되었습니다!");

                // 로그아웃 로직
                await logoutUser(setUserInfo, null, navigate); // 로그아웃 함수 호출

                navigate("/auth/login");
            } else {
                setWarnings((prev) => ({
                    ...prev,
                    general: "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.",
                }));
            }
        } catch (error) {
            console.error("비밀번호 변경 중 오류:", error);
            setWarnings((prev) => ({
                ...prev,
                general: "비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.",
            }));
        }
    };


    return (
        <Container>
            <FormWrapper>
                <InputContainer>
                    <Label>현재 비밀번호</Label>
                    <Input
                        type="password"
                        placeholder="입력해주세요"
                        value={form.current_password}
                        onChange={(e) => handleInputChange("current_password", e.target.value)}
                    />
                    {warnings.current_password && <WarningText>{warnings.current_password}</WarningText>}
                </InputContainer>
                <InputContainer>
                    <Label>새 비밀번호</Label>
                    <Input
                        type="password"
                        placeholder="입력해주세요"
                        value={form.new_password}
                        onChange={(e) => handleInputChange("new_password", e.target.value)}
                    />
                    {warnings.new_password && <WarningText>{warnings.new_password}</WarningText>}
                </InputContainer>
                <Button onClick={handleSubmit}>비밀번호 변경</Button>
                {warnings.general && <WarningText>{warnings.general}</WarningText>}
            </FormWrapper>
        </Container>
    );
};

export default ChangePasswordPage;