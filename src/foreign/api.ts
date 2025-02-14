import {
  FlightType,
  TicketReqType,
  type Auth,
  type AuthBad,
  type AuthGood,
  type Flight,
  type FlightCargo,
  type FlightPassenger,
  type Register,
  type RegisterBad,
  type Ticket,
  type TicketCargo,
  type TicketPassenger,
  type TicketReq,
} from './types'

const endpoints = {
  flights: '/api/Flight/GetFlights',
  login: '/login',
  register: '/register',
  tickets: '/api/Ticket/Tickets',
}

export class FlightsAPI {
  url: string
  auth: AuthGood | null = null

  constructor(url: string) {
    this.url = url
  }

  async getFlights(): Promise<Flight[]> {
    return fetch(this.url + endpoints.flights).then((response) => response.json())
  }

  async getTickets(): Promise<Ticket[]> {
    const token = this.auth!.accessToken
    return fetch(this.url + endpoints.tickets, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json())
  }

  // TODO: type the response
  async buyTicket(ticket: TicketReq): Promise<any> {
    const token = this.auth!.accessToken
    return fetch(this.url + endpoints.tickets, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticket, ['ticketType', ...Object.keys(ticket)]),
    })
  }

  async login(email: String, password: String): Promise<Auth> {
    return fetch(this.url + endpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        twoFactorCode: 'string',
        twoFactorRecoveryCode: 'string',
      }),
    }).then((response) => response.json())
  }

  async register(email: String, password: String): Promise<Register> {
    return fetch(this.url + endpoints.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((response) => (response.status == 200 ? void {} : response.json()))
  }
}

export function isAuthBad(auth: Auth): auth is AuthBad {
  return (auth as any).accessToken == undefined
}

export function isCargoFlight(flight: Flight): flight is FlightCargo {
  return flight.flightType === FlightType.Cargo
}

export function isPassengerFlight(flight: Flight): flight is FlightPassenger {
  return flight.flightType === FlightType.Passenger
}

export function isCargoTicket(ticket: Ticket): ticket is TicketCargo {
  return ticket.ticketType === FlightType.Cargo
}

export function isPassengerTicket(ticket: Ticket): ticket is TicketPassenger {
  return ticket.ticketType === FlightType.Passenger
}

export function toTicket(type: FlightType): TicketReqType {
  return type === FlightType.Cargo ? TicketReqType.Cargo : TicketReqType.Passenger
}

export function isRegisterBad(register: Register): register is RegisterBad {
  return (register as any).type === 'https://tools.ietf.org/html/rfc9110#section-15.5.1'
}

export function date(date: string): string {
  return new Date(date).toLocaleString()
}
