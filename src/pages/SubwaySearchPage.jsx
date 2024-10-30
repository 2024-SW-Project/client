import React, { useState } from 'react';
import styled from 'styled-components';
import Map from '../components/SubwaySearchComp/Map';
import InputStation from '../components/SubwaySearchComp/InputStation';
import { FaArrowRightArrowLeft } from "react-icons/fa6";

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

// 출발역과 도착역 인풋 필드를 담는 컨테이너
const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
`;

// 출발역과 도착역 사이의 아이콘
const DividerIcon = styled(FaArrowRightArrowLeft)`
    font-size: 20px;
    color: #666271;
    margin: 0.5rem 0;
`;

// 지도(Map) 컴포넌트를 담는 컨테이너
const MapContainer = styled.div`
    flex-grow: 1;
    width: 100%;
    max-height: calc(100vh - 150px);
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
`;

const SubwaySearchPage = () => {
    const [stValue, setStValue] = useState('');
    const [endValue, setEndValue] = useState('');

    // 출발역 입력 값 변경
    const handleStartChange = (newValue) => {
        console.log("Start station:", newValue);
        setStValue(newValue);
    };

    // 도착역 입력 값 변경
    const handleEndChange = (newValue) => {
        console.log("End station:", newValue);
        setEndValue(newValue);
    };

    return (
        <Container>
            {/* 출발역과 도착역 입력 필드 */}
            <InputContainer>
                <InputStation placeholder="출발역" value={stValue} onChange={handleStartChange} />
                <DividerIcon />
                <InputStation placeholder="도착역" value={endValue} onChange={handleEndChange} />
            </InputContainer>
            {/* 지도 컴포넌트 */}
            <MapContainer>
                <Map style={{ width: '100%', height: '100%' }} />
            </MapContainer>
        </Container>
    );
};

export default SubwaySearchPage;
