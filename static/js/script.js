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
            await fetch('/todos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: listItem.textContent.slice(0, -1) })
            });
        } catch (error) {
            console.error('Error deleting todo:', error);
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

// Fetch existing todos on page load
window.onload = function() {
    fetchTodos();
    // Set interval to fetch todos every 0.5 seconds
    setInterval(fetchTodos, 500);
}
