import React from 'react';
import styled from 'styled-components';
import { FaAnglesDown } from "react-icons/fa6";

const Container = styled.div`
    display         : flex;
    padding         : 1rem;
    background-color: #fff;
    border-radius   : 8px;
    box-shadow      : 0 1px 3px rgba(0, 0, 0, 0.1);
    width           : 100%;
    position        : relative;
`;

const LineConnectorContainer = styled.div`
    display       : flex;
    flex-direction: column;
    align-items   : center;
    margin-right  : 10px;
    position      : relative;
`;

const LineConnector = styled.div`
    width           : 4px;
    height          : calc(100% - 24px);
    background-color: ${props => props.lineColor || '#ccc'};
    position        : absolute;
    top             : 0;
    left            : 50%;
    transform       : translateX(-50%);
`;

const Circle = styled.div`
    background-color: ${props => props.lineColor || '#ccc'};
    color           : white;
    width           : 24px;
    height          : 24px;
    border-radius   : 50%;
    display         : flex;
    align-items     : center;
    justify-content : center;
    font-size       : ${props => (props.textLength > 1 ? (props.textLength > 2 ? '0.4rem' : '0.6rem'): '0.8rem')};
    font-weight     : bold;
    z-index         : 1;
`;

const EndCircle = styled(Circle)`
    margin-top: auto;
`;

const StationContainer = styled.div`
    display       : flex;
    flex-direction: column;
    width         : 100%;
`;

const Time = styled.div`
    font-size    : 14px;
    color        : #666;
    margin-bottom: 5px;
`;

const StationDetails = styled.div`
    display       : flex;
    flex-direction: column;
`;

const StationName = styled.div`
    font-size  : 16px;
    font-weight: bold;
    color      : #333;
`;

const Direction = styled.div`
    font-size: 14px;
    color    : #666;
`;

const DoorInfo = styled.div`
    font-size : 12px;
    color     : #888;
    margin-top: 2px;
`;

const StationsPathInfo = styled.div`
    font-size  : 14px;
    color      : #666;
    display    : flex;
    align-items: center;
    margin     : 1rem 0;
`;

const StationsIcon = styled(FaAnglesDown)`
    font-size   : 18px;
    margin-right: 5px;
`;

const StationDetailInfo = ({
    startTime,
    startStation,
    startLineNumber,
    startLineColor,
    startDirection,
    startDoorInfo,
    travelInfo,
    endTime,
    endStation,
    endDoorInfo
}) => {
    return (
        <Container>
            <LineConnectorContainer>
                <LineConnector lineColor = {startLineColor} />
                <Circle        lineColor = {startLineColor} textLength = {startLineNumber.length}>
                    {startLineNumber}
                </Circle>
                <EndCircle lineColor = {startLineColor} />
            </LineConnectorContainer>

            <div style = {{ flex: 1 }}>
                {/* 출발역 정보 */}
                <StationContainer>
                    <Time>{startTime}</Time>
                    <StationDetails>
                        <StationName>{startStation}</StationName>
                        <Direction>{startDirection}</Direction>
                        <DoorInfo>{startDoorInfo}</DoorInfo>
                    </StationDetails>
                </StationContainer>

                {/* 이동 정보 */}
                <StationsPathInfo>
                    <StationsIcon/>
                    {travelInfo}
                </StationsPathInfo>

                {/* 도착역 정보 */}
                <StationContainer>
                    <Time>{endTime}</Time>
                    <StationDetails>
                        <StationName>{endStation}</StationName>
                        <DoorInfo>{endDoorInfo}</DoorInfo>
                    </StationDetails>
                </StationContainer>
            </div>
        </Container>
    );
};

export default StationDetailInfo;