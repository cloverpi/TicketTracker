import odbc from "odbc";
import { RegistrySettings } from "./settings";
import { CompanyTicket, CompanyTicketDBInsert, decodeCompanyRows, decodeCompanyTicketRows, decodeTicketRows, normalizeRows } from "./dbTypes";

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

function toDateString(date: Date): string {
  // {d '2026-03-01'}  yyyy-mm-dd
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `{d '${year}-${month}-${day}'}`
}

function convertToDBString(value: string | number | boolean | Date | undefined | null): string {
  if ( value == null ) return 'NULL';
  switch(typeof value) {
    case 'string':
      if (value.length == 0) return 'NULL'
      return `'${sqlEscape(value)}'`;
    case 'number':
      return `${value}`
    case 'boolean':
      return `${value ? 1 : 0}`;
    case 'object':
      if (value instanceof Date) {
        return toDateString(value);
      }
  }
  const _exhaustive: never = value;
  throw new Error("Unhandled type");
}

function convertCompanyTicketToDBStrings(companyTicket: CompanyTicket): CompanyTicketDBInsert {
  const companyTicketStrings = {} as CompanyTicketDBInsert;
  for (const k in companyTicket) {
    companyTicketStrings[k as keyof CompanyTicketDBInsert] =
      convertToDBString(companyTicket[k as keyof CompanyTicket]);
  }

  return companyTicketStrings;
}

function sqlEscape(value: string): string {
  return String(value).replace(/'/g, "''");
}

function eq(field: string, value: string | number | boolean | undefined | null){
  if (value == null) return ` ${field} = NULL `
  switch(typeof value) {
    case 'string':
      return ` ${field} = '${sqlEscape(value)}' `
    case 'number':
      return ` ${field} = ${value} `
    case 'boolean':
      return ` ${field} = ${value ? 1 : 0 } ` 
  }
}

function like(field: string, value: string) {
  return ` UPPER(${field}) LIKE '%${sqlEscape(value.replaceAll(' ', '%').toUpperCase())}%' `
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
    FROM servtrack
    INNER JOIN cust ON TRIM(cust.company) = TRIM(servtrack.company)
    WHERE ${eq('completed', false)}
    ORDER BY serviceid DESC
  `) as Record<string, unknown>[];
  const normalizedResult = normalizeRows([...result]);
  return decodeCompanyTicketRows(normalizedResult);
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
  const result = await sendQuery(`
    SELECT *
    FROM cust
    WHERE ${like('company', company)}
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
    WHERE ${eq('company', company)}
    ORDER BY serviceid DESC
    LIMIT 6
  `) as Record<string, unknown>[];
  const normalizedResult = normalizeRows([...result])
  return decodeTicketRows(normalizedResult);
}

async function getLastTicketNumber() {
    const [result] = await sendQuery(`
      SELECT serviceid
      FROM servtrack
      ORDER BY serviceid DESC
      LIMIT 1
    `) as Record<string, string>[];
    return result.serviceid;
}

async function insertNewTicket(dbSafeCompanyTicket: CompanyTicketDBInsert) {
  const defaultValues = {charge: 1, waiting: 0, cancelled: 0, current: 0};
  const result = await sendQuery(`
    INSERT INTO servtrack (serviceid, company, product, model, serialnum, daterec, charge, cod, completed, cancelled, waiting, tech, datecomp, problem, calltype, current, branch, solution, software, hardware, rmmonitor, minutes)
    VALUES (${dbSafeCompanyTicket.serviceid}, 
            ${dbSafeCompanyTicket.company},
            ${dbSafeCompanyTicket.product},
            ${dbSafeCompanyTicket.model},
            ${dbSafeCompanyTicket.serialnum},
            ${dbSafeCompanyTicket.daterec},
            ${defaultValues.charge},
            ${dbSafeCompanyTicket.cod},
            ${dbSafeCompanyTicket.completed},
            ${defaultValues.cancelled},
            ${defaultValues.waiting},
            ${dbSafeCompanyTicket.tech},
            ${dbSafeCompanyTicket.datecomp},
            ${dbSafeCompanyTicket.problem},
            ${dbSafeCompanyTicket.calltype},
            ${defaultValues.current},
            ${dbSafeCompanyTicket.branch},
            ${dbSafeCompanyTicket.solution},
            ${dbSafeCompanyTicket.software},
            ${dbSafeCompanyTicket.hardware},
            ${dbSafeCompanyTicket.rmactive},
            ${dbSafeCompanyTicket.minutes}
            );
    `);
}

async function updateExistingTicket(dbSafeCompanyTicket: CompanyTicketDBInsert, ticketNumber: number) {
  const result = await sendQuery(`
      UPDATE servtrack SET
      product    =   ${dbSafeCompanyTicket.product},
      model      =   ${dbSafeCompanyTicket.model},
      serialnum  =   ${dbSafeCompanyTicket.serialnum},
      daterec    =   ${dbSafeCompanyTicket.daterec},
      completed  =   ${dbSafeCompanyTicket.completed},
      tech       =   ${dbSafeCompanyTicket.tech},
      datecomp   =   ${dbSafeCompanyTicket.datecomp},
      problem    =   ${dbSafeCompanyTicket.problem},
      calltype   =   ${dbSafeCompanyTicket.calltype},
      branch     =   ${dbSafeCompanyTicket.branch},
      solution   =   ${dbSafeCompanyTicket.solution},
      minutes    =   ${dbSafeCompanyTicket.minutes}
      WHERE CAST(serviceid AS INTEGER) = ${ticketNumber}
  `);
  console.log(result);
}

async function updateSystemTicketNumber(ticketNumber: string) {
  const result = await sendQuery(`
      UPDATE system SET
      ${eq('serviceid', ticketNumber)}
  `);
}

async function updateCompany(dbSafeCompanyTicket: CompanyTicketDBInsert) {
  const result = await sendQuery(`
      UPDATE cust SET
      contact    =   ${dbSafeCompanyTicket.contact},
      phone      =   ${dbSafeCompanyTicket.phone},
      email      =   ${dbSafeCompanyTicket.email}
      WHERE UPPER(company) = ${dbSafeCompanyTicket.company.toLocaleUpperCase()}
  `);
}

export async function updateCompanyTicket(oldCompanyTicket: CompanyTicket, newCompanyTicket: CompanyTicket) {
  if (newCompanyTicket.serviceid != undefined) {
    let completed = false;
    if (newCompanyTicket.datecomp != undefined) completed = true;
    newCompanyTicket = { ...newCompanyTicket, completed };
    if (newCompanyTicket.serviceid == undefined) return;  //fucking Typescript.

    const dbSafeCompanyTicket = convertCompanyTicketToDBStrings(newCompanyTicket);
    await updateExistingTicket(dbSafeCompanyTicket, +newCompanyTicket.serviceid);
  } else {
    let serviceid = await getLastTicketNumber();
    if (!serviceid) return;
    serviceid = ( +serviceid + 1 ).toString();
    let completed = false;
    if (newCompanyTicket.datecomp != undefined) completed = true;
    newCompanyTicket = { ...newCompanyTicket, serviceid, completed };
    const dbSafeCompanyTicket = convertCompanyTicketToDBStrings(newCompanyTicket);
    await insertNewTicket(dbSafeCompanyTicket);
    await updateSystemTicketNumber( ( +serviceid + 1 ).toString() )
  }

  if ( oldCompanyTicket.phone != newCompanyTicket.phone || 
       oldCompanyTicket.email != newCompanyTicket.email ||
       oldCompanyTicket.contact != newCompanyTicket.contact 
   ) {
    const dbSafeCompanyTicket = convertCompanyTicketToDBStrings(newCompanyTicket);
    updateCompany(dbSafeCompanyTicket);
     // console.log('update company');
     //update Company table.
   }

  // find if new ticket or existing.
  // if new, get new serviceid and add it to newTicket and update the system table.
  // find if contact, phone, or email have changed and update those fields.

  return true;
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