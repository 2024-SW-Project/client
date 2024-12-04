import React from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { findIdResponseState } from "../atoms/atom";

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

const Title = styled.h1`
    font-size: 1.2rem;
    font-weight: bold;
    color: #666271;
    margin: 3rem;
`;

const Username = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    color: #666271;
    margin-bottom: 3rem;
`;

const Button = styled.button`
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
`;

const FindIdResultPage = () => {
    const [findIdResponse, setFindIdResponse] = useRecoilState(findIdResponseState);

    return (
        <Container>
            <Title>회원님의 아이디를 확인해주세요</Title>
            <Username>{findIdResponse?.username || "아이디를 찾을 수 없습니다"}</Username>
            <Button
                onClick={() => {
                    window.location.href = "/auth/login";
                    setTimeout(() => setFindIdResponse(null), 100);
                }}
            >
                로그인
            </Button>
        </Container>
    );


};

export default FindIdResultPage;
