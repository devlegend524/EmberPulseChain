import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  border-radius: 2px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;

  @media screen and (min-width: 576px) {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    max-height: 100px;
  }

  @media screen and (min-width: 1080px) {
    margin-left: 48px;
    margin-right: 0;
    margin-bottom: 0;
    max-height: 100px;
  }
`

export const ActionTitles = styled.div`
  display: flex;
`

export const ActionContent = styled.div`
margin:20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-center;
`
export const Earned = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: white;
`
