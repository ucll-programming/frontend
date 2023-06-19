import { visit } from "unist-util-visit";
import { h } from "hastscript";
import type { Node } from 'unist';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Element } from 'hast';
import { Plugin } from 'unified';
import { isString } from "@/util";



export const usageRemarkPlugin: Plugin = () => {
    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (node.name === 'USAGE')
            {
                const data = node.data || (node.data = {});
                const tagName = 'div';

                data.hName = tagName;
                data.hProperties = {className: ['usage']};
            }
        });
    };
};


export const usageRehypePlugin: Plugin = () => {
    return (tree) => {
        visit(tree, isUsage, (node: Node) => {
            const element = node as Element;
            const children = element.children;

            element.children = [
                h('header', [
                    h('h1', [ 'Example Usage' ]),
                ]),
                ...children,
            ]
        });
    };


    function isUsage(node: Node): boolean
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
            return className.includes("usage");
        }
        else if ( isString(className) )
        {
            return className.includes("usage");
        }
        else
        {
            return false;
        }
    }
};
