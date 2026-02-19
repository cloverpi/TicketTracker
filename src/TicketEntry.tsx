import { useState } from "react";
// import "./App.css";
import ComboTextField from "./components/ComboTextField";

function TicketEntry() {
  const [tech, setTech] = useState('');
  const [product, setProduct] = useState('');
  const [call, setCall] = useState('');
  const [branch, setBranch] = useState('');

  return <>
    <ComboTextField
      id="product"
      label="Product"
      options={[
        "Store Manager",
        "Restaurant Manager",
        "Global Restaurant",
        "Veloce",
        "Training/Setup",
        "Surveillance",
        "Sam4s",
        "Cash Register",
        "Networking",
        "Hardware"
      ]}
      value={product}
      onChange={setProduct}
    />
    <div className="row g-4">
      <div className="col-6">
        <div className="form-floating mb-2">
          <input type="text" className="form-control" id="model" placeholder="" />
          <label htmlFor="model">Model</label>
        </div>
      </div>
      <div className="col-6">
        <div className="form-floating mb-2">
          <input type="text" className="form-control" id="serial" placeholder="" />
          <label htmlFor="serial">Serial</label>
        </div>
      </div>
    </div>
  
  <div className="row g-4">
    <div className="col-6">
      
    <div className="form-floating mb-2">
      <input type="text" className="form-control" id="contact" placeholder="" />
      <label htmlFor="contact">Contact Name</label>
    </div>

    <div className="form-floating mb-2">
      <input type="email" className="form-control" id="email" placeholder="" />
      <label htmlFor="email">Email</label>
    </div>



      
    </div>

    {/* RIGHT SIDE */}
    <div className="col-6">
      
      <div className="form-floating mb-2">
        <input type="text" className="form-control" id="phone" placeholder="" />
        <label htmlFor="phone">Phone Number</label>
      </div>
      <ComboTextField
        id="call"
        label="Call Type"
        options={["Phone", "Remote", "Onsite", "In Shop", "Other"]}
        value={call}
        onChange={setCall}
      />
    

  </div>
  </div>
  <div className="row g-4">
    <div className="col-6">
      <ComboTextField
        id="branch"
        label="Branch"
        options={["Regina", "Saskatoon", "Other"]}
        value={branch}
        onChange={setBranch}
      />
      </div>
      <div className="col-6">
        <ComboTextField
          id="tech"
          label="Tech"
          options={["Al", "Caitlin", "Chris", "John", "Pete"]}
          value={tech}
          onChange={setTech}
        />
      </div>
    </div>
    <div className="form-floating mb-2">
        <input type="text" className="form-control" id="issue" placeholder=""/>
        <label htmlFor="issue">Issue</label>
    </div>
    <div className="form-floating mb-2">
        <textarea className="form-control" id="solution" placeholder="" style={{height: "110px", resize: "none"}}/>
        <label htmlFor="solution">Solution</label>
    </div>
    <div className="row">
      <div className="col-4">
        <div className="form-floating mb-2">
        <input
          type="date"
          className="form-control"
          id="dateReceived"
          placeholder=""
        />
        <label htmlFor="dateReceived">Date Received</label>
        </div>
          <div className="form-floating mb-2">
          <input
            type="date"
            className="form-control"
            id="dateCompleted"
            placeholder=""
          />
          <label htmlFor="dateCompleted">Date Completed</label>
        </div>
      </div>
      <div className="col-4 d-flex flex-column justify-content-end">
        <div className="form-floating mb-2">
          <input type="text" className="form-control" id="billTime" placeholder="" />
          <label htmlFor="billTime">Minutes Billed</label>
        </div>
      </div>
      <div className="col-4  mb-2 d-flex flex-column justify-content-end">
        <button type="button" className="btn btn-primary" style={{width: '100%', height: '50%'}}>Submit</button>
      </div>

    </div>
  </>
}

export default TicketEntry;
