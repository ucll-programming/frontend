import { createHintIcon, createInformationIcon, createQuestionIcon, createTaskIcon, createVideoIcon, createWarningIcon } from "@/markdown/icons";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import type { Node } from 'unist';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Element } from 'hast';
import { Plugin } from 'unified';
import { capitalize, isString } from "@/util";



export const remarkAdmonition: Plugin = () => {
    const categories = [
        'WARNING',
        'INFO',
        'TASK',
        'VIDEO',
        'HINT',
        'QUESTION',
    ];

    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (categories.includes(node.name))
            {
                const data = node.data || (node.data = {});
                const tagName = 'div';

                data.hName = tagName;
                data.hProperties = {className: ['admonition', node.name.toLowerCase()]};
            }
        });
    };
};


export const rehypeAdmonition: Plugin = () => {
    return (tree) => {
        visit(tree, isAdmonition, (node: Node) => {
            const element = node as Element;
            const children = element.children;
            const properties = element.properties || {};
            const classNames = getClassNames(properties.className as string | string[]);
            const category = classNames.filter(cn => cn !== 'admonition')[0];
            const symbol = getCategorySymbol(category);

            element.children = [
                h('div', { className: 'admonition-header'}, [
                    h('h1', [
                        h('span', { className: 'admonition-symbol' }, [ symbol ]),
                        h('span', { className: 'admonition-caption' }, [ capitalize(category) ]),
                    ]),
                ]),
                ...children,
            ]
        });
    };


    function getCategorySymbol(category: string): Element
    {
        switch ( category )
        {
            case 'warning':
                return createWarningIcon();
            case 'info':
                return createInformationIcon();
            case 'task':
                return createTaskIcon();
            case 'video':
                return createVideoIcon();
            case 'hint':
                return createHintIcon();
            case 'question':
                return createQuestionIcon();
            default:
                return h('BUG');
        }
    }


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
        else if ( isString(className) )
        {
            return className.includes("admonition");
        }
        else
        {
            return false;
        }
    }

    function getClassNames(className: string | string[]) : string[]
    {
        if ( Array.isArray(className) )
        {
            return className;
        }
        else
        {
            return className.split(' ');
        }
    }
};
