import * as icons  from "@/markdown/icons";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import type { Node } from 'unist';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Element } from 'hast';
import { Plugin } from 'unified';
import { isString } from "@/util";



export const remarkHint: Plugin = () => {
    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (node.name === 'HINT')
            {
                const data = node.data || (node.data = {});
                const tagName = 'div';

                data.hName = tagName;
                data.hProperties = { className: ['hint'], caption: node.attributes?.caption };
            }
        });
    };
};


export const rehypeHint: Plugin = () => {
    return (tree) => {
        visit(tree, isHint, (node: Node) => {
            const element = node as Element;
            const children = element.children;
            const caption = (element.properties?.caption || 'Hint') as string;

            console.log(node);

            element.children = [
                h('div', { className: 'card', tabindex: '0' }, [
                    h('div', { className: 'card-faces' }, [
                        h('div', { className: 'card-front'}, [
                            h('h1', [
                                h('span', { className: 'hint-symbol' }, [ icons.createHintIcon() ]),
                                h('span', { className: 'hint-caption' }, [ caption ]),
                            ]),
                        ]),
                        h('div', { className: 'card-back'}, [
                            h('div', { className: 'card-back-contents' }, [
                                ...children,
                            ]),
                        ]),
                    ])
                ]),
            ];
        });
    };


    function isHint(node: Node): boolean
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
            return className.includes("hint");
        }
        else if ( isString(className) )
        {
            return className.includes("hint");
        }
        else
        {
            return false;
        }
    }
};
