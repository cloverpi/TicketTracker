export type Company = {
    id?: string,
    company: string,
    city?: string,
    contact?: string,
    phone?: string,
    email?: string,
    defbranch?: string,
    hardware: boolean,
    hrdwexpiry?: Date,
    software: boolean,
    sftwexpiry?: Date,
    rmactive: boolean,
    rmacexpiry?: Date,
    cod?: boolean,
    codreason?: string,
    subscript?: boolean,
}

export type Ticket = {
    serviceid?: string,
    company: string,
    product?: string,
    model?: string,
    serialnum?: string,
    daterec?: Date,
    datecomp?: Date,
    cod?: boolean,
    priority?: boolean,
    completed?: boolean,
    tech?: string,
    calltype?: string,
    branch?: string,
    problem?: string,
    solution?: string,
    software?: boolean,
    hardware?: boolean,
    rmmonitor?: boolean,
    minutes?: number,
}

export type CompanyTicket = Company & Ticket;

export function asString(v: unknown): string | undefined {
    if (typeof v == "string" && v.trim() != "") return v;
}

export function asNumber(v: unknown): number | undefined {
    if (typeof v == "number") return v;
    if (typeof v == "string" && v != "") {
        const n = Number(v);
        if (!Number.isNaN(n)) return n;
    }
}

export function asBoolean(v: unknown): boolean {
    return v === true || v === 1 || v === "1";
}

export function asDate(v: unknown): Date | undefined {
    if (v instanceof Date) return v
    if (typeof v == "string" || typeof v == "number") {
        const d = new Date(v);
        if (!isNaN(d.getTime())) return d;
    }
}

export function decodeCompany(row: Record<string, unknown>): Company {
    return {
        id: asString(row.id),
        company: asString(row.company) ?? '',
        city: asString(row.city),
        contact: asString(row.contact),
        phone: asString(row.phone),
        email: asString(row.email),
        defbranch: asString(row.defbranch),
        hardware: asBoolean(row.hardware),
        hrdwexpiry: asDate(row.hrdwexpiry),
        software: asBoolean(row.software),
        sftwexpiry: asDate(row.sftwexpiry),
        rmactive: asBoolean(row.rmactive),
        rmacexpiry: asDate(row.rmacexpiry),
        cod: asBoolean(row.cod),
        codreason: asString(row.codreason),
        subscript: asBoolean(row.subscript),
    };
}

export function decodeTicket(row: Record<string, unknown>): Ticket {
    return {
        serviceid: asString(row.serviceid),
        company: asString(row.company) ?? "",
        product: asString(row.product),
        model: asString(row.model),
        serialnum: asString(row.serialnum),
        daterec: asDate(row.daterec),
        datecomp: asDate(row.datecomp),
        cod: asBoolean(row.cod),
        priority: asBoolean(row.priority),
        completed: asBoolean(row.completed),
        tech: asString(row.tech),
        calltype: asString(row.calltype),
        branch: asString(row.branch),
        problem: asString(row.problem),
        solution: asString(row.solution),
        software: asBoolean(row.software),
        hardware: asBoolean(row.hardware),
        rmmonitor: asBoolean(row.rmmonitor),
        minutes: asNumber(row.minutes),
    };
}

export function decodeCompanyTicket(row: Record<string, unknown>): CompanyTicket {
    const company = decodeCompany(row);
    const ticket = decodeTicket(row);

    return { ...company, ...ticket }
}

export function decodeCompanyRows<T extends Record<string, unknown>>(rows: T[]) {
    return rows.map(r => decodeCompany(r));
}

export function decodeTicketRows<T extends Record<string, unknown>>(rows: T[]) {
    return rows.map(r => decodeTicket(r));
}

export function normalizeKeys<T extends Record<string, unknown>>(row: T) {
    const newRow: Record<string, unknown> = {}
    Object.keys(row).forEach((r) => newRow[r.toLowerCase()] = row[r]);
    return newRow;
}

export function normalizeRows<T extends Record<string, unknown>>(rows: T[]) {
    return rows.map(r => normalizeKeys(r))
}

