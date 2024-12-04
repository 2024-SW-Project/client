import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LineDropdown from "../components/SubwayLiveComp/LineDropdown";
import SubwayLiveMap from "../components/SubwayLiveComp/SubwayLiveMap";
import * as StationsList from "../utils/StationsList";
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

const DirectionMenu = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const MenuButton = styled.button`
    flex: 1;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: ${({ selected }) => (selected ? "#fff" : "#4d7eff")};
    background-color: ${({ selected }) => (selected ? "#4d7eff" : "#ffffff")};
    border: 2px solid #4d7eff;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: ${({ selected }) => (selected ? "#4d7eff" : "#f0f0f0")};
    }
`;

const SubwayLivePage = () => {
    const [lineName, setLineName] = useState("1호선"); // Default line: 1호선
    const [direction, setDirection] = useState(0); // Default direction: 상행
    const [currentTrains, setCurrentTrains] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(1); // Default menu value

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

    const menuMapping = {
        "1호선": ["신도림-연천", "인천-구로", "광명-구로", "서동탄-구로", "신창-구로"],
        "2호선": ["순환선", "신도림-까치산", "신설동-성수"],
        "5호선": ["방화-하남검단산", "방화-마천"],
        "경의중앙선": ["문산-지평", "문산-서울역"],
        "경춘선": ["광운대-춘천", "청량리-춘천"],
    };

    const fetchTrainPositions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/subway/live`, {
                params: {
                    line_name: lineName,
                    updn_line: direction,
                },
            });

            const trainPositions = response.data.data.simpleData.map((train) => train.statnNm);
            setCurrentTrains(trainPositions);
        } catch (error) {
            console.error("Failed to fetch train positions:", error);
        }
    };

    useEffect(() => {
        fetchTrainPositions();
    }, [lineName, direction]);

    const handleDirectionChange = (directionValue) => {
        setDirection(directionValue);
    };

    const handleMenuChange = (menuValue) => {
        setSelectedMenu(menuValue);
    };

    const lineCode = lines.find((line) => line.name === lineName)?.code;

    return (
        <Container>
            <LineDropdown
                label="호선"
                options={lines}
                selectedValue={lineName}
                onSelect={(name) => setLineName(name)}
            />
            {menuMapping[lineName] && (
                <DirectionMenu>
                    {menuMapping[lineName].map((menu, index) => (
                        <MenuButton
                            key={index}
                            selected={selectedMenu === index + 1}
                            onClick={() => handleMenuChange(index + 1)}
                        >
                            {menu}
                        </MenuButton>
                    ))}
                </DirectionMenu>
            )}
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
                        {lineCode === code && direction === 0 && (
                            <SubwayLiveMap
                                stations={
                                    menuMapping[lineName]
                                        ? StationsList[`Line${code}_up_${selectedMenu}`]
                                        : StationsList[`Line${code}_up`]
                                }
                                currentTrains={currentTrains}
                            />
                        )}
                        {lineCode === code && direction === 1 && (
                            <SubwayLiveMap
                                stations={
                                    menuMapping[lineName]
                                        ? StationsList[`Line${code}_down_${selectedMenu}`]
                                        : StationsList[`Line${code}_down`]
                                }
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
