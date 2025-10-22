# 💬 Live Agent Chat UI (React)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yadavhimanshu17/bot_react_live_agent_chat_ui/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yadavhimanshu17/bot_react_live_agent_chat_ui)](https://github.com/yadavhimanshu17/bot_react_live_agent_chat_ui/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/yadavhimanshu17/bot_react_live_agent_chat_ui)](https://github.com/yadavhimanshu17/bot_react_live_agent_chat_ui/issues)

---

## 📖 Overview

This repository contains the front-end user interface (UI) built with **React** for a **Live Agent Chat** system. This component is designed to provide a seamless transition from a standard chatbot or virtual assistant (like Rasa) to a human agent, enabling real-time communication for complex queries.

This repository focuses exclusively on the presentation layer and user experience for the human agent chat interface.

## ✨ Key Features

* **Real-time Messaging:** Provides instant, bidirectional communication between the user and the live agent.
* **Intuitive UI:** Clean and responsive design optimized for agent workflow.
* **Agent Status Management:** Features for showing agent status (Online, Busy, Offline).
* **Chat History Integration:** Ability to load previous conversation history when the agent takes over.
* **Tech Stack:** Built using React, styled with Tailwind CSS, and uses a standard Node.js environment.

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Core UI library for building components. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **Runtime** | **Node.js** | Required to run npm/yarn scripts and the development server. |
| **Package Manager**| **npm / yarn** | Dependency management. |

---

## ⚙️ Setup and Installation

Follow these steps to get the Live Agent Chat UI running on your local machine.

### Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (version 16 or higher is recommended)
* npm or yarn

### 1. Cloning the Repository

Clone the project to your local machine:

```bash
git clone [https://github.com/yadavhimanshu17/bot_react_live_agent_chat_ui.git](https://github.com/yadavhimanshu17/bot_react_live_agent_chat_ui.git)
cd bot_react_live_agent_chat_ui
2. Install DependenciesInstall the required Node packages:Bash# Using npm
npm install

# OR using yarn
# yarn install
3. Environment ConfigurationCreate a file named .env in the root directory and add your required configuration details. This is crucial for connecting the UI to your backend API.# Replace with your backend API endpoint for chat communication (e.g., WebSocket or REST)
REACT_APP_LIVE_AGENT_API_URL = <Replace with your Live Agent Backend URL> 

# Replace with the URL of the Rasa/Bot server (if used for context)
REACT_APP_RASA_BOT_URL = <Replace with your Bot Backend URL>
4. Running the ApplicationStart the development server:Bash# Start the application in development mode
npm start
The application should now be running on http://localhost:3000 (or the port specified in your setup).🌐 API Endpoints (Integration Points)This UI component expects to interact with an external Live Agent Backend service. The primary integration points are:MethodEndpointDescriptionWS/ws/live-chat/Primary WebSocket connection for real-time message exchange.POST/api/agent/takeoverREST endpoint to notify the backend that a human agent has joined the chat.GET/api/chat/history/:session_idREST endpoint to fetch the past conversation history.Note: Please refer to the corresponding backend repository (e.g., bot_rester_api) for complete API documentation.🤝 ContributingWe welcome contributions! If you have suggestions or want to improve the codebase, please follow these steps:Fork the repository.Create a new branch (git checkout -b feature/AmazingFeature).Make your changes.Commit your changes (git commit -m 'Add some AmazingFeature').Push to the branch (git push origin feature/AmazingFeature).Open a Pull Request.📞 SupportIf you encounter any issues or have questions, please:Open an Issue on this repository.Contact the maintainer: HIMANSHU YADAV at himanshu.hby.yadav@gmail.com.©️ LicenseThis project is licensed under the MIT License. See the LICENSE file for more details.Project Maintained by HIMANSHU YADAV.Last Updated: 22-10-2025
