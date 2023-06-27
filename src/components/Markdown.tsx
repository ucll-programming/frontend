import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkDirective from "remark-directive";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import remarkGfm from 'remark-gfm';
import rehypeMathjax from "rehype-mathjax";
import remarkDiv from "@/markdown/div";
import { rehypeAdmonition, remarkAdmonition } from "@/markdown/admonition";
import { usageRehypePlugin, usageRemarkPlugin } from "@/markdown/usage";
import { remarkCenter } from "@/markdown/center";
import { rehypeCode, remarkCode } from "@/markdown/code";


export function Markdown({ children } : { children: string }): JSX.Element
{
    const remarkPlugins = [ remarkDirective, remarkAdmonition, usageRemarkPlugin, remarkMath, remarkGfm, remarkCenter, remarkCode, remarkDiv ];
    const rehypePlugins = [ rehypeAdmonition, rehypeHighlight, usageRehypePlugin, rehypeMathjax, rehypeCode ];

    return (
        <>
            <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                {children}
            </ReactMarkdown>
        </>
    );
}
