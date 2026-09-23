// DOM Element Selectors
const navButtons = document.querySelectorAll('nav button');
const allSections = document.querySelectorAll('.page-section');
const bookingForm = document.getElementById('bookingForm');
const bookingTableBody = document.getElementById('bookingTableBody');
const searchInput = document.getElementById('searchInput');

const occupiedRoomsEl = document.getElementById('occupiedRooms');
const availableRoomsEl = document.getElementById('availableRooms');
const todayCheckinsEl = document.getElementById('todayCheckins');
const totalRevenueEl = document.getElementById('totalRevenue');
const occupancyRateEl = document.getElementById('occupancyRate');

const defaultBookings = [
    { name: "John Doe", room: "Executive Suite", date: "2026-09-23", nights: 2, price: 300, status: "Confirmed" },
    { name: "Jane Smith", room: "Double Room", date: "2026-09-24", nights: 1, price: 80, status: "Pending" }
];

let bookings = JSON.parse(localStorage.getItem('hotelBookings')) || defaultBookings;

// Initial Load
renderTable();
updateDashboardCounters();
renderRoomGrid();

// 1. Navigation Button Logic
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        const btnText = button.innerText.toUpperCase();

        // Hide all page sections first
        allSections.forEach(sec => sec.classList.add('hidden'));

        if (btnText === 'DASHBOARD') {
            document.getElementById('dashboard-section').classList.remove('hidden');
            document.getElementById('rooms-section').classList.remove('hidden');
            document.getElementById('booking-section').classList.remove('hidden');
            document.getElementById('table-section').classList.remove('hidden');
        } else if (btnText === 'ROOMS') {
            document.getElementById('rooms-section').classList.remove('hidden');
        } else if (btnText === 'GUEST' || btnText === 'RESERVATIONS' || btnText === 'PAYMENT') {
            document.getElementById('booking-section').classList.remove('hidden');
            document.getElementById('table-section').classList.remove('hidden');
        } else if (btnText === 'STAFF') {
            document.getElementById('staff-section').classList.remove('hidden');
        } else if (btnText === 'REPORTS') {
            document.getElementById('reports-section').classList.remove('hidden');
        }
    });
});

// 2. Render Reservations Table
function renderTable() {
    bookingTableBody.innerHTML = '';
    bookings.forEach((b, index) => {
        const statusClass = b.status.toLowerCase() === 'confirmed' ? 'confirmed' : 'pending';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${b.name}</td>
            <td>${b.room}</td>
            <td>${b.date}</td>
            <td>${b.nights}</td>
            <td>$${b.price}</td>
            <td><span class="status ${statusClass}">${b.status}</span></td>
            <td><button class="action-btn checkout-btn" data-index="${index}">Check Out</button></td>
        `;
        bookingTableBody.appendChild(row);
    });
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
}

// 3. Render Room Status Grid
function renderRoomGrid() {
    const roomGrid = document.getElementById('roomGrid');
    if (!roomGrid) return;

    roomGrid.innerHTML = '';
    for (let i = 1; i <= 16; i++) {
        const roomNum = 100 + i;
        const isOccupied = i <= bookings.length;

        const card = document.createElement('div');
        card.className = room-card ${isOccupied ? 'occupied' : 'available'};
        card.innerHTML = `
            <div>Room ${roomNum}</div>
            <p>${isOccupied ? 'Occupied' : 'Vacant'}</p>
        `;
        roomGrid.appendChild(card);
    }
}

// 4. Update Counters & Metrics
function updateDashboardCounters() {
    const totalRooms = 50;
    const occupied = bookings.length;
    const available = Math.max(0, totalRooms - occupied);
    const revenue = bookings.reduce((sum, item) => sum + item.price, 0);
    const rate = Math.round((occupied / totalRooms) * 100);

    if (occupiedRoomsEl) occupiedRoomsEl.innerText = occupied;
    if (availableRoomsEl) availableRoomsEl.innerText = available;
    if (todayCheckinsEl) todayCheckinsEl.innerText = bookings.length;
    if (totalRevenueEl) totalRevenueEl.innerText = $${revenue};
    if (occupancyRateEl) occupancyRateEl.innerText = ${rate}%;
}

// 5. Booking Form Submission
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const roomSelect = document.getElementById('roomType');
        const pricePerNight = parseInt(roomSelect.options[roomSelect.selectedIndex].getAttribute('data-price'));
        const nights = parseInt(document.getElementById('nights').value);

        const newBooking = {
            name: document.getElementById('guestName').value,
            room: roomSelect.value,
            date: document.getElementById('checkIn').value,
            nights: nights,
            price: pricePerNight * nights,
            status: "Confirmed"
        };

        bookings.push(newBooking);
        renderTable();
        renderRoomGrid();
        updateDashboardCounters();

        alert(Success! Booked for ${newBooking.name}. Total: $${newBooking.price});
        bookingForm.reset();
    });
}

// 6. Check Out Action
bookingTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        const index = e.target.getAttribute('data-index');
        if (confirm(Check out ${bookings[index].name}?)) {
            bookings.splice(index, 1);
            renderTable();
            renderRoomGrid();
            updateDashboardCounters();
        }
    }
});

// 7. Live Search
if (searchInput) {
    searchInput.addEventListener('keyup', () => {
        const filter = searchInput.value.toLowerCase();
        const rows = bookingTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const guestName = row.children[0].innerText.toLowerCase();
            row.style.display = guestName.includes(filter) ? '' : 'none';
        });
    });
}

// 8. CSV Export & Print Handlers
document.getElementById('exportBtn')?.addEventListener('click', () => {
    let csv = "Guest Name,Room Type,Check-In,Nights,Total Price,Status\n";
    bookings.forEach(b => csv += "${b.name}","${b.room}","${b.date}","${b.nights}","${b.price}","${b.status}"\n);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'hotel_report.csv';
    link.click();
});

document.getElementById('printBtn')?.addEventListener('click', () => window.print());

// 9. Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.innerText = '☀️ Light Mode';
}

themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});