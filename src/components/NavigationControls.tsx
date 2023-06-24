import { useDomain, ContentNode } from "@/domain";
import { useActiveTreePath } from "@/main";
import { buildPageUrl } from "@/util";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as icons from '@primer/octicons-react';


function PreviousSymbol(): JSX.Element
{
    return (
        <icons.ArrowLeftIcon />
    );
}

function NextSymbol(): JSX.Element
{
    return (
        <icons.ArrowRightIcon />
    );
}

function UpSymbol(): JSX.Element
{
    return (
        <icons.ArrowUpIcon />
    );
}

function GoToNext(): JSX.Element
{
    const [node, setNode] = useState<ContentNode | undefined>(undefined);
    const path = useActiveTreePath();
    const domain = useDomain();
    const className = 'navigation next';

    useEffect(() => {
        const func = async () => {
            const node = await domain.lookup(path);

            setNode(node);
        };

        func();
    }, [path, domain]);


    if ( node !== undefined && node.successorTreePath )
    {
        return (
            <Link to={buildPageUrl(node.successorTreePath)} className={`${className} enabled`} title="Next">
                <NextSymbol />
            </Link>
        );
    }
    else
    {
        return (
            <span className={`${className} disabled`}>
                <NextSymbol />
            </span>
        );
    }
}

function GoToPrevious(): JSX.Element
{
    const [node, setNode] = useState<ContentNode | undefined>(undefined);
    const path = useActiveTreePath();
    const domain = useDomain();
    const className = 'navigation previous';

    useEffect(() => {
        const func = async () => {
            const node = await domain.lookup(path);

            setNode(node);
        };

        func();
    }, [path, domain]);


    if ( node !== undefined && node.predecessorTreePath )
    {
        return (
            <Link to={buildPageUrl(node.predecessorTreePath)} className={`${className} enabled`} title="Previous">
                <PreviousSymbol />
            </Link>
        );
    }
    else
    {
        return (
            <span className={`${className} disabled`}>
                <PreviousSymbol />
            </span>
        );
    }
}

function GoToParent(): JSX.Element
{
    const [node, setNode] = useState<ContentNode | undefined>(undefined);
    const path = useActiveTreePath();
    const domain = useDomain();
    const className = 'navigation parent';

    useEffect(() => {
        const func = async () => {
            const node = await domain.lookup(path);

            setNode(node);
        };

        func();
    }, [path, domain]);


    if ( node !== undefined && node.parentTreePath )
    {
        return (
            <Link to={buildPageUrl(node.parentTreePath)} className={`${className} enabled`} title="Up">
                <UpSymbol />
            </Link>
        );
    }
    else
    {
        return (
            <span className={`${className} disabled`}>
                <UpSymbol />
            </span>
        );
    }
}

function NavigationControls() : JSX.Element
{
    return (
        <div className="navigation-button-container">
            <GoToPrevious />
            <GoToParent />
            <GoToNext />
        </div>
    );
}

export default NavigationControls;
