// ==========================================
//   1. LOGIKA JAM, GREETING & CUSTOM NAME
// ==========================================
const clockElement = document.getElementById('clock');
const greetingTextElement = document.getElementById('greeting-text');
const dateElement = document.getElementById('date');

const displayName = document.getElementById('display-name');
const inputName = document.getElementById('input-name');

// Ambil nama dari Local Storage, jika tidak ada default-nya 'Guest'
let namaUser = localStorage.getItem('userName') || 'Guest';
displayName.innerText = namaUser;

function updateDashboardWaktu() {
    const sekarang = new Date();

    // Jam Digital
    let jam = sekarang.getHours();
    let menit = sekarang.getMinutes();
    let detik = sekarang.getSeconds();
    jam = jam < 10 ? '0' + jam : jam;
    menit = menit < 10 ? '0' + menit : menit;
    detik = detik < 10 ? '0' + detik : detik;
    clockElement.innerText = `${jam}:${menit}:${detik}`;

    // Ucapan Selamat (Greeting)
    let ucapan = "Good Night";
    if (jam >= 5 && jam < 12) ucapan = "Good Morning";
    else if (jam >= 12 && jam < 17) ucapan = "Good Afternoon";
    else if (jam >= 17 && jam < 21) ucapan = "Good Evening";
    
    greetingTextElement.innerText = ucapan;

    // Tanggal
    const opsiTanggal = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerText = sekarang.toLocaleDateString('en-US', opsiTanggal);
}

// Fitur Mengubah Nama Kustom saat Teks Nama di-klik
displayName.addEventListener('click', () => {
    displayName.style.display = 'none';
    inputName.style.display = 'inline-block';
    inputName.value = namaUser;
    inputName.focus();
});

inputName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const namaBaru = inputName.value.trim();
        if (namaBaru !== '') {
            namaUser = namaBaru;
            localStorage.setItem('userName', namaUser);
            displayName.innerText = namaUser;
        }
        inputName.style.display = 'none';
        displayName.style.display = 'inline-block';
    }
});

inputName.addEventListener('blur', () => {
    inputName.style.display = 'none';
    displayName.style.display = 'inline-block';
});

setInterval(updateDashboardWaktu, 1000);
updateDashboardWaktu();


// ==========================================
//        2. LOGIKA FOCUS TIMER
// ==========================================
const timerDisplay = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');

let waktuTersisa = 25 * 60; 
let timerInterval = null;

function updateTampilanTimer() {
    let menit = Math.floor(waktuTersisa / 60);
    let detik = waktuTersisa % 60;
    menit = menit < 10 ? '0' + menit : menit;
    detik = detik < 10 ? '0' + detik : detik;
    timerDisplay.innerText = `${menit}:${detik}`;
}

function startTimer() {
    if (timerInterval !== null) return;
    timerInterval = setInterval(() => {
        if (waktuTersisa > 0) {
            waktuTersisa--;
            updateTampilanTimer();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Waktu fokus habis! Istirahat sejenak.");
            resetTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    waktuTersisa = 25 * 60;
    updateTampilanTimer();
}

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click', stopTimer);
btnReset.addEventListener('click', resetTimer);


// ==========================================
//    3. LOGIKA TO-DO LIST (ANTI-DUPLIKAT)
// ==========================================
const todoInput = document.getElementById('todo-input');
const btnAddTodo = document.getElementById('btn-add-todo');
const todoListContainer = document.getElementById('todo-list');

let daftarTugas = JSON.parse(localStorage.getItem('tasks')) || [];

function tampilkanTugas() {
    todoListContainer.innerHTML = '';
    daftarTugas.forEach((tugas, index) => {
        const li = document.createElement('li');
        if (tugas.isDone) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }
        li.innerHTML = `
            <span>${tugas.text}</span>
            <div>
                <button onclick="toggleSelesaiTugas(${index})">${tugas.isDone ? 'Undo' : 'Done'}</button>
                <button onclick="hapusTugas(${index})">Delete</button>
            </div>
        `;
        todoListContainer.appendChild(li);
    });
    localStorage.setItem('tasks', JSON.stringify(daftarTugas));
}

function tambahTugas() {
    const teksTugas = todoInput.value.trim();

    if (teksTugas === '') {
        alert('Teks tugas tidak boleh kosong!');
        return;
    }

    // --- TANTANGAN: PREVENT DUPLICATE TASKS ---
    // Cek apakah ada teks tugas yang sama persis di dalam array (tidak sensitif huruf besar/kecil)
    const isDuplikat = daftarTugas.some(tugas => tugas.text.toLowerCase() === teksTugas.toLowerCase());
    
    if (isDuplikat) {
        alert('Tugas ini sudah ada di dalam daftar! Silakan tulis tugas yang berbeda.');
        return; // Hentikan fungsi agar tidak menambahkan data baru
    }

    const tugasBaru = { text: teksTugas, isDone: false };
    daftarTugas.push(tugasBaru);
    todoInput.value = '';
    tampilkanTugas();
}

function toggleSelesaiTugas(index) {
    daftarTugas[index].isDone = !daftarTugas[index].isDone;
    tampilkanTugas();
}

function hapusTugas(index) {
    daftarTugas.splice(index, 1);
    tampilkanTugas();
}

btnAddTodo.addEventListener('click', tambahTugas);
todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') tambahTugas(); });
tampilkanTugas();


// ==========================================
//            4. LOGIKA QUICK LINKS
// ==========================================
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const btnAddLink = document.getElementById('btn-add-link');
const linksContainer = document.getElementById('links-container');

let daftarLink = JSON.parse(localStorage.getItem('quicklinks')) || [];

function tampilkanLink() {
    linksContainer.innerHTML = '';
    daftarLink.forEach((link, index) => {
        const linkCard = document.createElement('div');
        linkCard.className = 'link-card';
        linkCard.innerHTML = `
            <a href="${link.url}" target="_blank" class="btn-link">${link.name}</a>
            <button onclick="hapusLink(${index})" class="btn-delete-link">×</button>
        `;
        linksContainer.appendChild(linkCard);
    });
    localStorage.setItem('quicklinks', JSON.stringify(daftarLink));
}

function tambahLink() {
    const namaLink = linkNameInput.value.trim();
    let urlLink = linkUrlInput.value.trim();

    if (namaLink === '' || urlLink === '') {
        alert('Nama dan URL tidak boleh kosong!');
        return;
    }
    if (!urlLink.startsWith('http://') && !urlLink.startsWith('https://')) {
        urlLink = 'https://' + urlLink;
    }

    daftarLink.push({ name: namaLink, url: urlLink });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    tampilkanLink();
}

function hapusLink(index) {
    daftarLink.splice(index, 1);
    tampilkanLink();
}

btnAddLink.addEventListener('click', tambahLink);
tampilkanLink();


// ==========================================
//      5. TANTANGAN: LIGHT / DARK MODE
// ==========================================
const btnThemeToggle = document.getElementById('btn-theme-toggle');

// Cek preferensi tema terakhir user di Local Storage
let temaSekarang = localStorage.getItem('theme') || 'dark-mode';
document.body.className = temaSekarang;
updateTombolTema();

btnThemeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        document.body.className = 'light-mode';
        localStorage.setItem('theme', 'light-mode');
    } else {
        document.body.className = 'dark-mode';
        localStorage.setItem('theme', 'dark-mode');
    }
    updateTombolTema();
});

function updateTombolTema() {
    if (document.body.classList.contains('dark-mode')) {
        btnThemeToggle.innerText = '☀️ Light Mode';
    } else {
        btnThemeToggle.innerText = '🌙 Dark Mode';
    }
}