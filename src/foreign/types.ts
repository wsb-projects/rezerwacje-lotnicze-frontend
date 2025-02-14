// ###############
// ### Flights ###
// ###############

export enum FlightType {
  Passenger = 0,
  Cargo = 1,
}

interface FlightBase {
  flightType: FlightType
  id: number
  departureLocation: string
  departureDate: string
  arrivalLocation: string
  arrivalDate: string
}

export interface FlightCargo extends FlightBase {
  flightType: FlightType.Cargo
  cargoWeight: number
  cargoVolume: number
}

export interface FlightPassenger extends FlightBase {
  flightType: FlightType.Passenger
  seatsCapacity: number
  seatPrice: number
}

export type Flight = FlightCargo | FlightPassenger

// ###############
// ### Tickets ###
// ###############

export type TicketType = FlightType

interface TicketBase {
  ticketType: TicketType
  id: number
  flight: Flight
}

export interface TicketCargo extends TicketBase {
  ticketType: FlightType.Cargo
  cargoWeight: number
  cargoVolume: number
}

export interface TicketPassenger extends TicketBase {
  ticketType: FlightType.Passenger
  numberOfSeats: number
}

export type Ticket = TicketCargo | TicketPassenger

// ###

export enum TicketReqType {
  Cargo = 'cargo',
  Passenger = 'passenger',
}

interface TicketReqBase {
  ticketType: TicketReqType
  flightId: number
}

export interface TicketReqCargo extends TicketReqBase {
  ticketType: TicketReqType.Cargo
  weight: number
  volume: number
}

export interface TicketReqPassenger extends TicketReqBase {
  ticketType: TicketReqType.Passenger
  seats: number
}

export type TicketReq = TicketReqCargo | TicketReqPassenger

// ############
// ### Auth ###
// ############

export interface AuthGood {
  tokenType: 'Bearer'
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export interface AuthBad {
  type: string
  title: string
  status: number
  detail: string
}

export type Auth = AuthGood | AuthBad

export interface RegisterBad {
  type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1'
  title: string
  status: number
  errors: {
    [key: string]: string[]
  }
}
export type RegisterGood = void
export type Register = RegisterGood | RegisterBad
