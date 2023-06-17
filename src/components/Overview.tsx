import { Section } from '@/rest';
import { Link } from 'react-router-dom';


function SectionViewer(props: { section: string }): JSX.Element
{
    return (
        <div>
            {props.section}
        </div>
    )
}

function Overview(props: { rootSection: Section }): JSX.Element
{
    const topLevelSections = props.rootSection.children;

    return (
        <div className="overview-section-children-container">
            {
                Object.keys(topLevelSections).map(section => <SectionViewer key={section} section={section} />)
            }
        </div>
    );
}


export default Overview;