import React from "react";
import styled from "styled-components";

const FavoriteItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const StationName = styled.span`
  font-size: 1rem;
  color: #333333;
  font-weight: bold;
`;

const Arrow = styled.span`
  font-size: 1.2rem;
  color: #666666;
`;

const ClimateTag = styled.span`
  font-size: 0.9rem;
  color: ${({ $isClimate }) => ($isClimate ? "#4CAF50" : "#FF5722")};
  background-color: ${({ $isClimate }) => ($isClimate ? "#E8F5E9" : "#FFEBEE")};
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-weight: bold;
`;

const FavoriteRoute = ({ favorite, onClick }) => {
    return (
        <FavoriteItem onClick={() => onClick(favorite)}>
            <StationName>{favorite.start_station_name}</StationName>
            <Arrow>→</Arrow>
            <StationName>{favorite.end_station_name}</StationName>
            <ClimateTag $isClimate={favorite.is_climate_card_eligible}>
                {favorite.is_climate_card_eligible ? "기후동행경로" : "일반경로"}
            </ClimateTag>
        </FavoriteItem>
    );
};

export default FavoriteRoute;
