import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaLocationArrow, FaFlag } from "react-icons/fa6";
import axios from "axios";

const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #C0C0C0;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    width: 100%;
    box-sizing: border-box;
`;

const StartIcon = styled(FaLocationArrow)`
    color: #4A6CF7;
    margin-right: 0.5rem;
`;

const ArrivedIcon = styled(FaFlag)`
    color: #4A6CF7;
    margin-right: 0.5rem;
`;

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

const Dropdown = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    overflow-y: auto;
    z-index: 100;
    list-style: none;
    padding: 0;
    margin: 0;
`;

const DropdownItem = styled.li`
    padding: 0.5rem;
    cursor: pointer;

    &:hover {
        background-color: #f1f1f1;
    }
`;

const InputStation = ({ placeholder, value, onChange }) => {
    const [suggestions, setSuggestions] = useState([]);
    const containerRef = useRef(null);
    const isSelecting = useRef(false); // 드롭다운 선택 상태 확인

    const handleInputChange = async (e) => {
        const inputValue = e.target.value;
        onChange(inputValue, false); // 값을 변경하지만 확정되지 않은 상태

        if (inputValue.trim() === "") {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/subway/search/autocomplete`,
                { params: { query: inputValue } }
            );

            if (response.status === 200 && response.data.data.stations) {
                setSuggestions(response.data.data.stations);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("자동완성 API 요청 에러:", error);
            setSuggestions([]);
        }
    };

    const handleSelect = (stationName) => {
        isSelecting.current = true; // 드롭다운 선택 상태 활성화
        onChange(stationName, true); // 값을 확정
        setSuggestions([]);
    };

    const handleBlur = () => {
        if (isSelecting.current) {
            isSelecting.current = false; // 드롭다운 선택 상태 초기화
            return;
        }

        if (!suggestions.includes(value)) {
            onChange("", false); // 잘못된 값 초기화
        }
        setSuggestions([]);
    };

    return (
        <Container ref={containerRef}>
            {placeholder === "출발역" ? <StartIcon /> : <ArrivedIcon />}
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
            />
            {suggestions.length > 0 && (
                <Dropdown>
                    {suggestions.map((station, index) => (
                        <DropdownItem
                            key={index}
                            onMouseDown={() => handleSelect(station)} // 드롭다운 선택 시 실행
                        >
                            {station}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}
        </Container>
    );
};

export default InputStation;
