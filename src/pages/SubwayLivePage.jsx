import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LineDropdown from "../components/SubwayLiveComp/LineDropdown";
import SubwayLiveMap from "../components/SubwayLiveComp/SubwayLiveMap";
import * as StationsList from '../utils/StationsList';
import axios from "axios"; // Axios for API requests

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

const TabsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2.5rem;
    margin: 1rem 0;
`;

const Tab = styled.button`
    border-radius: 2px;
    flex: 1;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
    color: ${({ selected }) => (selected ? "#4d7eff" : "#666271")};
    background-color: #ffffff;
    border: none;
    border-bottom: ${({ selected }) => (selected ? "3px solid #4d7eff" : "1px solid #ccc")};
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${({ selected }) => (selected ? "#4d7eff" : "#f0f0f0")};
        color: ${({ selected }) => (selected ? "#efefef" : "#666271")};
    }
`;

const SubwayContainer = styled.div`
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 1rem;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow-y: scroll;
`;

const SubwayLivePage = () => {
    const [lineName, setLineName] = useState("1001"); // Default line: 1호선
    const [direction, setDirection] = useState(0); // Default direction: 상행
    const [currentTrains, setCurrentTrains] = useState([]);

    const lines = [
        { code: "1001", name: "1호선" },
        { code: "1002", name: "2호선" },
        { code: "1003", name: "3호선" },
        { code: "1004", name: "4호선" },
        { code: "1005", name: "5호선" },
        { code: "1006", name: "6호선" },
        { code: "1007", name: "7호선" },
        { code: "1008", name: "8호선" },
        { code: "1009", name: "9호선" },
        { code: "1063", name: "경의중앙선" },
        { code: "1065", name: "공항철도" },
        { code: "1067", name: "경춘선" },
        { code: "1075", name: "수인분당선" },
        { code: "1077", name: "신분당선" },
        { code: "1092", name: "우이신설선" },
        { code: "1032", name: "GTX-A" },
    ];

    const fetchTrainPositions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/subway/live`, {
                //const response = await axios.get(`api/subway/live`, {
                params: {
                    line_name: Number(lineName),
                    updn_line: direction,
                },
            });

            const trainPositions = response.data[0].data.realtimePositionList.map(train => train.statnNm);
            setCurrentTrains(trainPositions);
        } catch (error) {
            console.error('Failed to fetch train positions:', error);
        }
    };

    // Fetch positions whenever lineName or direction changes
    useEffect(() => {
        fetchTrainPositions();
    }, [lineName, direction]);

    const handleDirectionChange = (directionValue) => {
        setDirection(directionValue);
    };

    return (
        <Container>
            <LineDropdown
                label="호선"
                options={lines}
                selectedValue={lineName}
                onSelect={(code) => setLineName(code)} // Update selected line
            />
            <TabsContainer>
                <Tab
                    selected={direction === 0}
                    onClick={() => handleDirectionChange(0)}
                >
                    상행
                </Tab>
                <Tab
                    selected={direction === 1}
                    onClick={() => handleDirectionChange(1)}
                >
                    하행
                </Tab>
            </TabsContainer>
            <SubwayContainer>
                {lines.map(({ code }) => (
                    <React.Fragment key={code}>
                        {lineName === code && direction === 0 && (
                            <SubwayLiveMap
                                stations={StationsList[`Line${code}_up`]}
                                currentTrains={currentTrains}
                            />
                        )}
                        {lineName === code && direction === 1 && (
                            <SubwayLiveMap
                                stations={StationsList[`Line${code}_down`]}
                                currentTrains={currentTrains}
                            />
                        )}
                    </React.Fragment>
                ))}
            </SubwayContainer>
        </Container>
    );
};

export default SubwayLivePage;
