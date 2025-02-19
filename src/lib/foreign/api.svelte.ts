import { browser } from '$app/environment';
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
	type TicketReq
} from './types';

const endpoints = {
	flights: '/api/Flight/GetFlights',
	login: '/login',
	register: '/register',
	tickets: '/api/Ticket/Tickets'
};

function loadStore(): { auth: AuthGood; mail: string } | null {
	if (!browser) {
		return null;
	}
	const local_storage = localStorage.getItem('auth');
	if (local_storage === null) {
		return null;
	}
	const parsed = JSON.parse(local_storage);
	if (parsed.auth === null || parsed.auth === undefined || parsed.mail === '') {
		return null;
	}
	return parsed;
}

function saveStore(store?: { mail: string; auth: AuthGood }): void {
	if (!browser) {
		return;
	}
	if (store === undefined) {
		localStorage.removeItem('auth');
		return;
	}
	localStorage.setItem('auth', JSON.stringify(store));
}

export class FlightsAPI {
	url: string;
	mail: string = $state('');
	auth: AuthGood | null = $state(null);

	constructor(url: string) {
		this.url = url;
		const store = loadStore();
		if (store !== null) {
			this.mail = store.mail;
			this.auth = store.auth;
		}
	}

	isAuthed(): boolean {
		return this.auth !== null && this.mail !== '';
	}

	async getFlights(): Promise<Flight[]> {
		return fetch(this.url + endpoints.flights).then((response) => response.json());
	}

	async getTickets(): Promise<Ticket[]> {
		const token = this.auth!.accessToken;
		return fetch(this.url + endpoints.tickets, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then((response) => response.json());
	}

	// TODO: type the response
	async buyTicket(ticket: TicketReq): Promise<any> {
		const token = this.auth!.accessToken;
		return fetch(this.url + endpoints.tickets, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(ticket, ['ticketType', ...Object.keys(ticket)])
		});
	}

	reset(): void {
		this.auth = null;
		this.mail = '';
		saveStore();
	}

	async login(email: string, password: string): Promise<Auth> {
		this.mail = email;

		return fetch(this.url + endpoints.login, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
				twoFactorCode: 'string',
				twoFactorRecoveryCode: 'string'
			})
		})
			.then((response) => response.json())
			.then((auth) => {
				if (isAuthBad(auth)) {
					this.auth = null;
					return auth;
				}
				this.auth = auth;
				saveStore({ mail: email, auth });
				return auth;
			});
	}

	async register(email: string, password: string): Promise<Register> {
		return fetch(this.url + endpoints.register, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		}).then((response) => (response.status == 200 ? void {} : response.json()));
	}
}

export function isAuthBad(auth: Auth): auth is AuthBad {
	return (auth as any).accessToken == undefined;
}

export function isCargoFlight(flight: Flight): flight is FlightCargo {
	return flight.flightType === FlightType.Cargo;
}

export function isPassengerFlight(flight: Flight): flight is FlightPassenger {
	return flight.flightType === FlightType.Passenger;
}

export function isCargoTicket(ticket: Ticket): ticket is TicketCargo {
	return ticket.ticketType === FlightType.Cargo;
}

export function isPassengerTicket(ticket: Ticket): ticket is TicketPassenger {
	return ticket.ticketType === FlightType.Passenger;
}

export function toTicket(type: FlightType): TicketReqType {
	return type === FlightType.Cargo ? TicketReqType.Cargo : TicketReqType.Passenger;
}

export function isRegisterBad(register: Register): register is RegisterBad {
	return (register as any).type === 'https://tools.ietf.org/html/rfc9110#section-15.5.1';
}

export function date(date: string): string {
	return new Date(date).toLocaleString();
}
