class FlightDataService {
    constructor() {
        this.apiUrl = 'http://localhost:8000/api/Flight/GetFlights';
        this.processedFlights = [];
        this.isConnected = false;
        this.initialize();
    }

    async initialize() {
        this.isConnected = await this.checkConnection();
        await this.initializeFlightData();
    }

    async checkConnection() {
        try {
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                console.log('✅ Successfully connected to the flight database');
                return true;
            } else {
                console.log('❌ Database connection failed. Status:', response.status);
                console.log('💡 Using backup flight data');
                return false;
            }
        } catch (error) {
            console.log('❌ Unable to connect to the database:', error.message);
            console.log('💡 Using backup flight data');
            return false;
        }
    }

    async initializeFlightData() {
        const flights = await this.fetchAndProcessFlights();
        this.processedFlights = flights;
        console.log('✨ Flight data initialized successfully');
        console.log('📊 Total flights loaded:', flights.length);
    }

    async fetchAndProcessFlights() {
        if (this.isConnected) {
            try {
                const response = await fetch(this.apiUrl);
                const flights = await response.json();
                return this.processFlights(flights);
            } catch (error) {
                console.log('⚠️ Error fetching flights:', error.message);
                return this.processFlights(this.getBackupFlights());
            }
        }
        return this.processFlights(this.getBackupFlights());
    }

    async getFlights() {
        if (this.processedFlights.length === 0) {
            await this.initializeFlightData();
        }
        return this.processedFlights;
    }

    processFlights(flights) {
        return flights.map(flight => ({
            id: flight.id || flight.flightId || 'N/A',
            airline: flight.airline || 'N/A',
            departure: flight.departure || 'N/A',
            arrival: flight.arrival || 'N/A',
            departDate: flight.departureDate || flight.departDate || 'N/A',
            returnDate: flight.returnDate || 'N/A',
            departTime: flight.departureTime || flight.departTime || 'N/A',
            arrivalTime: flight.arrivalTime || 'N/A',
            duration: this.calculateDuration(
                flight.departureTime || flight.departTime, 
                flight.arrivalTime
            ),
            price: this.formatPrice(flight.price),
            stops: flight.stops || 'Non-stop'
        }));
    }

    calculateDuration(departTime, arrivalTime) {
        if (!departTime || !arrivalTime) return 'N/A';
        
        try {
            const [deptHours, deptMins] = departTime.split(':').map(Number);
            const [arrHours, arrMins] = arrivalTime.split(':').map(Number);
            
            let hoursDiff = arrHours - deptHours;
            let minsDiff = arrMins - deptMins;
            
            if (minsDiff < 0) {
                hoursDiff--;
                minsDiff += 60;
            }
            
            if (hoursDiff < 0) {
                hoursDiff += 24;
            }
            
            return minsDiff > 0 ? 
                `${hoursDiff}h ${minsDiff}m` : 
                `${hoursDiff}h`;
        } catch (error) {
            return 'N/A';
        }
    }

    formatPrice(price) {
        if (!price) return 'N/A';
        const numericPrice = parseFloat(price.toString().replace(/[^0-9.]/g, ''));
        return isNaN(numericPrice) ? 'N/A' : numericPrice.toFixed(2);
    }

    getBackupFlights() {
        return [
            {
                id: 'FL001',
                departure: 'New York',
                arrival: 'London',
                departDate: '2025-12-01',
                returnDate: '2025-12-08',
                price: '499',
                airline: 'SkyWings',
                departTime: '08:00',
                arrivalTime: '20:00',
                duration: '12h',
                stops: 'Non-stop'
            },
            {
                id: 'FL002',
                departure: 'London',
                arrival: 'Paris',
                departDate: '2023-12-01',
                returnDate: '2023-12-08',
                price: '199',
                airline: 'EuroJet',
                departTime: '10:30',
                arrivalTime: '12:00',
                duration: '1h 30m',
                stops: 'Non-stop'
            },
            {
                id: 'FL003',
                departure: 'Paris',
                arrival: 'Dubai',
                departDate: '2023-12-02',
                returnDate: '2023-12-09',
                price: '699',
                airline: 'Emirates',
                departTime: '14:00',
                arrivalTime: '23:30',
                duration: '9h 30m',
                stops: '1 stop'
            },
            {
                id: 'FL004',
                departure: 'New York',
                arrival: 'London',
                departDate: '2025-12-01',
                returnDate: '2025-12-08',
                price: '299',
                airline: 'SkyWings',
                departTime: '09:00',
                arrivalTime: '21:00',
                duration: '12h',
                stops: 'Non-stop'
            }
        ];
    }
}

// Initialize the service
const flightService = new FlightDataService();

// Add visual connection status to the webpage
document.addEventListener('DOMContentLoaded', async () => {
    const statusElement = document.createElement('div');
    statusElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1000;
    `;
    
    if (flightService.isConnected) {
        statusElement.style.backgroundColor = '#4CAF50';
        statusElement.textContent = '🟢 Connected to Database';
    } else {
        statusElement.style.backgroundColor = '#f44336';
        statusElement.textContent = '🔴 Using Backup Data';
    }
    
    document.body.appendChild(statusElement);
});
