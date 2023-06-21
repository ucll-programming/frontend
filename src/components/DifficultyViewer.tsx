import { Exercise, Explanation, Node, Section, TreePath } from '@/domain';
import { useActiveTreePath } from '@/main';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as icons from '@primer/octicons-react';



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