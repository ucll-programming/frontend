function DifficultyViewer({ difficulty } : { difficulty: number }): JSX.Element
{
    const table = [
        'BUG',
        '①',
        '②',
        '③',
        '④',
        '⑤',
        '⑥',
        '⑦',
        '⑧',
        '⑨',
        '⑩',
        '⑪',
        '⑫',
        '⑬',
        '⑭',
        '⑮',
        '⑯',
        '⑰',
        '⑱',
        '⑲',
        '⑳',
    ];

    return (
        <>
            {table[difficulty]}
        </>
    );
}

export default DifficultyViewer;