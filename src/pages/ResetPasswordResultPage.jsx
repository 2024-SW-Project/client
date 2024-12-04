import React from "react";
import styled from "styled-components";

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

const Title = styled.div`
    font-size: 1rem;
    font-weight: bold;
    color: #666271;
    margin: 3rem;
`;

const Text = styled.div`
    font-size: 1rem;
    font-weight: bold;
    color: red;
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

const ResetPasswordResultPage = () => {
    return (
        <Container>
            <Title>임시비밀번호가 이메일로 발급되었습니다</Title>
            <Text>안전을 위해 비밀번호를 변경해주세요</Text>
            <Button
                onClick={() => { window.location.href = "/auth/login" }}
            >
                로그인
            </Button>
        </Container>
    );


};

export default ResetPasswordResultPage;
