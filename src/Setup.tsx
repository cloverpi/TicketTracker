import { useState } from "react";

interface Props {
    onComplete: () => void;
}

function Setup( {onComplete}: Props ) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [teamviewerLocation, setTeamviewerLocation] = useState('C:\\Program Files (x86)\\TeamViewer\\TeamViewer.exe');
    const [error, setError] = useState(false);
  
    const handleUserChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.target.value);
    }

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value);
    }

    const handleTeamviewerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTeamviewerLocation(e.target.value);
    }

    const handleOpenDialog = async () => {
        const file = await window.app.selectTeamviewer();
        if (file) setTeamviewerLocation(file);

    }

    const handleSubmit = async () => {
        const res = await window.app.updateSettings({user, pass, displayName, teamviewerLocation});
        setError(!res);
        if (res) { 
            onComplete();
        }
    }

    return (
        <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <h2>Enter your credentials</h2>
                        <div className="form-floating mb-2">
                            <input type="text" className={`form-control ${error ? 'is-invalid' : ''}`} id="user" placeholder="" onChange={handleUserChange} />
                            <label htmlFor="user">DB Username</label>
                        </div>
                        <div className="form-floating mb-2">
                            <input type="password" className={`form-control ${error ? 'is-invalid' : ''}`} id="pass" placeholder="" onChange={handlePasswordChange} />
                            <label htmlFor="pass">DB Password</label>
                        </div>
                        <div className="form-floating mb-2">
                            <input type="text" className={`form-control ${error ? 'is-invalid' : ''}`} id="displayName" placeholder="" onChange={handleDisplayNameChange} />
                            <label htmlFor="displayName">Display Name</label>
                        </div>
                        <div className="input-group mb-2">
                            <button className="btn btn-outline-primary" type="button" id="teamviewerButton" onClick={handleOpenDialog}>Browse...</button>
                            <div className="form-floating">
                                <input id="teamviewerInput" type="text" value={teamviewerLocation} placeholder='' className="form-control" onChange={handleTeamviewerChange}/>
                                <label htmlFor="teamviewerInput">Select Teamviewer exe...</label>
                            </div>
                        </div>
                        <div className="col-4  mb-2 d-flex flex-column justify-content-end">
                            <button type="button" className="btn btn-primary" style={{width: '100%'}} onClick={handleSubmit}>Submit</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Setup;
