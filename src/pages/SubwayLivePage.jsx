import React, { useState } from "react";
import styled from "styled-components";
import SubwayLiveMap from "../components/SubwayLiveComp/SubwayLiveMap";

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

const DropdownContainer = styled.div`
    position: relative;
    width: 90%;
    max-width: 600px;
    margin: 1rem 0;
`;

const Label = styled.label`
    display: block;
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
`;

const Dropdown = styled.div`
    position: relative;
    width: 100%;
`;

const DropdownButton = styled.button`
    width: 100%;
    height: 2.5rem;
    padding: 0.8rem;
    font-size: 1rem;
    text-align: left;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        border-color: #4d7eff;
    }

    &:focus {
        border-color: #4d7eff;
        outline: none;
    }
`;

const DropdownMenu = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 100;
`;

const DropdownItem = styled.li`
    padding: 0.8rem;
    font-size: 1rem;
    cursor: pointer;
    background-color: ${({ selected }) => (selected ? "#f0f8ff" : "#ffffff")};

    &:hover {
        background-color: #e0e0e0;
    }
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
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLineSelect = (code) => {
        setLineName(code);
        setDropdownOpen(false);
    };

    const handleDirectionChange = (directionValue) => {
        setDirection(directionValue);
    };

    return (
        <Container>
            <DropdownContainer>
                <Label>호선</Label>
                <Dropdown>
                    <DropdownButton onClick={toggleDropdown}>
                        {lines.find((line) => line.code === lineName)?.name}
                        <span>▼</span>
                    </DropdownButton>
                    {dropdownOpen && (
                        <DropdownMenu>
                            {lines.map((line) => (
                                <DropdownItem
                                    key={line.code}
                                    selected={line.code === lineName}
                                    onClick={() => handleLineSelect(line.code)}
                                >
                                    {line.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    )}
                </Dropdown>
            </DropdownContainer>
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
                {lineName === "1001" && direction === 0 && "1호선_상행"}
                {lineName === "1001" && direction === 1 && "1호선_하행"}

                {lineName === "1002" && direction === 0 && "2호선_상행"}
                {lineName === "1002" && direction === 1 && "2호선_하행"}

                {lineName === "1003" && direction === 0 &&
                    <SubwayLiveMap
                        stations={[
                            "대화", "주엽", "정발산", "마두", "백석", "대곡", "화정", "원당", "원흥", "삼송", "지축", "구파발", "연신내",
                            "불광", "녹번", "홍제", "무악재", "독립문", "경복궁", "안국", "종로3가", "을지로3가", "충무로", "동대입구",
                            "약수", "금호", "옥수", "압구정", "신사", "고속터미널", "교대", "남부터미널", "양재", "매봉", "도곡", "대치",
                            "학여울", "대청", "일원", "수서", "가락시장", "경찰병원", "오금"
                        ]}
                        currentTrains={["대화", "백석", "원흥", "독립문", "교대", "경찰병원"]}
                    />}
                {lineName === "1003" && direction === 1 && "3호선_하행"}

                {lineName === "1004" && direction === 0 && "4호선_상행"}
                {lineName === "1004" && direction === 1 && "4호선_하행"}

                {lineName === "1005" && direction === 0 && "5호선_상행"}
                {lineName === "1005" && direction === 1 && "5호선_하행"}

                {lineName === "1006" && direction === 0 && "6호선_상행"}
                {lineName === "1006" && direction === 1 && "6호선_하행"}

                {lineName === "1007" && direction === 0 && "7호선_상행"}
                {lineName === "1007" && direction === 1 && "7호선_하행"}

                {lineName === "1008" && direction === 0 && "8호선_상행"}
                {lineName === "1008" && direction === 1 && "8호선_하행"}

                {lineName === "1009" && direction === 0 && "9호선_상행"}
                {lineName === "1009" && direction === 1 && "9호선_하행"}

                {lineName === "1063" && direction === 0 && "경의중앙선_상행"}
                {lineName === "1063" && direction === 1 && "경의중앙선_하행"}

                {lineName === "1065" && direction === 0 && "공항철도_상행"}
                {lineName === "1065" && direction === 1 && "공항철도_하행"}

                {lineName === "1067" && direction === 0 && "경춘선_상행"}
                {lineName === "1067" && direction === 1 && "경춘선_하행"}

                {lineName === "1075" && direction === 0 && "수인분당선_상행"}
                {lineName === "1075" && direction === 1 && "수인분당선_하행"}

                {lineName === "1077" && direction === 0 && "신분당선_상행"}
                {lineName === "1077" && direction === 1 && "신분당선_하행"}

                {lineName === "1092" && direction === 0 && "우이신설선_상행"}
                {lineName === "1092" && direction === 1 && "우이신설선_하행"}

                {lineName === "1032" && direction === 0 && "GTX-A_상행"}
                {lineName === "1032" && direction === 1 && "GTX-A_하행"}
            </SubwayContainer>
        </Container>
    );
};

export default SubwayLivePage;






/*
{ lineName === "1001" && direction === 0 && "1호선_상행" }
{ lineName === "1001" && direction === 1 && "1호선_하행" }

{ lineName === "1002" && direction === 0 && "2호선_상행" }
{ lineName === "1002" && direction === 1 && "2호선_하행" }

{ lineName === "1003" && direction === 0 && "3호선_상행" }
{ lineName === "1003" && direction === 1 && "3호선_하행" }

{ lineName === "1004" && direction === 0 && "4호선_상행" }
{ lineName === "1004" && direction === 1 && "4호선_하행" }

{ lineName === "1005" && direction === 0 && "5호선_상행" }
{ lineName === "1005" && direction === 1 && "5호선_하행" }

{ lineName === "1006" && direction === 0 && "6호선_상행" }
{ lineName === "1006" && direction === 1 && "6호선_하행" }

{ lineName === "1007" && direction === 0 && "7호선_상행" }
{ lineName === "1007" && direction === 1 && "7호선_하행" }

{ lineName === "1008" && direction === 0 && "8호선_상행" }
{ lineName === "1008" && direction === 1 && "8호선_하행" }

{ lineName === "1009" && direction === 0 && "9호선_상행" }
{ lineName === "1009" && direction === 1 && "9호선_하행" }

{ lineName === "1063" && direction === 0 && "경의중앙선_상행" }
{ lineName === "1063" && direction === 1 && "경의중앙선_하행" }

{ lineName === "1065" && direction === 0 && "공항철도_상행" }
{ lineName === "1065" && direction === 1 && "공항철도_하행" }

{ lineName === "1067" && direction === 0 && "경춘선_상행" }
{ lineName === "1067" && direction === 1 && "경춘선_하행" }

{ lineName === "1075" && direction === 0 && "수인분당선_상행" }
{ lineName === "1075" && direction === 1 && "수인분당선_하행" }

{ lineName === "1077" && direction === 0 && "신분당선_상행" }
{ lineName === "1077" && direction === 1 && "신분당선_하행" }

{ lineName === "1092" && direction === 0 && "우이신설선_상행" }
{ lineName === "1092" && direction === 1 && "우이신설선_하행" }

{ lineName === "1032" && direction === 0 && "GTX-A_상행" }
{ lineName === "1032" && direction === 1 && "GTX-A_하행" }
 */
/*
[
    "대화", "주엽", "정발산", "마두", "백석", "대곡", "화정", "원당", "원흥", "삼송", "지축", "구파발", "연신내",
    "불광", "녹번", "홍제", "무악재", "독립문", "경복궁", "안국", "종로3가", "을지로3가", "충무로", "동대입구",
    "약수", "금호", "옥수", "압구정", "신사", "고속터미널", "교대", "남부터미널", "양재", "매봉", "도곡", "대치",
    "학여울", "대청", "일원", "수서", "가락시장", "경찰병원", "오금"
]
    */
