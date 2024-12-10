import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Map from "../components/SubwaySearchComp/Map";
import InputStation from "../components/SubwaySearchComp/InputStation";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { SwitchToggle } from "../components/SubwaySearchComp/SwitchToggle";
import { startStationState, endStationState, climateCardState, routeResponseState, userInfoState } from "../atoms/atom";
import { useRecoilState, useSetRecoilState } from "recoil";
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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const DividerIcon = styled(FaArrowRightArrowLeft)`
  font-size: 20px;
  color: #666271;
  margin: 0.5rem 0;
`;

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

const ToggleWrapperContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
`;

const SubwaySearchPage = () => {
    const [startStation, setStartStation] = useRecoilState(startStationState);
    const [endStation, setEndStation] = useRecoilState(endStationState);
    const [hasClimateCard, setHasClimateCard] = useRecoilState(climateCardState);
    const setRouteResponse = useSetRecoilState(routeResponseState);
    const [userInfo] = useRecoilState(userInfoState);

    const [startConfirmed, setStartConfirmed] = useState(false);
    const [endConfirmed, setEndConfirmed] = useState(false);

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
            window.location.href = "/subway/route";
        } catch (error) {
            console.error("Error during POST request:", error);
        }
    };

    useEffect(() => {
        if (startConfirmed && endConfirmed) {
            postRequest();
        }
    }, [startConfirmed, endConfirmed]);

    useEffect(() => {
        setStartStation("");
        setEndStation("");
        setHasClimateCard(userInfo.isLogIn);
    }, []);

    const handleStartChange = (value, isConfirmed) => {
        setStartStation(value);
        setStartConfirmed(isConfirmed);
    };

    const handleEndChange = (value, isConfirmed) => {
        setEndStation(value);
        setEndConfirmed(isConfirmed);
    };

    return (
        <Container>
            <InputContainer>
                <InputStation
                    placeholder="출발역"
                    value={startStation}
                    onChange={handleStartChange}
                />
                <DividerIcon />
                <InputStation
                    placeholder="도착역"
                    value={endStation}
                    onChange={handleEndChange}
                />
            </InputContainer>
            <MapContainer>
                <ToggleWrapperContainer>
                    <SwitchToggle />
                </ToggleWrapperContainer>
                <Map
                    onStartConfirm={(value) => handleStartChange(value, true)}
                    onEndConfirm={(value) => handleEndChange(value, true)}
                />
            </MapContainer>
        </Container>
    );
};

export default SubwaySearchPage;
