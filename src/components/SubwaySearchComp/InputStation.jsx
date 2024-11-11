import React from 'react';
import styled from "styled-components";
import { FaLocationArrow } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa6";

const Container = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #C0C0C0;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    width: 100%;
    box-sizing: border-box;
`;

// 인풋창 내부의 아이콘(출발아이콘)
const StartIcon = styled(FaLocationArrow)`
    color: #4A6CF7;
    margin-right: 0.5rem;
`;

// 인풋창 내부의 아이콘(도착아이콘)
const ArrivedIcon = styled(FaFlag)`
    color: #4A6CF7;
    margin-right: 0.5rem;
`;

// 인풋창
const Input = styled.input`
    border: none;
    outline: none;
    font-size: 14px;
    color: #666271;
    width: 100%;
    
    &::placeholder {
        color: #C0C0C0;
    }
`;

const InputStation = ({ placeholder, value, onChange }) => {
    return (
        <Container>
            {/* placeholder에 따른 아이콘 설정 */}
            {placeholder === '출발역' ? <StartIcon /> : <ArrivedIcon />}
            {/* 인풋창 */}
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </Container>
    );
};

export default InputStation;
