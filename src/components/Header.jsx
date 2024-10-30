import React from 'react';
import styled from "styled-components";
import { FaBars } from "react-icons/fa6";

const Container = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #FFFFFF;
    padding: 0 1rem;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

const LogoImg = styled.img`
    width: 40px;
    height: 40px;
`;

const Divider = styled.div`
    width: 1px;
    height: 20px;
    background-color: #C0C0C0;
    margin: 0 1.25rem;
`;

const MenuText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #666271;
`;

const MenuButton = styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    font-size: 20px;
    color: #666271;
    cursor: pointer;
    outline: none;
    /* -webkit-tap-highlight-color: transparent; /* 모바일 터치 하이라이트 제거 */

    &:focus,
    &:active {
        outline: none; /* 포커스 시 외곽선 제거 */
        box-shadow: none; /* 클릭 시 파란색 영역 제거 */
    }
`;

const Header = () => {
    return (
        <Container>
            <LeftSection>
                <LogoImg src="/logo1.png" alt="logo" />
                <Divider />
                <MenuText>경로 찾기</MenuText>
            </LeftSection>
            <MenuButton>
                <FaBars />
            </MenuButton>
        </Container>
    );
}

export default Header;
