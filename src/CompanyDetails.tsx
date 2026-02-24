import { useState } from 'react'
import TicketAccourdian from './TicketAccourdian';
import CompanyTeamviewer from './CompanyTeamviewer';

interface Prop {
    companyTicket: any;
}

function TicketSelection( {companyTicket} : Prop ) {
    const [activeTab, setActiveTab] = useState('teamviewer');
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: "teamviewer", label: "Teamviewer" },
        { id: "tickets", label: "Previous Tickets" },
    ];

    const handleReload = () => {
        setLoading(true);
        setTimeout(()=>setLoading(false), 2000)
        console.log('reload');
    }

    const tabContent: Record<string, JSX.Element> = {
        teamviewer: <CompanyTeamviewer company={companyTicket.company}/>,
        tickets: <TicketAccourdian company={companyTicket.company} />
    }

    const tabHandler = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <>
        <div className="d-flex align-items-center mb-2">
            <ul className="nav nav-tabs flex-grow-1">
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
            
            { activeTab == 'teamviewer' &&
            <>
                <input
                type="text"
                className="form-control "
                style={{ width: "200px" }}
                placeholder="Search"
                />

                <button
                className="btn"
                onClick={handleReload}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className={`icon icon-tabler icons-tabler-outline icon-tabler-reload ${loading && 'spin'}`}
                        >
                            <path stroke="none" d="M0 0h20v20H0z" fill="none"/>
                            <path d="M16.611 10.867a6.667 6.667 0 1 1 -8.271 -7.324c3.249 -.833 6.613 .839 7.854 3.956" />
                            <path d="M16.667 3.333v4.167h-4.167" />
                    </svg>
                </button>
            </>} 
        </div>
        {tabContent[activeTab]}
        </>
    )
}

export default TicketSelection