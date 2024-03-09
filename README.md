# QuizApp

QuizApp is an engaging, real-time quiz game designed for two players. It uniquely harnesses the capabilities of the GPT API to generate random questions, ensuring a diverse and challenging quiz experience in each session. Players can either invite a friend to join a game using a unique session ID or opt to compete against a random opponent. Developed with a focus on responsiveness and real-time interaction via WebSocket, QuizApp offers a seamless and competitive environment to test your knowledge and speed.

## Features

- **Dynamic Question Generation:** Leverages the GPT API to generate a fresh set of questions for every game, making each session unique.
- **Multiplayer Gameplay:** Support for two players to join a session by sharing a unique ID, or play against a random opponent for an unpredictably fun challenge.
- **Real-Time Interaction:** Utilizes Socket.IO for real-time updates, ensuring a synchronous gameplay experience for both participants.
- **Responsive Design:** Built with React and Tailwind CSS, the app provides a smooth and responsive user interface across all device types.
- **Score Tracking:** The game automatically calculates scores based on the accuracy and speed of responses, crowning a winner at the end of each session.

## Built With

- **React:** For crafting a dynamic and responsive client-side interface.
- **Express.js:** Handles backend services and APIs, facilitating the game logic and player interactions.
- **Socket.IO:** Enables real-time, bidirectional communication between the players and the server.
- **Tailwind CSS:** Utilized for styling and ensuring the app is visually appealing and functional on any device.

## Getting Started

Get into the game right away by visiting [QuizApp](https://quizapp-co5u5j43yq-de.a.run.app).

### How to Play

- **Start a New Game:** Generate a unique game ID by starting a new game. You can share this ID with a friend or wait for an opponent to join your game.
- **Join a Game:** If you have a game ID from a friend, use it to join the game and start playing immediately.
- **Answer Questions:** Once the game starts, answer the questions as accurately and quickly as possible. Your score will depend on your speed and accuracy.
- **Winning the Game:** The game concludes when any player answers all 5 questions. Scores are then tallied to declare the winner.

## Contributing

Feel inspired to contribute? Your ideas and contributions are welcome! Feel free to fork the project, make improvements, and submit pull requests. Let's make QuizApp even better, together.

## License

This project is open source and available under the MIT License. See the [LICENSE.md](LICENSE.md) file for more details.

## Acknowledgments

- Special thanks to the GPT API for enabling the generation of diverse and challenging questions.
- Appreciation for React, Express.js, Socket.IO, and Tailwind CSS for providing the tools necessary to build this interactive and responsive quiz application.
