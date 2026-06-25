# 🚇 나모타? 이거타!

> **기후동행카드 이용 가능 구간을 고려한 맞춤형 지하철 경로 안내 및 실시간 열차 위치 조회 서비스**

## 📖 프로젝트 소개

기존 길찾기 서비스는 출발역과 도착역만 기준으로 경로를 안내해, 기후동행카드처럼 특정 노선에서 사용할 수 없는 교통카드를 사용하는 경우에도 동일한 경로를 추천하는 문제가 있었습니다.

실제로 기후동행카드를 사용하던 팀원이 신분당선을 이용하려 했다가, 해당 노선에서는 카드를 사용할 수 없다는 사실을 현장에서 알게 되어 다시 경로를 찾아 이동했던 경험이 있었습니다. 이처럼 교통카드 사용 여부를 고려하지 않는 기존 서비스의 불편함을 해결하고자 프로젝트를 시작했습니다.

또한 실시간 열차 위치를 확인하려면 별도의 서비스를 이용해야 하는 번거로움도 있었습니다.

**나모타? 이거타!** 는 기후동행카드 이용 가능 구간을 고려한 맞춤형 경로 추천과 실시간 열차 위치 조회를 하나의 서비스에서 제공하는 웹 애플리케이션입니다.

---

## ✨ 주요 기능

### 🚉 맞춤 지하철 경로 추천

<table>
  <tr>
    <td align="center">
      <img width="391" alt="일반 경로 추천 모드" src="https://github.com/user-attachments/assets/9bfc96be-2560-4162-97be-813b050878ca" /><br/>
      <b>일반 경로 추천 모드</b>
    </td>
    <td align="center">
      <img width="285" alt="기후동행카드 경로 추천 모드" src="https://github.com/user-attachments/assets/f4668297-3576-4176-bdd5-28632a357b3d" /><br/>
      <b>기후동행카드 경로 추천 모드</b>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center">
      <img width="260" alt="출발역 설정(역 자동 완성)" src="https://github.com/user-attachments/assets/d3f1b8e5-7b92-478d-89eb-5f19b6cb422f" /><br/>
      <b>출발역 설정(역 자동 완성)</b>
    </td>
    <td align="center">
      <img width="260" alt="도착역 설정(역 클릭)" src="https://github.com/user-attachments/assets/0a1e41a9-5d13-4f71-8069-5fac5ea6e0ae" /><br/>
      <b>도착역 설정(역 클릭)</b>
    </td>
    <td align="center">
      <img width="260" alt="맞춤 경로 추천" src="https://github.com/user-attachments/assets/952504bf-84e4-4e51-aed2-95eb19f72b45" /><br/>
      <b>맞춤 경로 추천</b>
    </td>
  </tr>
</table>

<p align="center">
  <img width="600" alt="추가 정보 제공" src="https://github.com/user-attachments/assets/50b604af-b334-4018-aabe-05b3fc413359" /><br/>
  <b>추가 정보 제공</b>
</p>

* 출발역 · 도착역 기반 경로 조회
* 기후동행카드 적용 여부를 고려한 경로 추천
* 급행 여부
* 상·하행 방향
* 빠른 환승 위치
* 하차 문 위치 안내

---

### ⭐ 즐겨찾기 및 캘린더

<table>
  <tr>
    <td align="center">
      <img width="260" alt="해당 경로 클릭 시 자동적으로 해당 경로 재검색" src="https://github.com/user-attachments/assets/69ed9f48-fdfc-41f6-b623-d35418b97ccb" /><br/>
      <b>해당 경로 클릭 시 자동 재검색</b>
    </td>
    <td align="center">
      <img width="260" alt="즐겨찾기에서 재검색된 경로" src="https://github.com/user-attachments/assets/32b8d741-5f85-495c-8002-b753a1587aeb" /><br/>
      <b>즐겨찾기에서 재검색된 경로</b>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center">
      <img width="260" alt="캘린더 추가" src="https://github.com/user-attachments/assets/eae9fa03-c056-4cde-9bb4-4c6a70c3e2aa" /><br/>
      <b>캘린더 추가</b>
    </td>
    <td align="center">
      <img width="260" alt="날짜별로 저장된 경로 보기" src="https://github.com/user-attachments/assets/b5e31093-7e85-4c7b-b69f-bfb11ee6a055" /><br/>
      <b>날짜별로 저장된 경로 보기</b>
    </td>
  </tr>
</table>

* 자주 이용하는 경로 즐겨찾기
* 즐겨찾기 클릭 시 자동 재검색
* 캘린더에 경로 저장
* 날짜별 저장된 경로 조회(미리 찾아서 등록 가능)

---

### 🚆 실시간 열차 위치

<p align="center">
  <img width="210" alt="실시간 위치(상/하행 구분, 분기 구분)" src="https://github.com/user-attachments/assets/ab53e7d6-76f7-456b-a519-003da63f06e7" /><br/>
  <b>실시간 위치(상/하행 구분, 분기 구분)</b>
</p>

* 서울교통공사 API 기반 실시간 열차 위치 조회
* 현재 운행 중인 열차 위치 확인

---

### 👤 회원 기능

<table>
  <tr>
    <td align="center">
      <img width="300" alt="로그인" src="https://github.com/user-attachments/assets/969f97f6-cad9-4000-9ed2-cdb3d2d7c5e0" /><br/>
      <b>로그인</b>
    </td>
    <td align="center">
      <img width="300" alt="회원가입" src="https://github.com/user-attachments/assets/969f97f6-cad9-4000-9ed2-cdb3d2d7c5e0" /><br/>
      <b>회원가입</b>
    </td>
  </tr>
</table>

* 회원가입
* 로그인
* 아이디 찾기
* 비밀번호 재설정
* 프로필 사진 변경
* 비밀번호 변경
* 회원 탈퇴

---

### 📱 반응형 UI

<table>
  <tr>
    <td align="center">
      <img width="180" alt="모바일" src="https://github.com/user-attachments/assets/f9869710-bd6c-466f-bef4-08c7be215874" /><br/>
      <b>모바일</b>
    </td>
    <td align="center">
      <img width="560" alt="데스크탑" src="https://github.com/user-attachments/assets/ae48ce1e-fc99-439b-9b38-5c5d7afa7fa5" /><br/>
      <b>데스크탑</b>
    </td>
  </tr>
</table>

* 모바일 · 태블릿 · 데스크탑 대응
* 화면 크기에 따른 레이아웃 변경
* 다양한 해상도에서 동일한 사용자 경험 제공

---

## 🧭 사용자 흐름

```text
회원가입 및 로그인
      ↓
출발역 · 도착역 입력
      ↓
기후동행카드 적용 여부 선택
      ↓
맞춤 경로 추천
      ↓
급행 여부 · 환승 위치 · 하차 문 정보 확인
      ↓
즐겨찾기 또는 캘린더 저장
      ↓
실시간 열차 위치 확인
```

---

## 🛠 Tech Stack

### Frontend

* React
* JavaScript
* Styled-components
* Recoil
* Axios

### Backend

* Spring Boot
* Java
* Gradle
* JWT

### Database

* MySQL
