document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    flatpickr("#depart-date", {
        dateFormat: "Y-m-d",
        minDate: "today",
    });

    flatpickr("#return-date", {
        dateFormat: "Y-m-d",
        minDate: "today",
    });

    // Sample flight data
    const availableFlights = [
        {
            id: 'FL001',
            departure: 'New York',
            arrival: 'London',
            departDate: '2025-12-01',
            returnDate: '2025-12-08',
            price: '$499',
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
            price: '$199',
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
            price: '$699',
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
            price: '$299',
            airline: 'SkyWings',
            departTime: '09:00',
            arrivalTime: '21:00',
            duration: '12h',
            stops: 'Non-stop'
        }
    ];

    // Search form handler
    const flightSearchForm = document.getElementById('flight-search-form');
    flightSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchData = {
            flightId: document.getElementById('flight-id').value,
            departure: document.getElementById('departure').value,
            arrival: document.getElementById('arrival').value,
            departDate: document.getElementById('depart-date').value,
            returnDate: document.getElementById('return-date').value
        };

        const filteredFlights = availableFlights.filter(flight => {
            return (!searchData.flightId || flight.id.toLowerCase().includes(searchData.flightId.toLowerCase())) &&
                   (!searchData.departure || flight.departure.toLowerCase().includes(searchData.departure.toLowerCase())) &&
                   (!searchData.arrival || flight.arrival.toLowerCase().includes(searchData.arrival.toLowerCase())) &&
                   (!searchData.departDate || flight.departDate === searchData.departDate);
        });

        displayFlights(filteredFlights);
    });

    function displayFlights(flights) {
        const resultsSection = document.getElementById('search-results');
        const resultsGrid = resultsSection.querySelector('.results-grid');
        
        resultsGrid.innerHTML = '';
        
        if (flights.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-plane-slash"></i>
                    <h3>No flights found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
        } else {
            flights.forEach(flight => {
                const flightCard = document.createElement('div');
                flightCard.className = 'flight-card';
                flightCard.innerHTML = `
                    <div class="flight-header">
                        <span class="airline">
                            <i class="fas fa-plane"></i> ${flight.airline}
                        </span>
                        <span class="flight-id">${flight.id}</span>
                    </div>
                    <div class="flight-details">
                        <div class="route">
                            <div class="departure">
                                <h4>${flight.departure}</h4>
                                <p>${flight.departTime}</p>
                            </div>
                            <div class="flight-path">
                                <span class="duration">${flight.duration}</span>
                                <div class="path-line"></div>
                                <span class="stops">${flight.stops}</span>
                            </div>
                            <div class="arrival">
                                <h4>${flight.arrival}</h4>
                                <p>${flight.arrivalTime}</p>
                            </div>
                        </div>
                        <div class="flight-info">
                            <div class="dates">
                                <p><i class="fas fa-calendar"></i> ${flight.departDate}</p>
                                <p><i class="fas fa-calendar-check"></i> ${flight.returnDate}</p>
                            </div>
                            <div class="price">
                                <h3>${flight.price}</h3>
                                <button class="btn btn-primary book-flight" onclick="handleBooking('${flight.id}')">
                                    <i class="fas fa-ticket-alt"></i> Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                resultsGrid.appendChild(flightCard);
            });
        }
        
        resultsSection.classList.remove('hidden');
    }

    function generateBookingId() {
        return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    function generateSeatNumber() {
        const row = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const number = Math.floor(Math.random() * 6) + 1;
        return row + number;
    }

    window.handleBooking = function(flightId) {
        const flight = availableFlights.find(f => f.id === flightId);
        const modal = document.getElementById('booking-modal');
        const bookingId = generateBookingId();
        const seatNumber = generateSeatNumber();

        document.getElementById('booking-id').textContent = bookingId;
        document.getElementById('flight-details').textContent = 
            `${flight.id} - ${flight.departure} to ${flight.arrival}`;
        document.getElementById('seat-number').textContent = seatNumber;
        document.getElementById('flight-price').textContent = flight.price;

        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.style.display = 'none';
        
        window.onclick = (event) => {
            if (event.target === modal) modal.style.display = 'none';
        }

        const bookingForm = document.getElementById('booking-form');
        bookingForm.onsubmit = (e) => {
            e.preventDefault();
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;

            modal.innerHTML = `
                <div class="modal-content">
                    <div class="success-message">
                        <i class="fas fa-check-circle success-icon"></i>
                        <h2>Booking Confirmed!</h2>
                        <p>Your flight has been successfully booked.</p>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <span class="label">Passenger</span>
                            <span class="value">${firstName} ${lastName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Booking ID</span>
                            <span class="value">${bookingId}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Flight</span>
                            <span class="value">${flight.id}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Route</span>
                            <span class="value">${flight.departure} → ${flight.arrival}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Date</span>
                            <span class="value">${flight.departDate}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Seat</span>
                            <span class="value">${seatNumber}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Price</span>
                            <span class="value">${flight.price}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-home"></i> Return to Home
                    </button>
                </div>
            `;
        };
    };

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 200
    });
});
