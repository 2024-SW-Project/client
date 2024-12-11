import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
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
    min-width: 320px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

const InputContainer = styled.div`
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
        color: #c0c0c0; /* placeholder 색상 */
    }
`;

const WarningText = styled.div`
    color: red;
    font-size: 0.8rem;
    margin-top: 0.5rem;
`;

const SuccessText = styled.div`
    color: green;
    font-size: 0.8rem;
    margin-top: 0.5rem;

`;

const CheckButton = styled.button`
    margin-top: 0.5rem;
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    color: #333;
    border: none;
    border-radius: 5px;
    background-color: #f1f1f1;
    cursor: pointer;

    &:hover {
        background-color: #e1e1e1;
    }

    &:focus {
        background-color: #f1f1f1;
    }
`;

const ClimateCardContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const OptionButton = styled.button`
    flex: 1;
    padding: 0.8rem;
    margin: 0 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: ${({ selected }) => (selected ? "#fff" : "#4d7eff")};
    background-color: ${({ selected }) => (selected ? "#4d7eff" : "#fff")};
    border: 2px solid #4d7eff;
    border-radius: 25px;
    cursor: pointer;

    &:hover {
        color: #fff;
        background-color: #3c5fbf;
    }

    &:focus {
        background-color: #4d7eff;
    }
`;

const SubmitButton = styled.button`
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

const SignupPage = () => {
    const [form, setForm] = useState({
        id: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        nickname: "",
    });

    const [warnings, setWarnings] = useState({
        id: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        nickname: "",
        climateCard: "",
        apiError: "", // API 오류 메시지
    });

    const [checkStatus, setCheckStatus] = useState({
        id: "", // "success" | "error"
        nickname: "", // "success" | "error"
        email: "", // "success" | "error"
    });

    const [climateCard, setClimateCard] = useState(null);
    const navigate = useNavigate();

    const validateForm = (field, value) => {
        let warningMessage = "";

        switch (field) {
            case "id":
                if (!/^[A-Za-z0-9_]{5,20}$/.test(value)) {
                    warningMessage = "5~20자의 영문대소문자, 숫자, 특수문자'_' 만 사용해주세요.";
                }
                break;
            case "email":
                if (!value) {
                    warningMessage = "이메일 주소를 입력해주세요.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    warningMessage = "올바른 이메일 주소를 정확히 입력해주세요.";
                }
                break;
            case "password":
                if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/.test(value)) {
                    warningMessage = "8~16자리 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합으로 만들어주세요.";
                }
                break;
            case "confirmPassword":
                if (value !== form.password) {
                    warningMessage = "비밀번호와 같지 않습니다.";
                }
                break;
            case "name":
                if (!/^[가-힣a-zA-Z]+$/.test(value)) {
                    warningMessage = "이름을 입력해주세요.";
                }
                break;
            case "nickname":
                if (!/^[가-힣a-zA-Z0-9_]+$/.test(value)) {
                    warningMessage = "한글 또는 영문, 숫자, 특수문자'_' 만 사용 가능합니다.";
                }
                break;
            case "climateCard":
                if (!climateCard) {
                    warningMessage = "기후동행카드 소지 여부를 선택해주세요.";
                }
                break;
            default:
                break;
        }

        setWarnings((prevWarnings) => ({
            ...prevWarnings,
            [field]: warningMessage,
        }));
    };

    const isFormValid = () => {
        return (
            !Object.entries(warnings)
                .filter(([key]) => key !== "apiError") // `apiError` 무시
                .some(([, warning]) => warning) && // 다른 경고 메시지가 없어야 함
            Object.values(form).every((value) => value) && // 모든 필드가 입력되었는지 확인
            climateCard !== null && // 기후동행카드 여부 선택
            checkStatus.id === "success" && // 아이디 중복체크 성공
            checkStatus.nickname === "success" && // 닉네임 중복체크 성공
            checkStatus.email === "success" // 이메일 중복체크 성공
        );
    };

    const handleBlur = (field) => {
        validateForm(field, form[field]);
    };

    const handleChange = (field, value) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: value,
        }));
    };

    const handleClimateCardSelection = (value) => {
        setClimateCard(value);
        setWarnings((prevWarnings) => ({
            ...prevWarnings,
            climateCard: "",
        }));
    };

    const handleIdCheck = async () => {
        if (!form.id) {
            // 입력값이 없을 경우 경고 메시지 설정
            setWarnings((prevWarnings) => ({
                ...prevWarnings,
                id: "아이디를 입력해주세요.",
            }));
            setCheckStatus((prevStatus) => ({ ...prevStatus, id: "" })); // 상태 초기화
            return; // 요청 보내지 않음
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/auth/signup/check-username`,
                { params: { username: form.id } }
            );
            if (response.data.isAvailable) {
                setCheckStatus((prevStatus) => ({ ...prevStatus, id: "success" }));
                setWarnings((prevWarnings) => ({
                    ...prevWarnings,
                    id: "", // 성공 시 경고 메시지 제거
                }));
            }
        } catch (error) {
            setCheckStatus((prevStatus) => ({ ...prevStatus, id: "error" }));
            setWarnings((prevWarnings) => ({
                ...prevWarnings,
                id: "", // 경고 메시지를 상태에서 제거
            }));
        }
    };

    const handleNicknameCheck = async () => {
        if (!form.nickname) {
            // 입력값이 없을 경우 경고 메시지 설정
            setWarnings((prevWarnings) => ({
                ...prevWarnings,
                nickname: "닉네임을 입력해주세요.",
            }));
            setCheckStatus((prevStatus) => ({ ...prevStatus, nickname: "" })); // 상태 초기화
            return; // 요청 보내지 않음
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/auth/signup/check-nickname`,
                { params: { nickname: form.nickname } }
            );
            if (response.data.isAvailable) {
                setCheckStatus((prevStatus) => ({ ...prevStatus, nickname: "success" }));
                setWarnings((prevWarnings) => ({
                    ...prevWarnings,
                    nickname: "", // 성공 시 경고 메시지 제거
                }));
            }
        } catch (error) {
            setCheckStatus((prevStatus) => ({ ...prevStatus, nickname: "error" }));
            setWarnings((prevWarnings) => ({
                ...prevWarnings,
                nickname: "", // 경고 메시지를 상태에서 제거
            }));
        }
    };

    const handleCheckEmail = async () => {
        if (!form.email) {
            setWarnings((prevWarnings) => ({
                ...prevWarnings,
                email: "이메일을 입력해주세요.",
            }));
            setCheckStatus((prevStatus) => ({ ...prevStatus, email: "" }));
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/auth/signup/check-email`,
                { params: { email: form.email } }
            );

            if (response.data.isAvailable) {
                setCheckStatus((prevStatus) => ({ ...prevStatus, email: "success" }));
                setWarnings((prevWarnings) => ({ ...prevWarnings, email: "" }));
            }
        } catch (error) {
            setCheckStatus((prevStatus) => ({ ...prevStatus, email: "error" }));
            setWarnings((prevWarnings) => ({
                ...prevWarnings, email: "" 
            }));
        }
    };

    const handleSubmit = async () => {
        if (!isFormValid()) return;

        try {
            const postData = {
                username: form.id,
                email: form.email,
                password: form.confirmPassword,
                name: form.name,
                nickname: form.nickname,
                isClimateCardEligible: climateCard,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
                postData
            );

            alert("회원가입 성공!");
            navigate("/subway/search");
        } catch (error) {
            setWarnings((prevWarnings) => ({
                ...prevWarnings,
                apiError: error.response?.data?.error_message || "회원가입 실패. 다시 시도해주세요.",
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
                        value={form.id}
                        onChange={(e) => handleChange("id", e.target.value)}
                        onBlur={() => handleBlur("id")}
                    />
                    {warnings.id && <WarningText>{warnings.id}</WarningText>}
                    <CheckButton onClick={handleIdCheck}>중복체크</CheckButton>
                    {checkStatus.id === "success" && <SuccessText>사용 가능한 아이디입니다.</SuccessText>}
                    {checkStatus.id === "error" && <WarningText>사용 불가능한 아이디입니다.</WarningText>}
                </InputContainer>
                <InputContainer>
                    <Label>이메일</Label>
                    <Input
                        type="email"
                        placeholder="입력해주세요"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                    />
                    {warnings.email && <WarningText>{warnings.email}</WarningText>}
                    <CheckButton onClick={handleCheckEmail}>중복체크</CheckButton>
                    {checkStatus.email === "success" && (
                        <SuccessText>사용 가능한 이메일입니다.</SuccessText>
                    )}
                    {checkStatus.email === "error" && (
                        <WarningText>사용 불가능한 이메일입니다.</WarningText>
                    )}
                </InputContainer>
                <InputContainer>
                    <Label>비밀번호</Label>
                    <Input
                        type="password"
                        placeholder="입력해주세요"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                    />
                    {warnings.password && <WarningText>{warnings.password}</WarningText>}
                </InputContainer>
                <InputContainer>
                    <Label>비밀번호 재입력</Label>
                    <Input
                        type="password"
                        placeholder="입력해주세요"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                    />
                    {warnings.confirmPassword && <WarningText>{warnings.confirmPassword}</WarningText>}
                </InputContainer>
                <InputContainer>
                    <Label>이름</Label>
                    <Input
                        type="text"
                        placeholder="입력해주세요"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                    />
                    {warnings.name && <WarningText>{warnings.name}</WarningText>}
                </InputContainer>
                <InputContainer>
                    <Label>닉네임</Label>
                    <Input
                        type="text"
                        placeholder="입력해주세요"
                        value={form.nickname}
                        onChange={(e) => handleChange("nickname", e.target.value)}
                        onBlur={() => handleBlur("nickname")}
                    />
                    {warnings.nickname && <WarningText>{warnings.nickname}</WarningText>}
                    <CheckButton onClick={handleNicknameCheck}>중복체크</CheckButton>
                    {checkStatus.nickname === "success" && (
                        <SuccessText>사용 가능한 닉네임입니다.</SuccessText>
                    )}
                    {checkStatus.nickname === "error" && (
                        <WarningText>사용 불가능한 닉네임입니다.</WarningText>
                    )}
                </InputContainer>
                <ClimateCardContainer>
                    <Label>기후동행카드 소지 여부</Label>
                    <OptionButton
                        selected={climateCard === true}
                        onClick={() => handleClimateCardSelection(true)}
                    >
                        O
                    </OptionButton>
                    <OptionButton
                        selected={climateCard === false}
                        onClick={() => handleClimateCardSelection(false)}
                    >
                        X
                    </OptionButton>
                </ClimateCardContainer>
                {warnings.climateCard && <WarningText>{warnings.climateCard}</WarningText>}
                <SubmitButton onClick={handleSubmit} disabled={!isFormValid()}>
                    회원가입
                </SubmitButton>
                {warnings.apiError && <WarningText>{warnings.apiError}</WarningText>}
            </FormWrapper>
        </Container>
    );
};

export default SignupPage;