import { useEffect, useState } from "react";
import ComboTextField from "./components/ComboTextField";
import { CompanyTicket } from "../electron/lib/dbTypes";
import { getDateFromDateString, getDateString } from "./lib/helpers";

interface Prop {
  ticket: CompanyTicket;
  defaultTech?: string;
  onComplete: () => void;
}

function TicketEntry({ticket, defaultTech, onComplete}:Prop) {
  const [form, setForm] = useState({
    product: '',
    model: '',
    serialnum: '',
    email: '',
    contact: '',
    phone: '',
    calltype: '',
    branch: '',
    tech: '',
    problem: '',
    solution: '',
    daterec: '',
    datecomp: '',
    minutes: 0,
  })

  const handleFieldUpdate = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value
    })
  }

  const handleDateUpdate = (field: string, element: React.ChangeEvent<HTMLInputElement>) => {
    const value = element.target.value;
    handleFieldUpdate(field, value);
  }

  const onSubmit = async () =>{
    // console.log(form);
    const daterec = getDateFromDateString(form.daterec);
    const datecomp = getDateFromDateString(form.datecomp);
    const correctedForm = {...form, daterec, datecomp};
    console.log(correctedForm);
    const result = await window.api.updateCompanyTicket({oldCompany: ticket, newCompany: correctedForm})
    console.log(result);
    if (result) onComplete();
  }

  useEffect(()=> {
    console.log(ticket);
    setForm({
      ...ticket,
      product: ticket.product ?? '',
      model: ticket.model ?? '',
      serialnum: ticket.serialnum ?? '',
      email: ticket.email ?? '',
      contact: ticket.contact ?? '',
      phone: ticket.phone ?? '',
      calltype: ticket.calltype ?? '',
      branch: ticket.branch ?? ticket.defbranch ?? '',
      tech: ticket.tech ?? defaultTech ?? '',
      problem: ticket.problem ?? '',
      solution: ticket.solution ?? '',
      daterec: getDateString(ticket.daterec) ?? getDateString(new Date(), 'America/Regina') ?? '',
      datecomp: getDateString(ticket.datecomp) ?? '',
      minutes: ticket.minutes ?? 0,
    });
  }, [ticket, defaultTech]);

  return <>
    <ComboTextField
      id="product"
      tabIndex={50}
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
          <input
            type="text"
            className="form-control"
            id="model"
            placeholder="" 
            value={form.model}
            onChange={(element) => handleFieldUpdate('model', element.target.value)}
            />
          <label htmlFor="model">Model</label>
        </div>
      </div>
      <div className="col-6">
        <div className="form-floating mb-2">
          <input 
            type="text" 
            className="form-control" 
            id="serialnum" 
            placeholder=""
            value={form.serialnum}
            onChange={(element) => handleFieldUpdate('serialnum', element.target.value)}
            />
          <label htmlFor="serialnum">Serial</label>
        </div>
      </div>
    </div>
  
    <div className="row g-4">
      <div className="col-6">    
        <div className="form-floating mb-2">
          <input 
            type="text" 
            className="form-control" 
            id="contact" 
            placeholder="" 
            value={form.contact}
            onChange={(element) => handleFieldUpdate('contact', element.target.value)}
            />
          <label htmlFor="contact">Contact Name</label>
        </div>

        <div className="form-floating mb-2">
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            placeholder=""
            value={form.email}
            onChange={(element) => handleFieldUpdate('email', element.target.value)}
            />
          <label htmlFor="email">Email</label>
        </div>
      </div>


    <div className="col-6">  
      <div className="form-floating mb-2">
        <input 
          type="text" 
          className="form-control" 
          id="phone" 
          placeholder="" 
          value={form.phone}
          onChange={(element) => handleFieldUpdate('phone', element.target.value)}
        />
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
        <input 
          type="text" 
          className="form-control" 
          id="issue" 
          placeholder=""
          value={form.problem}
          onChange={(element) => handleFieldUpdate('problem', element.target.value)}
        />
        <label htmlFor="issue">Issue</label>
    </div>
    <div className="form-floating mb-2">
        <textarea 
          className="form-control" 
          id="solution" placeholder="" 
          style={{height: "110px", resize: "none"}}
          value={form.solution}
          onChange={(element) => handleFieldUpdate('solution', element.target.value)}
          />
        <label htmlFor="solution">Solution</label>
    </div>
    <div className="row">
      <div className="col-4">
        <div className="form-floating mb-2">
        <input
          maxLength={500}
          type="date"
          className="form-control"
          id="dateReceived"
          placeholder=""
          value={form.daterec}
          onChange={(t) => handleDateUpdate('daterec', t)}
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
            onChange={(t) => handleDateUpdate('datecomp', t)}
          />
          <label htmlFor="dateCompleted">Date Completed</label>
        </div>
      </div>
      <div className="col-4 d-flex flex-column justify-content-end">
        <div className="form-floating mb-2">
          <input
            type="number"
            className="form-control"
            id="billTime"
            placeholder="" 
            value={form.minutes}
            onChange={(element) => handleFieldUpdate('minutes', element.target.value)}
            />
          <label htmlFor="billTime">Minutes Billed</label>
        </div>
      </div>
      <div className="col-4  mb-2 d-flex flex-column justify-content-end">
        <button type="button" className="btn btn-primary" onClick={onSubmit} style={{width: '100%', height: '50%'}}>Submit</button>
      </div>

    </div>
  </>
}

export default TicketEntry;
