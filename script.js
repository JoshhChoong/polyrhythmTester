const KEYBOARD_KEYS = Object.freeze({
    0: "a", 
    1: "s",
    2: "d",
    3: "f",
    4: "j",
    5: "k",
    6: "l",
    7: ";"
});

const KEY_COLORS = Object.freeze({
    0: "#FFD700",     // a - yellow
    1: "#0066FF",     // s - blue
    2: "#00CC00",     // d - green
    3: "#4B0082",     // f - indigo
    4: "#808080",     // j - grey
    5: "#FF1493",     // k - pink
    6: "#0FFFFF",     // l - cyan
    7: "#FF8C00"      // ; - orange
});

// Add event listener to the submit button
document.getElementById('start').addEventListener('click', function() {
    const selected_mode = document.querySelector('#mode_select button.active')?.getAttribute('value');
    const selected_rythems = document.querySelector('#rythem_select button.active')?.getAttribute('value');
    const selected_time = document.querySelector('#time_select button.active')?.getAttribute('value');
    start(selected_mode, selected_rythems, selected_time);
});

// Handle mode buttons
document.querySelectorAll('#mode_select button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('#mode_select button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Handle time buttons
document.querySelectorAll('#time_select button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('#time_select button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Handle rhythm count buttons
document.querySelectorAll('#rythem_select button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('#rythem_select button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const numRythems = parseInt(this.getAttribute('value').split('_')[0]);
        createFlexboxes(numRythems);
    });
});

//run on page load
const defaultRhythem = document.querySelector('#rythem_select button.active')?.getAttribute('value');
if (defaultRhythem) {
    const numRythems = parseInt(defaultRhythem.split('_')[0]);
    createFlexboxes(numRythems);
}

function createFlexboxes(numRythems) {
// Create a container for the flexboxes
    const container = document.createElement('div');
    container.id = 'flexbox-container';
    container.className = 'rythem-box-container';
    
    // Create the specified number of flexboxes
    for (let i = 0; i < numRythems; i++) {
        const flexbox = document.createElement('div');
        flexbox.className = 'rhythem-box';
        flexbox.textContent = KEYBOARD_KEYS[i];
        flexbox.id = `rhythem-box-${i}`;
        container.appendChild(flexbox);
    }
    
    // Remove any existing container before adding the new one
    const existingContainer = document.getElementById('flexbox-container');
    if (existingContainer) {
        existingContainer.remove();
    }    
    // Add the container to the body
    document.body.appendChild(container);
}

// Define the start function

const activeKeys = new Set();

function setupKeyboardListeners() {
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        
        // Prevent repeated keydown events from the same held key
        if (activeKeys.has(key)) {
            return;
        }
        
        // Find which key was pressed
        let boxIndex = -1;
        for (let i = 0; i < Object.keys(KEYBOARD_KEYS).length; i++) {
            if (KEYBOARD_KEYS[i] === key) {
                boxIndex = i;
                break;
            }
        }
        
        // Highlight the matching flexbox with its color
        if (boxIndex !== -1) {
            activeKeys.add(key);
            const flexbox = document.getElementById(`rhythem-box-${boxIndex}`);
            if (flexbox) {
                const originalBg = flexbox.style.backgroundColor;
                const originalShadow = flexbox.style.boxShadow;
                
                flexbox.style.backgroundColor = KEY_COLORS[boxIndex];
                flexbox.style.boxShadow = `0 0 10px ${KEY_COLORS[boxIndex]}`;
                flexbox.style.transition = 'all 0.1s ease';
                
                // Remove highlight after 150ms
                setTimeout(() => {
                    flexbox.style.backgroundColor = originalBg;
                    flexbox.style.boxShadow = originalShadow;
                    activeKeys.delete(key);
                }, 150);
            }
        }
    });
}

function updateTimer(timeLimit = 15) {
    let startTime = Date.now();
    let timerDisplay = document.getElementById('timer').querySelector('p');

    const timerInterval = setInterval(() => {
        let elapsedTime = (Date.now() - startTime) / 1000;
        timerDisplay.textContent = elapsedTime.toFixed(1) + " seconds";

        if (elapsedTime >= timeLimit) {
            clearInterval(timerInterval);
            // Show hidden elements
            document.querySelector('.row').classList.remove('hidden');
            document.querySelector('.title').classList.remove('hidden');
            document.getElementById('startButton').classList.remove('hidden');
            document.getElementById('timer').classList.add('hidden');
        }
    }, 50);
}

function start(selected_mode, selected_rythems, timeInterval) {
    console.log("Mode selected:", selected_mode);
    console.log("Number of rhythms:", selected_rythems);
    console.log("Time interval selected:", timeInterval);

    // Hide elements
    document.querySelector('.row').classList.add('hidden');
    document.querySelector('.title').classList.add('hidden');
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('timer').classList.remove('hidden');
    
    updateTimer(parseInt(timeInterval));
}
setupKeyboardListeners();