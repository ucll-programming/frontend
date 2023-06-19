import { Fragment } from "react";
import { useDomain } from "@/domain";
import { useActiveTreePath } from "@/main";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import type { Node } from 'unist';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Element } from 'hast';
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { createInformationIcon } from "@/markdown/icons";
import { Plugin } from 'unified';


const warningPlugin: Plugin = () => {
    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (node.name === 'WARNING')
            {
                const data = node.data || (node.data = {});
                const tagName = 'div';

                data.hName = tagName;
                data.hProperties = {className: ['admonition', 'warning']};
            }
        });
    };
};


const warningRehypePlugin: Plugin = () => {
    return (tree) => {
        visit(tree, isAdmonition, (node: Node) => {
            const element = node as Element;
            const children = element.children;

            element.children = [
                h('div', { className: 'admonition-header'}, [
                    h('h1', [ createInformationIcon(), 'Warning' ]),
                ]),
                ...children
            ]
        });
    };


    function isAdmonition(node: Node): boolean
    {
        if ( node.type !== 'element' )
        {
            return false;
        }

        const element = node as Element;

        if ( element.tagName !== 'div' )
        {
            return false;
        }

        if ( !element.properties || !('className' in element.properties) )
        {
            return false;
        }

        const className = element.properties.className;

        if ( Array.isArray(className) )
        {
            return className.includes("admonition");
        }
        else if ( typeof className === 'string' )
        {
            return className.includes("admonition");
        }
        else
        {
            return false;
        }
    }
};



function NodeViewer()
{
    const path = useActiveTreePath();
    const domain = useDomain();
    const node = domain.lookup(path);

    if ( node === undefined )
    {
        return (
            <Fragment key="unknown">
                <p>Error: {path.toString()} not found in domain</p>
                <p>Domain root: {domain.root.path}</p>
            </Fragment>
        )
    }
    else if ( node.isSection() )
    {
        return (
            <Fragment key={node.path}>
                <p>Section {node.path}</p>
            </Fragment>
        );
    }
    else if ( node.isExercise() )
    {
        const remarkPlugins = [ remarkDirective, warningPlugin ];
        const rehypePlugins = [ warningRehypePlugin ];

        return (
            <Fragment key={node.path}>
                <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                    {node.markdown}
                </ReactMarkdown>
            </Fragment>
        );
    }
    else if ( node.isExplanation() )
    {
        return (
            <Fragment key={node.path}>
                <p>Explanation {node.path}</p>
            </Fragment>
        );
    }
    else
    {
        return (
            <Fragment key="unknown">
                <p>
                    Unrecognized node type
                </p>
            </Fragment>
        );
    }
}


export default NodeViewer;