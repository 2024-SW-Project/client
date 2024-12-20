import React from 'react'
import styled from "styled-components";
import loadingGIF from '../assets/loadingGIF.gif'

const Background = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: #ffffffb7;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LoadingText = styled.div`
    font: 1rem 'Noto Sans KR';
    text-align: center;
`;

const Loading = () => {
    return (
        <Background>
            <img src={loadingGIF} alt="로딩중" width="65rem" />
            <LoadingText>잠시만 기다려 주세요</LoadingText>
        </Background>
    )
}

export default Loading