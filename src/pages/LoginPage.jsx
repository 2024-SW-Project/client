import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { climateCardState, userInfoState } from "../atoms/atom";
import { apiCall } from "../utils/Api";
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
    const [userInfo, setUserInfo] = useRecoilState(userInfoState);

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

        try {
            const postData = {
                username: id,
                password: password,
            };

            const response = await apiCall(
                "post",
                `${import.meta.env.VITE_SERVER_URL}/auth/login`,
                postData
            );

            if (response.status === 200) {
                const authorizationHeader = response.headers.authorization;
                if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
                    const accessToken = authorizationHeader.split(" ")[1];
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", response.headers["refresh-token"]);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                    setUserInfo({
                        isLogIn: true,
                        nickname: response.data.nickname,
                        profile_picture: response.data.profile_picture,
                        user_id: response.data.user_id,
                    });
                    alert("로그인 성공!");
                    navigate("/subway/search");
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // API 응답의 오류 메시지 사용
                setWarning(error.response.data.error_message || "아이디 또는 비밀번호가 올바르지 않습니다.");
            } else {
                setWarning("로그인에 실패했습니다. 다시 시도해주세요.");
            }
            console.error("로그인 에러:", error);
        }
    };

    return (
        <Container>
            <FormWrapper>
                <InputContainer>
                    <Input
                        type="id"
                        placeholder="아이디를 입력해주세요"
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
                <SubmitButton onClick={() => handleLogin(setUserInfo)}>로그인</SubmitButton>
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
