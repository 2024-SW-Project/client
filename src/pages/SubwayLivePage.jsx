import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IoReloadOutline } from "react-icons/io5";
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
    color: ${({ selected, $lineColor }) => (selected ? $lineColor : "#666271")};
    background-color: #ffffff;
    border: none;
    border-bottom: ${({ selected, $lineColor }) =>
        selected ? `3px solid ${$lineColor}` : "1px solid #ccc"};
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${({ selected, $lineColor }) =>
        selected ? $lineColor : "#f0f0f0"};
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
    gap: 0.8rem; /* 버튼 간 간격 증가 */
    margin-bottom: 1rem;
`;

const MenuButton = styled.button`
    flex: 1;
    padding: 0.5rem;
    font-size: 0.9rem;
    color: ${({ selected, $lineColor }) => (selected ? "#fff" : $lineColor)};
    background-color: ${({ selected, $lineColor }) => (selected ? $lineColor : "#ffffff")};
    border: 2px solid ${({ $lineColor }) => $lineColor};
    border-radius: 10px; /* 둥근 테두리 추가 */
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.4; /* 텍스트 간격 조정 */
    text-align: center; /* 텍스트 가운데 정렬 */
    width: 4rem;

    &:hover {
        background-color: ${({ selected, $lineColor }) =>
        selected ? $lineColor : "#f0f0f0"};
    }

    span {
        display: block;
        font-weight: ${({ selected }) => (selected ? "bold" : "normal")}; /* 선택된 버튼은 굵게 */
    }
`;



const ReloadButton = styled.button`
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    background-color: #666271 !important;
    color: white !important;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: #c0c0c0;
    }
`;

const FaDownloadIcon = styled(IoReloadOutline)`
    color: white;
    font-size: 3rem;
`;

const SubwayLivePage = () => {
    const [lineName, setLineName] = useState("1호선");
    const [direction, setDirection] = useState(0);
    const [currentTrains, setCurrentTrains] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(1);

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

    const getLineColor = (lineNumber) => {
        const lineColors = {
            "1호선": "#0052A4",
            "2호선": "#00A84D",
            "3호선": "#EF7C1C",
            "4호선": "#00A5DE",
            "5호선": "#996CAC",
            "6호선": "#CD7C2F",
            "7호선": "#747F00",
            "8호선": "#EA545D",
            "9호선": "#BDB092",
            "경의중앙선": "#77C4A3",
            "경춘선": "#0C8E72",
            "수인분당선": "#FABE00",
            "우이신설선": "#B7C452",
            "공항철도": "#4E8FC6",
            "신분당선": "#D31145",
            "GTX-A": "#7D589F",
        };

        return lineColors[lineNumber] || "#333";
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
    }, [lineName, direction, selectedMenu]);

    const handleReload = () => {
        fetchTrainPositions();
    };

    const handleDirectionChange = (directionValue) => {
        setDirection(directionValue);
    };

    const handleMenuChange = (menuValue) => {
        setSelectedMenu(menuValue);
    };

    const lineCode = lines.find((line) => line.name === lineName)?.code;
    const lineColor = getLineColor(lineName);

    return (
        <Container>
            <LineDropdown
                label="호선"
                options={lines}
                selectedValue={lineName}
                onSelect={(name) => setLineName(name)}
            />
            {menuMapping[lineName] ? ( // 메뉴가 있을 경우에만 렌더링
                <DirectionMenu>
                    {menuMapping[lineName].map((menu, index) => {
                        const [firstLine, secondLine] = menu.split("-");
                        return (
                            <MenuButton
                                key={index}
                                selected={selectedMenu === index + 1}
                                $lineColor={lineColor}
                                onClick={() => handleMenuChange(index + 1)}
                            >
                                <span>{firstLine}</span>
                                <span>{secondLine}</span>
                            </MenuButton>
                        );
                    })}
                </DirectionMenu>
            ) : null}
            <TabsContainer>
                <Tab
                    selected={direction === 0}
                    $lineColor={lineColor}
                    onClick={() => handleDirectionChange(0)}
                >
                    상행
                </Tab>
                <Tab
                    selected={direction === 1}
                    $lineColor={lineColor}
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
                                lineColor={lineColor}
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
                                lineColor={lineColor}
                            />
                        )}
                    </React.Fragment>
                ))}
            </SubwayContainer>
            <ReloadButton onClick={handleReload}>
                <FaDownloadIcon />
            </ReloadButton>
        </Container>
    );
};

export default SubwayLivePage;
