import React, { useEffect } from 'react';
import styled from 'styled-components';
import Map from '../components/SubwaySearchComp/Map';
import InputStation from '../components/SubwaySearchComp/InputStation';
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { SwitchToggle } from '../components/SubwaySearchComp/SwitchToggle';
import { startStationState, endStationState, climateCardState, routeResponseState } from '../atoms/atom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';

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
    position: relative;
`;

// Toggle Switch를 상단 좌측에 위치시키는 컨테이너
const ToggleWrapperContainer = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
`;

const SubwaySearchPage = () => {
    const [startStation, setStartStation] = useRecoilState(startStationState);
    const [endStation, setEndStation] = useRecoilState(endStationState);
    const hasClimateCard = useRecoilValue(climateCardState);
    const setRouteResponse = useSetRecoilState(routeResponseState);

    // POST 요청 함수
    const postRequest = async () => {
        const postData = {
            start_station_name: startStation,
            end_station_name: endStation,
            is_climate_card_eligible: hasClimateCard,
        };

        try {
            const res = await axios.get('http://localhost:4000/subwayRoute', postData);
            //const response = await axios.post('http://localhost:4000/subwayRoute', data);
            console.log('postData:', postData)
            console.log('Response:', res.data[0].data);
            setRouteResponse(res.data[0].data);
            window.location.href = '/subway/route'
        } catch (error) {
            console.error('Error during POST request:', error);
        }
    };

    //page 첫 진입때만 역state 초기화
    
    // 조건에 따라 POST 요청 보내기
    useEffect(() => {
        if (startStation !== "" && endStation !== "") {
            postRequest();
        }
    }, [startStation, endStation]);

    // 출발역 입력 값 변경
    const handleStartChange = (newValue) => {
        console.log("Start station:", newValue);
        setStartStation(newValue);
    };

    // 도착역 입력 값 변경
    const handleEndChange = (newValue) => {
        console.log("End station:", newValue);
        setEndStation(newValue);
    };

    return (
        <Container>
            {/* 출발역과 도착역 입력 필드 */}
            <InputContainer>
                <InputStation placeholder="출발역" value={startStation} onChange={handleStartChange} />
                <DividerIcon />
                <InputStation placeholder="도착역" value={endStation} onChange={handleEndChange} />
            </InputContainer>
            {/* 지도 컴포넌트 */}
            <MapContainer>
                {/* Toggle Switch를 Map의 상단 좌측에 배치 */}
                <ToggleWrapperContainer>
                    <SwitchToggle />
                </ToggleWrapperContainer>
                <Map style={{ width: '100%', height: '100%' }} />
            </MapContainer>
        </Container>
    );
};

export default SubwaySearchPage;
