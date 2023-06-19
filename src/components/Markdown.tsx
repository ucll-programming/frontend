import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkDirective from "remark-directive";
import rehypeHighlight from "rehype-highlight";
import { admonitionRehypePlugin, admonitionRemarkPlugin } from "@/markdown/admonition";
import { usageRehypePlugin, usageRemarkPlugin } from "@/markdown/usage";



export function Markdown({ children } : { children: string }): JSX.Element
{
    const remarkPlugins = [ remarkDirective, admonitionRemarkPlugin, usageRemarkPlugin ];
    const rehypePlugins = [ admonitionRehypePlugin, rehypeHighlight, usageRehypePlugin ];

    return (
        <>
            <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                {children}
            </ReactMarkdown>
        </>
    );
}
