import { useState } from 'react'
import SearchBar from './SearchBar'
import OpenTickets from './OpenTickets'

interface Prop {
    onSelect: (v: any) => void
}

function TicketSelection( {onSelect} : Prop ) {
    const [activeTab, setActiveTab] = useState('new');

    const tabs = [
        { id: "new", label: "New Ticket" },
        { id: "open", label: "Open Tickets" },
    ];

    const tabContent: Record<string, JSX.Element> = {
        new: <SearchBar onSelect={onSelect}/>,
        open: <OpenTickets />
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