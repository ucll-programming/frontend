import ReactLoading from "react-loading";
import CenterBox from "./CenterBox";
import React from "react";


function LoadingAnimation({ delay = 200 }: { delay?: number })
{
    const [show, setShow] = React.useState<boolean>(false);

    React.useEffect(() => {
        setTimeout(() => setShow(true), delay);
    }, [ delay ]);

    if ( show )
    {
        return (
            <CenterBox>
                <ReactLoading />
            </CenterBox>
        )
    }
    else
    {
        return (
            <></>
        );
    }
}

export default LoadingAnimation;
