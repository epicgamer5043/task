body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

header {
    width: 100%;
    background-color: #007bff;
    color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
}

.banner h1 {
    margin: 0;
}

nav ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}

nav ul li {
    margin: 0 10px;
}

nav ul li a {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
}

.container {
    width: 80%;
    max-width: 1000px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    text-align: center;
}

h2 {
    color: #333;
    margin-bottom: 10px;
}

.controls, .settings, .variables, .presets {
    margin: 20px 0;
}

button {
    padding: 10px 20px;
    margin: 5px;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

button:hover:not(:disabled) {
    background-color: #0056b3;
}

label {
    display: block;
    margin: 10px 0 5px;
    text-align: left;
}

input, select {
    padding: 10px;
    margin: 5px 0;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
}

.variables, .presets {
    text-align: left;
}

#variableList .variable, .presets select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
}

#variableList .variable input, .presets select {
    margin: 0 10px;
    flex-grow: 1;
}

#variableList .variable button {
    background-color: #dc3545;
}

#variableList .variable button:hover {
    background-color: #c82333;
}

footer {
    width: 100%;
    background-color: #007bff;
    color: #fff;
    padding: 10px 0;
    text-align: center;
    position: fixed;
    bottom: 0;
}
