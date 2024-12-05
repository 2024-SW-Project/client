import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Map from '../components/SubwaySearchComp/Map';
import InputStation from '../components/SubwaySearchComp/InputStation';
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { SwitchToggle } from '../components/SubwaySearchComp/SwitchToggle';
import { startStationState, endStationState, climateCardState, routeResponseState, userInfoState } from '../atoms/atom'
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
    const [isStartStationConfirmed, setIsStartStationConfirmed] = useState(false);
    const [isEndStationConfirmed, setIsEndStationConfirmed] = useState(false);
    const [hasClimateCard, setHasClimateCard] = useRecoilState(climateCardState);
    const setRouteResponse = useSetRecoilState(routeResponseState);
    const [userInfo, setUserInfo] = useRecoilState(userInfoState);

    const postRequest = async () => {
        const postData = {
            start_station_name: startStation,
            end_station_name: endStation,
            is_climate_card_eligible: hasClimateCard,
        };

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/subway/detail/search`, postData);
            const processedData = res.data.data || {};
            setRouteResponse(processedData);
            window.location.href = '/subway/route';
        } catch (error) {
            console.error("Error during POST request:", error);
        }
    };

    useEffect(() => {
        if (isStartStationConfirmed && isEndStationConfirmed) {
            postRequest();
        }
    }, [isStartStationConfirmed, isEndStationConfirmed]); // 상태 변화 감지 후 요청

    useEffect(() => {
        setStartStation("");
        setEndStation("");
        setHasClimateCard(userInfo.isLogIn);
    }, []);

    const handleStartChange = (newValue, isConfirmed) => {
        setStartStation(newValue);
        setIsStartStationConfirmed(isConfirmed); // 값을 확정했는지 상태 업데이트
    };

    const handleEndChange = (newValue, isConfirmed) => {
        setEndStation(newValue);
        setIsEndStationConfirmed(isConfirmed); // 값을 확정했는지 상태 업데이트
    };

    return (
        <Container>
            <InputContainer>
                <InputStation
                    placeholder="출발역"
                    value={startStation}
                    onChange={handleStartChange}
                    onConfirm={() => setIsStartStationConfirmed(true)} // 확정 시 상태 업데이트
                />
                <DividerIcon />
                <InputStation
                    placeholder="도착역"
                    value={endStation}
                    onChange={handleEndChange}
                    onConfirm={() => setIsEndStationConfirmed(true)} // 확정 시 상태 업데이트
                />
            </InputContainer>
            <MapContainer>
                <ToggleWrapperContainer>
                    <SwitchToggle />
                </ToggleWrapperContainer>
                <Map style={{ width: "100%", height: "100%" }} />
            </MapContainer>
        </Container>
    );
};

export default SubwaySearchPage;
