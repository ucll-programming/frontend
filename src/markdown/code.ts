import { visit } from "unist-util-visit";
import type { ContainerDirective } from 'mdast-util-directive';
import { Plugin } from 'unified';
import type { Node } from 'unist';
import type { Element } from 'hast';
import { h } from "hastscript";
import { isString } from "@/util";


const identifyingClassName = 'code-container';


export const remarkCode: Plugin = () => {
    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (node.name == 'code')
            {
                const data = node.data || (node.data = {});
                const attributes = node.attributes || {};
                const tagName = 'div';
                const classNames = [ identifyingClassName ];

                if ( 'class' in attributes )
                {
                    classNames.push(attributes.class as string);
                }

                data.hName = tagName;
                data.hProperties = {className: classNames};
            }
        });
    };
};


export const rehypeCode: Plugin = () => {
    return (tree) => {
        visit(tree, isCodeElement, (node: Node) => {
            const element = node as Element;
            const children = element.children;
            const properties = element.properties || {};
            const classNames = getClassNames(properties.className as string | string[]);
            const category = classNames.filter(cn => cn !== identifyingClassName)[0];

            element.children = [
                h('div', { className: 'code-container-header'}, [
                    h('span', { className: 'code-container-caption' }, [ category ]),
                ]),
                ...children,
            ]
        });
    };

    function isCodeElement(node: Node): boolean
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
            return className.includes(identifyingClassName);
        }
        else if ( isString(className) )
        {
            return className.includes(identifyingClassName);
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
