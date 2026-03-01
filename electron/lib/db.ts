import odbc from "odbc";
import { RegistrySettings } from "./settings";
import { CompanyTicket, decodeCompanyRows, decodeTicketRows, normalizeRows } from "./dbTypes";

let conn: odbc.Connection | undefined = undefined;
const connectionSettings = {
  user: '',
  pass: ''
}

export function dbConnectionProperties(settings: RegistrySettings) {
  connectionSettings.user = settings.user;
  connectionSettings.pass = settings.pass;
}

export async function connect() {
  if (!conn) {
    console.log('Connecting to DB.');
    conn = await odbc.connect(`DSN=ChaseTrack;UID=${connectionSettings.user};PWD=${connectionSettings.pass}`);
  }
}

export async function testConnection(user: string, pass: string) {
  if (!user || !pass) return false;
  connectionSettings.user = user;
  connectionSettings.pass = pass;
  await connect();
  const res = await sendQuery(`
    SELECT *
    FROM System
    `);
  return res.length > 0;
}

export function sqlEscape(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  return String(value).replace(/'/g, "''");
}

async function sendQuery(q: string) {
  try {
    if (!!conn) {
      return await conn!.query(q);
    } else {
      await connect();
      return await conn!.query(q);
    }
  } catch (e) {
    console.log(e);
    return []; // --!
  }
}

// --!  Fix int,  should be bool.
export async function getOpenTickets() {
  const result = await sendQuery(`
    SELECT *
    FROM Servtrack
    WHERE completed = 0
  `) as Record<string, unknown>[];
  const normalizedResult = normalizeRows([...result]);
  return decodeTicketRows(normalizedResult);
}

export async function findByPhone(phone: string) {
  if (!/\d/.test(phone)) return [];
  const digits = phone.replace(/\D/g, "");
  const noDigits = phone.replace(/\d/g, "");
  if (noDigits.length >= digits.length) return [];

  const phoneQuery = sqlEscape(`%${digits.slice(0, 3)}%${digits.slice(3, 6)}%${digits.slice(6)}%`);

  const result = await sendQuery(`
    SELECT *
    FROM cust
    WHERE Phone LIKE '${phoneQuery}'
    LIMIT 7
  `) as Record<string, unknown>[];
  const normalizedResult = normalizeRows([...result]);
  return decodeCompanyRows(normalizedResult);
}

export async function findByCompanyName(company: string) {

  const companyQuery = sqlEscape(`%${company.replaceAll(' ', '%').toUpperCase()}%`)

  const result = await sendQuery(`
    SELECT *
    FROM cust
    WHERE company LIKE '${companyQuery}'
    LIMIT 7
  `) as Record<string, unknown>[];
  const normalizedResult = normalizeRows([...result]);
  return decodeCompanyRows(normalizedResult);
}

export async function findCompany(query: string) {
  const phoneQuery = await findByPhone(query);
  const companyNameQuyery = await findByCompanyName(query);

  return [...phoneQuery, ...companyNameQuyery]
}

export async function findLastTicketsByCompany(company: string) {
  const result = await sendQuery(`
    SELECT *
    FROM servtrack
    WHERE company = "${sqlEscape(company)}"
    ORDER BY serviceid DESC
    LIMIT 6
  `) as Record<string, unknown>[];
  const normalizedResult = normalizeRows([...result])
  return decodeTicketRows(normalizedResult);
}

async function getLastTicketNumber(company: string) {
    const [result] = await sendQuery(`
      SELECT serviceid
      FROM servtrack
      WHERE company = "${company}"
      ORDER BY serviceid DESC
      LIMIT 1
    `) as Record<string, string>[];
    console.log(result);
    return result.serviceid;
}

export async function updateCompanyTicket(oldCompanyTicket: CompanyTicket, newCompanyTicket: CompanyTicket) {
  if (!newCompanyTicket.serviceid) {
    let serviceid = await getLastTicketNumber(newCompanyTicket.company);
    if (!serviceid) return;
    serviceid = ( +serviceid + 1 ).toString()
    newCompanyTicket = {...newCompanyTicket, serviceid}
    //insert new row
    //update system table row.
  } else {
    //update serviceid row.
  }

  if ( oldCompanyTicket.phone != newCompanyTicket.phone || 
       oldCompanyTicket.email != newCompanyTicket.email ||
       oldCompanyTicket.contact != newCompanyTicket.contact 
   ) {
     //update Company table.
   }

  // find if new ticket or existing.
  // if new, get new serviceid and add it to newTicket and update the system table.
  // find if contact, phone, or email have changed and update those fields.
}

// async function run() {
//   try {

//     const rows = await sendQuery(`
//       SELECT
//         s.ticket,
//         s.company,
//         s.issue,
//         s.solution,
//         c.Phone,
//         c.contact
//       FROM ServTrack s
//       LEFT JOIN cust c
//         ON s.company = c.companyName
//     `);

//     // console.log(rows);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function justTickets() {
//   try {

//     const rows = await sendQuery(`
//       SELECT
//         s.ticket,
//         s.company,
//         s.issue,
//         s.solution
//       FROM ServTrack s
//       LEFT JOIN cust c
//         ON s.company = c.companyName
//       ORDER BY s.ticket DESC
//       LIMIT 5
//       OFFSET 5;
//     `);

//     console.log([...rows]);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function insertMoreTickets() {
//   const companies = ["Acme Corp", "Globex", "Initech"];
//   const issues = [
//     "Cannot print",
//     "PC won't boot",
//     "Email not sending",
//     "VPN not connecting",
//     "Internet slow",
//     "Keyboard not working",
//     "Monitor flickering",
//     "Software crash",
//     "File server unreachable",
//     "Password expired"
//   ];

//   const solutions = [
//     "Reinstalled printer driver and cleared queue",
//     "Replaced faulty power supply",
//     "Reconfigured SMTP settings",
//     "Reset VPN profile and credentials",
//     "Restarted router and cleared DNS cache",
//     "Replaced keyboard",
//     "Adjusted refresh rate and reseated cable",
//     "Updated application to latest version",
//     "Restarted file server service",
//     "Reset user password"
//   ];

//   let ticketNumber = 5;

//   for (let i = 0; i < 24; i++) {
//     const company = companies[i % companies.length];
//     const issue = issues[i % issues.length];
//     const solution = solutions[i % solutions.length];

//     const ticket = ticketNumber.toString().padStart(3, "0").padStart(7, " ");
//     ticketNumber++;

//     const sql = `
//       INSERT INTO ServTrack (ticket, company, issue, solution)
//       VALUES (
//         '${ticket}',
//         '${company}',
//         '${issue}',
//         '${solution}'
//       )
//     `;
//     try {
//       const result = await sendQuery(sql);
//       console.log(result);
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }

// insertMoreTickets();
// run();
// justTickets();
// findByPhone('306.7');