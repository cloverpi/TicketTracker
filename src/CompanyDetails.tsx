import { useState } from 'react'
import TicketAccourdian from './TicketAccourdian';
import CompanyTeamviewer from './CompanyTeamviewer';

interface Prop {
    companyTicket: any;
}

function TicketSelection( {companyTicket} : Prop ) {
    const [activeTab, setActiveTab] = useState('teamviewer');

    const tabs = [
        { id: "teamviewer", label: "Teamviewer" },
        { id: "tickets", label: "Previous Tickets" },
    ];

    const tabContent: Record<string, JSX.Element> = {
        teamviewer: <CompanyTeamviewer company={companyTicket.company}/>,
        tickets: <TicketAccourdian company={companyTicket.company} />
    }

    const tabHandler = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <ul className="nav nav-tabs mb-3">
                {tabs.map((tab) => (
                    <li className="nav-item" key={tab.id}>
                    <button
                        className={"nav-link " + (activeTab === tab.id ? "active" : "")}
                        onClick={() => tabHandler(tab.id)}
                    >
                        {tab.label}
                    </button>
                    </li>
                ))}
            </ul>
            {tabContent[activeTab]}
        </>
    )
}

export default TicketSelection