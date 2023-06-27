import { visit } from "unist-util-visit";
import type { ContainerDirective } from 'mdast-util-directive';
import { Plugin } from 'unified';



const remarkDiv: Plugin = () => {
    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (node.name == 'div')
            {
                const data = node.data || (node.data = {});
                const tagName = 'div';

                console.log(node.attributes);

                data.hName = tagName;
                data.hProperties = {className: [node.attributes?.class], style: node.attributes?.style};
            }
        });
    };
};


export default remarkDiv;