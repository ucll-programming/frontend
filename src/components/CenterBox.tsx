import { styled } from "styled-components";


const CenteringDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

function CenterBox({ children }: { children: React.ReactNode }): JSX.Element
{
    return (
        <CenteringDiv>
            {children}
        </CenteringDiv>
    );
}

export default CenterBox;