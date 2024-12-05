import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRecoilState } from "recoil";
import { resetPwResponseState } from '../atoms/atom'
import { useNavigate } from "react-router-dom";

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

const ResetPasswordPage = () => {
    const [form, setForm] = useState({ username: "", email: "" });
    const [warnings, setWarnings] = useState({ username: "", email: "" });
    const [resetPwResponse, setResetPwResponse] = useRecoilState(resetPwResponseState);
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        let newWarnings = { username: "", email: "" };

        if (!form.username.trim()) {
            newWarnings.username = "아이디를 입력해주세요.";
            isValid = false;
        }

        if (!form.email.trim()) {
            newWarnings.email = "이메일을 입력해주세요.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newWarnings.email = "올바른 이메일 형식을 입력해주세요.";
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
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/auth/reset-password`,
                {
                    username: form.username,
                    email: form.email,
                }
            );
            setResetPwResponse(response.data);
            navigate("/auth/reset-password/result");
        } catch (error) {
            setWarnings((prev) => ({
                ...prev,
                general: "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.",
            }));
        }
    };

    return (
        <Container>
            <FormWrapper>
                <InputContainer>
                    <Label>아이디</Label>
                    <Input
                        type="text"
                        placeholder="입력해주세요"
                        value={form.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                    />
                    {warnings.username && <WarningText>{warnings.username}</WarningText>}
                </InputContainer>
                <InputContainer>
                    <Label>이메일</Label>
                    <Input
                        type="email"
                        placeholder="입력해주세요"
                        value={form.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    {warnings.email && <WarningText>{warnings.email}</WarningText>}
                </InputContainer>
                <Button onClick={handleSubmit}>비밀번호 재설정</Button>
                {warnings.general && <WarningText>{warnings.general}</WarningText>}
            </FormWrapper>
        </Container>
    );
};

export default ResetPasswordPage;
