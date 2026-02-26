import { useEffect, useState } from "react";
import ComboTextField from "./components/ComboTextField";
import { CompanyTicket } from "../electron/lib/dbTypes";
import { getDateString } from "./lib/helpers";

interface Prop {
  ticket: CompanyTicket;
  defaultTech?: string;
}

function TicketEntry({ticket, defaultTech}:Prop) {
  const [form, setForm] = useState({
    product: '',
    model: '',
    serial: '',
    email: '',
    contact: '',
    phone: '',
    calltype: '',
    branch: '',
    tech: '',
    daterec: '',
    datecomp: '',
  })

  const handleFieldUpdate = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value
    })
  }

  useEffect(()=> {
    setForm({
      ...ticket,
      product: ticket.product ?? '',
      model: ticket.model ?? '',
      serial: ticket.serialnum ?? '',
      email: ticket.email ?? '',
      contact: ticket.contact ?? '',
      phone: ticket.phone ?? '',
      calltype: ticket.calltype ?? '',
      branch: ticket.branch ?? '',
      tech: ticket.tech ?? defaultTech ?? '',
      daterec: getDateString(ticket.daterec) ?? getDateString(new Date()) ?? '',
      datecomp: getDateString(ticket.datecomp) ?? '',
    });
  }, [ticket, defaultTech]);

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
      value={form.product}
      onChange={(v) => handleFieldUpdate('product', v)}
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
        value={form.calltype}
        onChange={(v) => handleFieldUpdate('calltype', v)}
      />
    

  </div>
  </div>
  <div className="row g-4">
    <div className="col-6">
      <ComboTextField
        id="branch"
        label="Branch"
        options={["Regina", "Saskatoon", "Other"]}
        value={form.branch}
        onChange={(v) => handleFieldUpdate('branch', v)}
      />
      </div>
      <div className="col-6">
        <ComboTextField
          id="tech"
          label="Tech"
          options={["Al", "Caitlin", "Chris", "John", "Pete"]}
          value={form.tech}
          onChange={(v) => handleFieldUpdate('tech', v)}
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
          value={form.daterec}
        />
        <label htmlFor="dateReceived">Date Received</label>
        </div>
          <div className="form-floating mb-2">
          <input
            type="date"
            className="form-control"
            id="dateCompleted"
            placeholder=""
            value={form.datecomp}
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
