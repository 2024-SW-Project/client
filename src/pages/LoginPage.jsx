import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { climateCardState } from "../atoms/atom";
import axios from "axios";

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
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
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

const SubmitButton = styled.button`
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    background-color: #4d7eff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #3c5fbf;
    }

    &:focus {
        background-color: #4d7eff;
    }
`;

const LinkContainer = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
`;

const LinkText = styled.a`
    font-size: 0.9rem;
    color: #c0c0c0;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const WarningText = styled.div`
    color: red;
    font-size: 0.9rem;
    margin-bottom: 1rem;
`;

const LoginPage = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState("");
    const setClimateCard = useSetRecoilState(climateCardState);
    const navigate = useNavigate();


    const handleLogin = async () => {
        if (!id && !password) {
            setWarning("아이디와 비밀번호를 입력해주세요.");
            return;
        } else if (!id) {
            setWarning("아이디를 입력해주세요.");
            return;
        } else if (!password) {
            setWarning("비밀번호를 입력해주세요.");
            return;
        }

        setWarning(""); // 조건이 충족되면 경고 메시지 제거

        const postData = {
            username: id,
            password: password,
        };

        try {
            // 비동기 요청 (API 호출)
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/auth/login`,
                postData
            );

            // 서버에서 응답 받은 데이터 구조 분해
            const { token_type, access_token, refresh_token, user_info } = response.data;

            // 로컬 스토리지에 토큰 저장
            localStorage.setItem("token_type", token_type);
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            // user_info를 JSON 문자열로 저장
            localStorage.setItem("user_info", JSON.stringify(user_info));

            // Recoil state에 is_climate_card_eligible 저장
            setClimateCard(user_info.is_climate_card_eligible);

            // 성공 시 리다이렉트
            alert("로그인 성공!");
            navigate("/subway/search");
        } catch (error) {
            // 에러 처리
            setWarning("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
            console.error("로그인 에러:", error);
        }
    };


    return (
        <Container>
            <FormWrapper>
                <InputContainer>
                    <Input
                        type="id"
                        placeholder="이메일을 입력해주세요"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </InputContainer>
                <InputContainer>
                    <Input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputContainer>
                {warning && <WarningText>{warning}</WarningText>}
                <SubmitButton onClick={handleLogin}>로그인</SubmitButton>
                <LinkContainer>
                    <LinkText href="/auth/signup">회원가입</LinkText>
                    <span style={{ color: "#efefef" }}>|</span>
                    <LinkText href="/auth/find-id">아이디 찾기</LinkText>
                    <span style={{ color: "#efefef" }}>|</span>
                    <LinkText href="/auth/reset-password">비밀번호 찾기</LinkText>
                </LinkContainer>
            </FormWrapper>
        </Container>
    );
};

export default LoginPage;
