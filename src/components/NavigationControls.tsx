import { useDomain, Node } from "@/domain";
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
    const [node, setNode] = useState<Node | undefined>(undefined);
    const path = useActiveTreePath();
    const domain = useDomain();

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
            <Link to={buildPageUrl(node.successorTreePath)} className="navigate-next .enabled">
                <NextSymbol />
            </Link>
        );
    }
    else
    {
        return (
            <span className="navigate-next .disabled">
                <NextSymbol />
            </span>
        );
    }
}

function GoToPrevious(): JSX.Element
{
    const [node, setNode] = useState<Node | undefined>(undefined);
    const path = useActiveTreePath();
    const domain = useDomain();

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
            <Link to={buildPageUrl(node.predecessorTreePath)} className="navigate-previous .enabled">
                <PreviousSymbol />
            </Link>
        );
    }
    else
    {
        return (
            <span className="navigate-previous .disabled">
                <PreviousSymbol />
            </span>
        );
    }
}

function GoToParent(): JSX.Element
{
    const [node, setNode] = useState<Node | undefined>(undefined);
    const path = useActiveTreePath();
    const domain = useDomain();

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
            <Link to={buildPageUrl(node.parentTreePath)} className="navigate-parent .enabled">
                <UpSymbol />
            </Link>
        );
    }
    else
    {
        return (
            <span className="navigate-parent .disabled">
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
