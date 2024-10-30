import React from 'react';
import styled from "styled-components";
import { FaBars } from "react-icons/fa6";

const Container = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed; /* 상단에 고정 */
    top: 0;
    width: 100%;
    background-color: #FFFFFF;
    padding: 0 1rem;
    z-index: 1000; /* 다른 요소들보다 위에 표시 */
`;

// 왼쪽 섹션에 로고와 메뉴텍스트를 정렬
const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

// 로고 이미지
const LogoImg = styled.img`
    width: 56px;
    height: 56px;
`;

// 로고와 메뉴텍스트 사이의 구분선
const Divider = styled.div`
    width: 1.5px;
    height: 20px;
    background-color: #C0C0C0;
    margin: 0 1.25rem;
`;

// 헤더의 메뉴텍스트
const MenuText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #666271;
`;

// 오른쪽 메뉴 버튼
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

    &:focus,
    &:active {
        outline: none;
        box-shadow: none;
    }
`;

const Header = () => {
    return (
        <Container>
            {/* 왼쪽 섹션: 로고 이미지와 메뉴 텍스트 */}
            <LeftSection>
                <LogoImg src="/logo1.png" alt="logo" />
                <Divider />
                <MenuText>경로 찾기</MenuText>
            </LeftSection>
            {/* 오른쪽 메뉴 버튼 */}
            <MenuButton>
                <FaBars />
            </MenuButton>
        </Container>
    );
};

export default Header;
