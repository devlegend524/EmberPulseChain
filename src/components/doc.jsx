import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

const ExpandableCard = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const cardRef = useRef(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded) {
      const cardBottom = cardRef.current.getBoundingClientRect().bottom;
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      
      // Only scroll down if content extends below viewport
      if (cardBottom > viewportHeight) {
        const scrollDelta = cardBottom - viewportHeight + 20; // +20px buffer
        const potentialNewScrollY = currentScrollY + scrollDelta;
        
        // Only scroll if it would result in moving downward
        if (potentialNewScrollY > currentScrollY) {
          window.scrollTo({
            top: potentialNewScrollY,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [isExpanded]);

  return (
    <CardContainer ref={cardRef} className=''>
      <Title 
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        role="button"
        tabIndex="0"
        className='mt-4 pb-8 border-b border-[#292524] '
      >
        {title}
        <Chevron expanded={isExpanded}>▼</Chevron>
      </Title>
      
      <Content 
        ref={contentRef}
        expanded={isExpanded}
        aria-hidden={!isExpanded}
      >
        {children}
      </Content>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.div`
  padding: 5px 5px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color:rgba(245, 245, 245, 0);
  transition: background-color 0.2s;
  user-select: none;
  outline: none;

  &:hover, &:focus {
    background-color:rgba(233, 233, 233, 0);
  }

`;

const Chevron = styled.span`
  transition: transform 0.3s ease;
  font-size: 0.8em;
  margin-left: 10px;
  
  ${props => props.expanded && css`
    transform: rotate(180deg);
  `}
`;

const Content = styled.div`
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: transparent;
  
  ${props => props.expanded && css`
    padding: 20px;
    max-height: 2000px;
  `}
`;

export default ExpandableCard;