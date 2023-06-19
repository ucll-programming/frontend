import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkDirective from "remark-directive";
import rehypeHighlight from "rehype-highlight";
import { admonitionRehypePlugin, admonitionRemarkPlugin } from "@/markdown/admonition";



export function Markdown({ children } : { children: string }): JSX.Element
{
    const remarkPlugins = [ remarkDirective, admonitionRemarkPlugin ];
    const rehypePlugins = [ admonitionRehypePlugin, rehypeHighlight ];

    return (
        <>
            <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
                {children}
            </ReactMarkdown>
        </>
    );
}


