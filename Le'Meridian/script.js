document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.booking-section');

    // --- DATE PICKER ---
    let checkInDate = null;
    let checkOutDate = null;
    const dateSummary = document.getElementById('date-summary');

    const monthNames = ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    let currentDate = new Date();

    const monthNameEl = document.querySelector('.month-name');
    const calendarBody = document.querySelector('.calendar tbody');
    const prevBtn = document.querySelectorAll('.nav-btn')[0];
    const nextBtn = document.querySelectorAll('.nav-btn')[1];

    function formatDisplayDate(date) {
        if (!date) return "";
        let day = dayNames[date.getDay()];
        let month = monthNames[date.getMonth()].substring(0,3);
        return `${day}, ${month} ${date.getDate()}`;
    }

    function updateDateSummary() {
        if (checkInDate && checkOutDate) {
            dateSummary.textContent = `${formatDisplayDate(checkInDate)} → ${formatDisplayDate(checkOutDate)}`;
        } else if (checkInDate) {
            dateSummary.textContent = `${formatDisplayDate(checkInDate)} → ?`;
        } else {
            dateSummary.textContent = "Select dates";
        }
    }

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        monthNameEl.textContent = `${monthNames[month]} ${year}`;
        calendarBody.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month+1, 0).getDate();

        let row = document.createElement('tr');
        for (let i=0; i<firstDay; i++) {
            let empty = document.createElement('td');
            empty.classList.add('disabled');
            row.appendChild(empty);
        }

        for (let day=1; day<=lastDate; day++) {
            if (row.children.length === 7) {
                calendarBody.appendChild(row);
                row = document.createElement('tr');
            }
            let cell = document.createElement('td');
            cell.textContent = day;
            let thisDate = new Date(year, month, day);

            // highlight selected
            if (checkInDate && thisDate.getTime() === checkInDate.getTime()) {
                cell.classList.add('selected');
            }
            if (checkOutDate && thisDate.getTime() === checkOutDate.getTime()) {
                cell.classList.add('selected');
            }

            cell.addEventListener('click', function() {
                if (!checkInDate || (checkInDate && checkOutDate)) {
                    checkInDate = thisDate;
                    checkOutDate = null;
                } else if (thisDate > checkInDate) {
                    checkOutDate = thisDate;
                } else {
                    checkInDate = thisDate;
                    checkOutDate = null;
                }
                updateDateSummary();
                renderCalendar(currentDate);
            });

            row.appendChild(cell);
        }
        while (row.children.length < 7) {
            let empty = document.createElement('td');
            empty.classList.add('disabled');
            row.appendChild(empty);
        }
        calendarBody.appendChild(row);
    }

    renderCalendar(currentDate);
    prevBtn.addEventListener('click', ()=>{ currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(currentDate); });
    nextBtn.addEventListener('click', ()=>{ currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(currentDate); });

    // --- ROOMS & GUESTS ---
    const roomsSummary = document.getElementById('rooms-summary');
    const counters = document.querySelectorAll('.counter');

    function updateRoomsSummary() {
        let vals = Array.from(counters).map(c=>parseInt(c.querySelector('.counter-value').textContent));
        let [rooms, adults, children] = vals;
        let txt = `${rooms} Room${rooms>1?'s':''}, ${adults} Adult${adults>1?'s':''}`;
        if (children>0) txt += `, ${children} Child${children>1?'ren':''}`;
        roomsSummary.textContent = txt;
    }

    counters.forEach(counter=>{
        const minus = counter.querySelectorAll('.counter-btn')[0];
        const plus = counter.querySelectorAll('.counter-btn')[1];
        const valueEl = counter.querySelector('.counter-value');

        minus.addEventListener('click', ()=>{
            let val = parseInt(valueEl.textContent);
            if (val>0) {
                valueEl.textContent = val-1;
                updateRoomsSummary();
            }
        });
        plus.addEventListener('click', ()=>{
            let val = parseInt(valueEl.textContent);
            valueEl.textContent = val+1;
            updateRoomsSummary();
        });
    });
    updateRoomsSummary();

    // --- RATES ---
    const rateSummary = document.getElementById('rate-summary');
    document.querySelectorAll('input[name="rate"]').forEach(radio=>{
        radio.addEventListener('change', ()=>{
            rateSummary.textContent = radio.parentNode.textContent.trim();
        });
    });

    // --- PANELS OPEN/CLOSE ---
    sections.forEach(section=>{
        const header = section.querySelector('.booking-header');
        const panel = section.querySelector('.booking-panel');
        const doneBtn = panel.querySelector('.done-btn');

        header.addEventListener('click', ()=>{
            sections.forEach(s=>s.querySelector('.booking-panel').classList.remove('active'));
            panel.classList.add('active');
        });

        doneBtn.addEventListener('click', ()=>{
            panel.classList.remove('active');
        });
    });
});
