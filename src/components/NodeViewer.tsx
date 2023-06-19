import { Fragment } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDomain } from "@/domain";
import { useActiveTreePath } from "@/main";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import type { Plugin } from 'unified';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Element, Text } from 'hast';
import infoIcon from '@/svg/info.svg';


// const notePlugin: Plugin = () => {
//     return (tree) => {
//         visit(tree, 'containerDirective', (node: ContainerDirective) => {
//             if (node.name === 'WARNING')
//             {
//                 const data = node.data || (node.data = {});
//                 const tagName = 'div';

//                 console.log(node);

//                 data.hName = tagName;
//                 data.hProperties = {className: 'warning'};

//             }
//         });
//     };
// };


const warningPlugin: Plugin = () => {
    return (tree) => {
        visit(tree, 'containerDirective', (node: ContainerDirective) => {
            if (node.name === 'WARNING')
            {
                const data = node.data || (node.data = {});
                const tagName = 'div';

                data.hName = tagName;
                data.hProperties = {className: 'admonition warning'};
            }
        });
    };
};


const warningRehypePlugin: Plugin = () => {
    return (tree) => {
        visit(tree, { tagName: 'div' }, (node: Element) => {
            const children = node.children;

            node.children = [
                h('span', { className: 'admonition-header'}, [
                    h('img', { src: infoIcon }),
                    h('h1', [ 'Warning' ]),
                ]),
                ...children
            ]
        });
    };
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
        return (
            <Fragment key={node.path}>
                <ReactMarkdown remarkPlugins={[remarkDirective, warningPlugin]} rehypePlugins={[]}>
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