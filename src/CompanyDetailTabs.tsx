import { useCallback, useEffect, useState } from 'react'
import TicketAccourdian from './TicketAccourdian';
import CompanyTeamviewer from './CompanyTeamviewer';
import { findMatches } from './lib/helpers';
import { tvDevice } from '../electron/lib/teamviewer';
import { CompanyTicket } from '../electron/lib/dbTypes';
import Popover from './components/Popover';

interface Prop {
    companyTicket: CompanyTicket;
}

function CompanyDetailTabs( {companyTicket} : Prop ) {
    const [teamviewers, setTeamviewers] = useState<tvDevice[]>([]);
    const [filteredTeamviewers, setFilteredTeamviewers] = useState<tvDevice[]>([]);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [activeTab, setActiveTab] = useState('teamviewer');
    const [loading, setLoading] = useState(false);

    const timeout = 750;

    const tabs = [
        { id: "teamviewer", label: "Teamviewer" },
        { id: "tickets", label: "Previous Tickets" },
    ];

    const getTeamviewers =  useCallback(async (force: boolean) => {
        const devices = await window.api.getTeamviewerDevices({force}) as tvDevice[];
        setLoading(false);
        setTeamviewers(devices);
    }, [companyTicket]);

    useEffect(() => {
        const setFilters = async () => {
            const defaultQuery = await window.app.getPrefilledSearchDefault({companyName: companyTicket.company});
            if (defaultQuery) {
                const results = findMatches(teamviewers, defaultQuery);
                setFilteredTeamviewers(results);
            } else {
                const firstWord = companyTicket.company.split(' ')[0];
                const results = findMatches(teamviewers, firstWord)
                setFilteredTeamviewers(results);
            }
        }
        setFilters();
    }, [teamviewers, companyTicket.company]);

    useEffect(() => {
        setSearchFilter('');
    }, [companyTicket.company]);


    useEffect(() => {
        setLoading(true);
        getTeamviewers(false);
    }, [getTeamviewers]);

    const handleFilterChange = (value: string) => {
        clearTimeout(searchTimer);
        setSearchFilter(value);
        setSearchTimer(setTimeout(async () => {
            window.app.setPrefilledSearchDefault({companyName: companyTicket.company, query: value});
            getTeamviewers(false);
            clearTimeout(searchTimer);
        }, timeout));
    }

    const handleReload = () => {
        setLoading(true);
        getTeamviewers(true);
    }

    const tabContent: Record<string, JSX.Element> = {
        teamviewer: <CompanyTeamviewer devices={filteredTeamviewers}/>,
        tickets: <TicketAccourdian company={companyTicket.company} />
    }

    const tabHandler = (tabId: string) => {
        setActiveTab(tabId);
    };

      const searchOptionsTooltip = 
        <>
            <table className="table table-striped border mb-0"> 
                <thead>
                    <tr>
                        <th style={{width: '40px'}}></th>
                        <th>Description</th> 
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{textAlign: 'center'}}>+</td>
                        <td>Word must be present.</td>
                    </tr>
                    <tr>
                        <td style={{textAlign: 'center'}}>!</td>
                        <td>Word must <b>NOT</b> be present.</td>
                    </tr>
                    <tr>
                        <td style={{textAlign: 'center'}}>|</td>
                        <td>Word can be either word1 <b>OR</b> word2. eg: word1|word2</td>
                    </tr>
                </tbody>
            </table>
        </>

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
                <Popover content={searchOptionsTooltip}>
                    <input
                    type="text"
                    className="form-control "
                    style={{ width: "200px" }}
                    placeholder="Search"
                    value={searchFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    />
                </Popover>
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
                            strokeWidth="1.6667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`icon icon-tabler icons-tabler-outline icon-tabler-reload ${loading ? 'spin' : ''}`}
                            >
                            <path stroke="none" d="M0 0h20v20H0z" fill="none" />
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

export default CompanyDetailTabs