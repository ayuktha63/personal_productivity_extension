let undoQueue = []; // Queue to store deleted items

// Function to fetch existing todos from the database and display them
async function fetchTodos() {
    try {
        const response = await fetch('/todos');
        const todos = await response.json();
        const list = document.getElementById('todo-items');
        list.innerHTML = ''; // Clear the current list
        todos.forEach(todo => {
            addTodoToList(todo.content, false); // Add each todo to the list
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Function to add a new todo item
async function addTodo() {
    const input = document.getElementById('todo-input');
    const newItem = input.value.trim();
    if (newItem) {
        // Check if the task already exists in the list to avoid duplicates
        const existingItems = Array.from(document.getElementById('todo-items').children);
        const isDuplicate = existingItems.some(item => item.textContent.includes(newItem));
        
        if (!isDuplicate) {
            try {
                // Add todo to the database
                const response = await fetch('/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newItem })
                });
                const addedTodo = await response.json();
                
                // Directly add the new item to the list on the page
                addTodoToList(addedTodo.content, true);
                
                // Clear the search bar
                input.value = '';
                
                document.getElementById('todo-list').style.display = 'block'; // Show list
                document.getElementById('undo-btn').style.display = 'none'; // Hide undo button initially
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        } else {
            alert('This task already exists in the list.');
        }
    }
    if (document.getElementById('todo-items').children.length === 0) {
        document.getElementById('todo-list').style.display = 'none'; // Hide list if empty
    }
}

// Function to add a todo item to the list
function addTodoToList(content, isNew) {
    const list = document.getElementById('todo-items');
    const listItem = document.createElement('li');
    listItem.textContent = content;

    // Create and append the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = async function() {
        // Enqueue deleted item and remove from the screen
        undoQueue.push({
            content: listItem.textContent.slice(0, -1), // Exclude the 'x'
            element: listItem
        });
        listItem.remove();
        if (list.children.length === 0) {
            document.getElementById('todo-list').style.display = 'none'; // Hide list if empty
        }
        document.getElementById('undo-btn').style.display = 'block'; // Show undo button

        // Send request to delete from the database
        try {
            const response = await fetch('/todos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: listItem.textContent.slice(0, -1) })
            });
            if (response.ok) {
                // Successfully deleted from DB, keep the item in the undo queue
            } else {
                // If deletion failed, remove the item from the undo queue
                undoQueue.pop();
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            // If deletion failed, remove the item from the undo queue
            undoQueue.pop();
        }
    };

    listItem.appendChild(deleteBtn);
    list.appendChild(listItem);
    document.getElementById('todo-list').style.display = 'block'; // Ensure list is visible
}

// Function to undo the last delete
async function undoDelete() {
    if (undoQueue.length > 0) {
        const firstDeletedItem = undoQueue.shift(); // Dequeue the oldest deleted item
        
        // Add the item back to the database
        try {
            await fetch('/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: firstDeletedItem.content })
            });
            
            // Re-add to the list
            addTodoToList(firstDeletedItem.content, false);
            
            document.getElementById('todo-list').style.display = 'block'; // Ensure list is visible
            if (undoQueue.length === 0) {
                document.getElementById('undo-btn').style.display = 'none'; // Hide undo button if queue is empty
            }
        } catch (error) {
            console.error('Error undoing delete:', error);
        }
    }
}

// Check for Enter key press
function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (e.g., form submission)
        addTodo(); // Call the addTodo function
    }
}

// Timer logic
function startTimer() {
    const timerDisplay = document.getElementById('timer-display');
    let startTime = localStorage.getItem('timer-start-time');
    if (!startTime) {
        startTime = new Date().getTime();
        localStorage.setItem('timer-start-time', startTime);
    }

    setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Fetch weather data
async function fetchWeather() {
    const city = 'Trivandrum';
    const apiKey = '7a28a7198cd7408cbc482250242807';
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        const location = document.getElementById('location');
        const temperature = document.getElementById('temperature');
        const description = document.getElementById('description');

        location.textContent = `Location: ${data.location.name}`;
        temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
        description.textContent = `Description: ${data.current.condition.text}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Fetch existing todos and weather data on page load
window.onload = function() {
    fetchTodos();
    // Set interval to fetch todos every 2 seconds
    setInterval(fetchTodos, 500);
    // Start the timer
    startTimer();
    // Fetch weather data
    fetchWeather();
}
