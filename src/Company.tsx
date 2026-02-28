import { CompanyTicket } from "../electron/lib/dbTypes"
import Popover from "./components/Popover";
import StopIcon from "./icon/StopIcon";
import WarningIcon from "./icon/WarningIcon";
import { titleCase } from "./lib/helpers";

interface Props {
  companyTicket: CompanyTicket
}
function Company({companyTicket}: Props) {

  const warning = (!companyTicket.hardware && !companyTicket.software && !companyTicket.rmactive)
  const error = (companyTicket.cod)
  
  const warningTooltip = 
  <>
      <strong><WarningIcon className="text-warning align-top" width={18} height={18}/>Warning</strong>
      <div>
        This client has no support. Please collect payment before proceeding.
      </div>
  </>

  const errorTooltip = 
  <>
      <strong><StopIcon className="text-danger align-top" width={18} height={18}/>COD</strong>
      <div>
        {`${companyTicket.codreason ? companyTicket.codreason : 'This client is COD. Please collect payment before proceeding.'}`}
      </div>
  </>

  const infoTooltip = 
  <>
    <strong>{companyTicket.company}</strong> <br />
    {titleCase(companyTicket.addr1)}<br />
    {titleCase(companyTicket.addr2)}<br />
    {titleCase(companyTicket.city)}<br />
    {titleCase(companyTicket.contact)} {companyTicket.phone}
  </>

  return (
    <>
        <h3 className="title">
        {warning && <Popover content={warningTooltip}>
          <WarningIcon className="text-warning align-top" width={28} height={28}/>
        </Popover>}
        {error && <Popover content={errorTooltip}>
          <StopIcon className="text-danger align-top" width={28} height={28}/>
        </Popover>}
        <Popover content={infoTooltip}>
          {titleCase(companyTicket?.company)}
        </Popover>
      </h3>

    </>
  )
}

export default Company