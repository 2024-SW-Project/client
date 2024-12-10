import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { sidebarState, startStationState, endStationState, userInfoState } from '../atoms/atom';
import { Link } from 'react-router-dom';
import { FaLocationDot, FaTrainSubway, FaStar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logoutUser } from '../utils/Api';
import profile1 from "../assets/1.png";
import profile2 from "../assets/2.png";
import profile3 from "../assets/3.png";

const SidebarContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 250px;
    height: 100%;
    background-color: #FFFFFF;
    z-index: 1001;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.1);
`;

// 사이드바 외부를 클릭하면 닫히는 오버레이
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
`;

// 로그인연결박스 또는 프로필 클릭 버튼
const LoginPrompt = styled(Link)`
    width: fit-content;
    font-size: 1rem;
    color: #666271;
    opacity: 0.8;
    text-decoration: none;
    display: flex;
    align-items: center;

    &:hover {
        color: #666271;
        opacity: 1;
    }
`;

// 사용자 프로필 이미지 스타일
const ProfileImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 0.5rem;
`;

// 메뉴 그룹 컨테이너
const MenuGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

// 개별 메뉴 항목 (div로 수정)
const MenuItem = styled.div`
    width: fit-content;
    font-size: 1rem;
    color: #181820;
    text-decoration: none;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
        color: #4D7EFF;
    }
`;

// 로그인/회원가입 텍스트를 담는 컨테이너
const LoginSignupContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
`;

// 로그인/로그아웃/회원가입 글자 버튼
const LoginSignupText = styled.div`
    font-size: 12px;
    color: #c0c0c0;
    text-align: center;
    cursor: pointer;
    align-self: center;

    &:hover {
        color: #666271;
    }
`;

// 푸터 로고 이미지
const FooterLogo = styled.img`
    width: 100px;
    height: auto;
    align-self: center;
    margin-top: auto;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #C0C0C0;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
`;

// 경로조회메뉴 아이콘
const SubwaySearchIcon = styled(FaLocationDot)`
    color: #4D7EFF;
    margin-right: 0.5rem;
`;

// 실시간 위치메뉴 아이콘
const SubwayLiveIcon = styled(FaTrainSubway)`
    color: #4D7EFF;
    margin-right: 0.5rem;
`;

// 즐겨찾기/캘린더 아이콘
const SubwaySaveIcon = styled(FaStar)`
    color: #4D7EFF;
    margin-right: 0.5rem;
`;

const SideBar = () => {
    const setSidebar = useSetRecoilState(sidebarState);
    const setStartStation = useSetRecoilState(startStationState);
    const setEndStation = useSetRecoilState(endStationState);
    const [userInfo, setUserInfo] = useRecoilState(userInfoState);
    const navigate = useNavigate();

    const profileImages = {
        1: profile1,
        2: profile2,
        3: profile3,
    };

    const handleRouteSearchClick = () => {
        // 상태 초기화
        setSidebar(false);
        setStartStation("");
        setEndStation("");
        // 페이지 이동
        navigate("/subway/search");
    };
    
    return (
        <>
            {/* 오버레이: 사이드바 외부 클릭 시 닫기 */}
            <Overlay onClick={() => setSidebar(false)} />

            {/* 로그인 여부에 따른 사이드바 내용 */}
            {userInfo.isLogIn ? (
                <SidebarContainer>
                    {/* 로그인 상태: 프로필 사진과 이름 */}
                    <LoginPrompt to="/mypage" onClick={() => setSidebar(false)}>
                        <ProfileImage
                            src={profileImages[userInfo.profile_picture] || profile1} // 기본값은 profile1
                            alt="Profile"
                        />
                        {userInfo.nickname}
                    </LoginPrompt>

                    <Divider />
                    {/* 메뉴 그룹 */}
                    <MenuGroup>
                        {/* 경로조회 메뉴 (div로 클릭 이벤트 추가) */}
                        <MenuItem onClick={handleRouteSearchClick}>
                            <SubwaySearchIcon />경로조회
                        </MenuItem>
                        {/* 실시간위치 메뉴 (Link로 페이지 이동) */}
                        <Link to="/subway/live" onClick={() => setSidebar(false)} style={{ textDecoration: 'none' }}>
                            <MenuItem>
                                <SubwayLiveIcon />실시간위치
                            </MenuItem>
                        </Link>
                        <Link to="/subway/save" onClick={() => setSidebar(false)} style={{ textDecoration: 'none' }}>
                            <MenuItem>
                                <SubwaySaveIcon />즐겨찾기/캘린더
                            </MenuItem>
                        </Link>
                    </MenuGroup>

                    <Divider />


                    {/* 로그아웃 버튼 */}
                    <LoginSignupText
                        onClick={async () => {
                            await logoutUser(setUserInfo, setSidebar, navigate);
                        }}
                    >
                        로그아웃
                    </LoginSignupText>

                    <FooterLogo src="/logo2.png" alt="logo" />
                </SidebarContainer>
            ) : (
                <SidebarContainer>
                    {/* 비로그인 상태: 로그인 링크 */}
                    <LoginPrompt to="/auth/login" onClick={() => setSidebar(false)}>
                        로그인을 해주세요
                    </LoginPrompt>

                    <Divider />

                    {/* 메뉴 그룹 */}
                    <MenuGroup>
                        {/* 경로조회 메뉴 */}
                        <MenuItem onClick={handleRouteSearchClick}>
                            <SubwaySearchIcon />경로조회
                        </MenuItem>
                        {/* 실시간위치 메뉴 */}
                        <Link to="/subway/live" onClick={() => setSidebar(false)} style={{ textDecoration: 'none' }}>
                            <MenuItem>
                                <SubwayLiveIcon />실시간위치
                            </MenuItem>
                        </Link>
                    </MenuGroup>

                    <Divider />

                    {/* 로그인 버튼 */}
                    <LoginSignupContainer>
                        <Link to="/auth/login" onClick={() => setSidebar(false)}>
                            <LoginSignupText onClick={() => {
                                setSidebar(false);
                            }}>
                                로그인
                            </LoginSignupText>
                        </Link>
                        <Link to="/auth/signup" onClick={() => setSidebar(false)}>
                            <LoginSignupText onClick={() => { setSidebar(false); }}>
                                회원가입
                            </LoginSignupText>
                        </Link>

                    </LoginSignupContainer>


                    <FooterLogo src="/logo2.png" alt="logo" />
                </SidebarContainer>
            )}
        </>
    );
};

export default SideBar;
