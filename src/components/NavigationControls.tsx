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
    const path = useActiveTreePath();
    const domain = useDomain();
    const className = 'navigation next';
    const node = domain.lookup(path);
    const successorPath = node?.successor?.treePath;

    if ( successorPath )
    {
        return (
            <Link to={buildPageUrl(successorPath)} className={`${className} enabled`} title="Next">
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
    const activePath = useActiveTreePath();
    const domain = useDomain();
    const className = 'navigation previous';
    const node = domain.lookup(activePath);
    const predecessorPath = node?.predecessor?.treePath;

    if ( predecessorPath )
    {
        return (
            <Link to={buildPageUrl(predecessorPath)} className={`${className} enabled`} title="Previous">
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
    const path = useActiveTreePath();
    const domain = useDomain();
    const className = 'navigation parent';
    const node = domain.lookup(path);
    const parentPath = node?.parent?.treePath;

    if ( parentPath )
    {
        return (
            <Link to={buildPageUrl(parentPath)} className={`${className} enabled`} title="Up">
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
