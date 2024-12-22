
# Ayukperson

Ayukperson is a web application that allows users to manage to-do tasks, track screen time, and receive weather updates. The platform is built with Flask for the backend and MongoDB for task storage. It also includes a video background and various interactive components such as a to-do list, timer, and weather box.

## Features

- **To-Do List**: Users can add, delete, and undo tasks.
- **Screen Time Tracker**: A timer that tracks screen time.
- **Weather Updates**: Shows real-time weather updates based on the user's location.
- **Video Background**: A visually engaging video background on the homepage.

## Technologies Used

- **Frontend**: HTML, CSS (for styling), JavaScript
- **Backend**: Flask
- **Database**: MongoDB
- **Others**: Video background, CSS animations

## Installation

Follow these steps to run the project locally.

### Prerequisites

- Python 3.x
- MongoDB

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ayukperson.git
cd ayukperson
```

### 2. Create a Virtual Environment

It is recommended to create a virtual environment to manage dependencies.

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```



### 3. Set Up MongoDB

Ensure you have MongoDB installed and running locally or use a cloud-based MongoDB service. Update the connection string in the Flask app accordingly.

```python
client = MongoClient('mongodb://localhost:27017/')  # Modify the URI if necessary
```

### 4. Run the Application

Start the Flask development server.

```bash
flask run
```

Visit `http://127.0.0.1:5000/` in your browser to view the application.

## Project Structure

```
ayukperson/
│
├── app.py                  # Main application file
├── requirements.txt        # Python dependencies
├── static/                 # Static files (CSS, JS, images, videos)
│   ├── css/
│   ├── js/
│   └── bg.mp4              # Background video
├── templates/              # HTML templates
│   └── index.html          # Main HTML template
└── README.md               # Project documentation
```

## Contributing

Feel free to fork the repository, create branches, and submit pull requests. Contributions are welcome!


## Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [MongoDB](https://www.mongodb.com/)
- [Font Awesome](https://fontawesome.com/)
