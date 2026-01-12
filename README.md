# Enterprise Risk & Technology Impact Analysis Platform

This is an MVP enterprise-style analytics web application built with Spring Boot and React.

## Technology Stack
- **Backend**: Java, Spring Boot, Maven, JPA, MySQL
- **Frontend**: React, one-way data flow, Tailwind CSS, Chart.js
- **Architecture**: Layered (Controller -> Service -> Repository)

## Setup Instructions

### 1. Database
Ensure MySQL is running. Create a database `risk_db`.
Configure credentials in `backend/src/main/resources/application.properties` if they differ from `root` / (empty).

### 2. Backend
Navigate to `/backend` and run:
```bash
mvn spring-boot:run
```
Server starts on port 8080.

### 3. Frontend
Navigate to `/frontend` and run:
```bash
npm install
npm run dev
```
Client starts on port 5173 (typically).

## Features
- **Data Upload**: Upload CSV files containing financial periods.
- **Risk Analysis**: 
    - Analyzes Profit Margins (< 10%).
    - Compares Expense Growth vs Revenue Growth.
    - Monitors Technology Costs (> 20% of Revenue).
- **Visualization**: Interactive charts for trend analysis.
- **Reporting**: Detailed risk factors and recommendations.
