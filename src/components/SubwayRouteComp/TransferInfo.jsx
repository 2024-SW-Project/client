import React from 'react';
import styled from 'styled-components';
import { FaPersonWalking } from "react-icons/fa6";

const TransferInfoContainer = styled.div`
    display         : flex;
    align-items     : center;
    padding         : 10px;
    background-color: #f7f8fa;
    margin          : 1rem 0;
    border-radius   : 8px;
`;

const WalkIcon = styled(FaPersonWalking)`
    font-size   : 18px;
    margin-right: 10px;
    color       : #c0c0c0;
`;

const TransferDetails = styled.div`
    font-size: 14px;
    color    : #666271;
`;

const TransferInfo = ({ walkTime }) => {
    return (
        <TransferInfoContainer>
            <WalkIcon/>
            <TransferDetails>환승 (도보 {walkTime}분)</TransferDetails>
        </TransferInfoContainer>
    );
};

export default TransferInfo;
