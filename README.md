# PetProject

Welcome to **PetProject**, a modern web application built with Next.js, TypeScript, Tailwind.css, Firebase, and several other powerful libraries. This project aims to provide a seamless and interactive user experience for pet lovers.

## Table of Contents
- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [DevDependencies](#devdependencies)
- [Features](#features)
- [Core Functionality](#core-functionality)
- [Contributing](#contributing)

## About the Project

This website offers a comprehensive platform for maintaining a detailed diary of your pets' activities and well-being. Track and record important health-related events, such as veterinary visits, vaccinations, illnesses, surgeries, and more. Monitor dietary changes including food types, feeding volumes, and allergies. Keep a log of your pet’s activities, from training sessions and swimming to travels, playtime, and walks.

Additionally, you can record current weight changes, and add contact information for a caretaker in case of your absence. This diary becomes invaluable when temporarily leaving your pet with a caretaker, ensuring they are well-informed about your pet’s needs and helping to prevent any dangerous situations like allergies or injuries.

How This Website Benefits Pet Owners:

**Health Management**: Centralizes your pet’s medical history, making it easier to manage and reference during vet visits.

**Diet Optimization**: Assists in managing and optimizing your pet’s diet by tracking food preferences, allergies, and nutritional needs.

**Emergency Preparedness**: Stores vital information that can be crucial during emergencies, ensuring caretakers to accurate and updated health records.

**Growth Tracking**: Monitors your pet's growth and development over time with weight tracking.

**Activity Insights**: Offers insights into your pet's activity levels and behavioral patterns, aiding in training and health monitoring.

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Install dependencies:
    ```sh
    npm install
    ```

### Running the Project

To start the development server:
```sh
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

To build the project for production:
```sh
npm run build
```

To start the production server:
```sh
npm run start
```

To lint the project:
```sh
npm run lint
```

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Lints the codebase.

## Dependencies

The project uses the following main dependencies:

- `@hookform/resolvers`: ^3.3.4
- `@reduxjs/toolkit`: ^2.2.3
- `firebase`: ^10.11.1
- `moment`: ^2.30.1
- `next`: 14.2.3
- `react`: ^18
- `react-datepicker`: ^6.9.0
- `react-dom`: ^18
- `react-hook-form`: ^7.51.4
- `react-redux`: ^9.1.2
- `react-toastify`: ^10.0.5
- `sharp`: ^0.33.3
- `uuid`: ^9.0.1
- `yup`: ^1.4.0

## DevDependencies

The project uses the following main devDependencies:

- `@next/eslint-plugin-next`: ^14.2.3
- `@types/node`: ^20
- `@types/react`: ^18
- `@types/react-datepicker`: ^6.2.0
- `@types/react-dom`: ^18
- `@types/uuid`: ^9.0.8
- `@typescript-eslint/eslint-plugin`: ^7.8.0
- `@typescript-eslint/parser`: ^7.8.0
- `eslint`: ^8
- `eslint-config-next`: 14.2.3
- `postcss`: ^8
- `tailwindcss`: ^3.4.1
- `typescript`: ^5

## Features

- **Modern Framework**: Built with Next.js for server-side rendering and static site generation.
- **State Management**: Utilizes Redux Toolkit for efficient state management.
- **Form Handling**: Implements `react-hook-form` and `yup` for robust form validation and handling.
- **UI Components**: Uses `react-datepicker` for date picking functionality.
- **Styling**: TailwindCSS for rapid and responsive design.
- **Notifications**: `react-toastify` for elegant toast notifications.
- **Image Processing**: `sharp` for image optimization.
- **Firebase Integration**: Includes Firebase for backend services.

## Core Functionality

- **Registration**:
   - Sign up using email and password with email verification.
- **Login**:
   - Login using email and password or through Google account.
- **Password Recovery**:
   - Recover password if forgotten.
- **Owner Profile Management**:
   - Update owner profile information (name, surname, profile photo).
- **Pet Profile Management**:
   - Add multiple pet profiles as needed.
   - Delete pet profiles.
   - Update primary information in pet profiles (size, weight).
- **Caregiver Management**:
   - Add caregivers for pets.
   - Remove caregivers.
- **Event Management**:
   - Add events related to health, nutrition, and activities with date and description.
   - Edit events related to health, nutrition, and activities with date and description.
   - Delete events related to health, nutrition, and activities.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---