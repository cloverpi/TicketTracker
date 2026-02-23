import odbc from "odbc";
import { RegistrySettings } from "./settings";

let conn: odbc.Connection | undefined = undefined;
const connectionSettings = {
  user: '',
  pass: ''
}

export function connectionProperties(settings: RegistrySettings) {
  connectionSettings.user = settings.user;
  connectionSettings.pass = settings.pass;
}

export async function connect() {
  if (!conn) {
    console.log('Connecting to DB.')
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
  `);
  return [...result];
}

export async function findByPhone(phone: string) {
  if (!/\d/.test(phone)) return [];
  const digits = phone.replace(/\D/g, "");
  const noDigits = phone.replace(/\d/g, "");
  if (noDigits.length >= digits.length) return [];

  const phoneQuery = `%${digits.slice(0, 3)}%${digits.slice(3, 6)}%${digits.slice(6)}%`;

  const result = await sendQuery(`
    SELECT *
    FROM cust
    WHERE Phone LIKE '${phoneQuery}'
    LIMIT 7
  `);

  return [...result];
}

export async function findByCompanyName(company: string) {

  const companyQuery = `%${company.replaceAll(' ', '%').toUpperCase()}%`

  const result = await sendQuery(`
    SELECT *
    FROM cust
    WHERE company LIKE '${companyQuery}'
    LIMIT 7
  `);

  return [...result];
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
    WHERE company = "${company}"
    ORDER BY serviceid DESC
    LIMIT 6
  `);
  return [...result];
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