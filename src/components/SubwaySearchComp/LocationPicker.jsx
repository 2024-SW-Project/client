import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    align-items: center;
    background-color: #5c5769;
    border-radius: 10px;
    position: absolute;
    top: ${props => props.y - 50}px;
    left: ${props => props.x - 80}px;
    width: 10rem;
    height: 2.5rem;
    z-index: 1000;
`;

const Divider = styled.div`
    width: 1px;
    height: 60%;
    background-color: #ffffff;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`;

const Triangle = styled.div`
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #5c5769;
`;

const Button = styled.button`
    flex: 1;
    background: none;
    border: none;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    &:first-child {
        border-radius: 10px 0 0 10px;
    }
    &:last-child {
        border-radius: 0 10px 10px 0;
    }
`;

const LocationPicker = ({ x, y, onStartClick, onEndClick }) => {
    return (
        <Container x={x} y={y}>
            <Button onClick={onStartClick}>출발</Button>
            <Divider />
            <Button onClick={onEndClick}>도착</Button>
            <Triangle />
        </Container>
    );
};

export default LocationPicker;