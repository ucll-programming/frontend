import { visit } from "unist-util-visit";
import type { ContainerDirective } from 'mdast-util-directive';
import { Plugin } from 'unified';



export const remarkCenter: Plugin = () => {
    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (node.name == 'center')
            {
                const data = node.data || (node.data = {});
                const tagName = 'div';

                data.hName = tagName;
                data.hProperties = {className: ['centered']};
            }
        });
    };
};
