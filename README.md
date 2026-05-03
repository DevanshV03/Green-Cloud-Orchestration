# Green Cloud Orchestration
# README Documentation

## 1 Introduction
Green Cloud Orchestration is a comprehensive platform designed to help developers and businesses dynamically route their application traffic to the most sustainable data centers. By evaluating real-time carbon intensity, network latency, and user-defined preferences, the system intelligently recommends the optimal cloud region (supporting AWS and GCP) to minimize the carbon footprint of cloud workloads.

## 2 Features
- **Data Center Recommendation API** for dynamic traffic routing
- **Embeddable JS SDK (`green-cloud.js`)** for end-user latency measurements
- **User Preference Management** for customizing routing strategies (sustainability vs. performance)
- **Interactive Dashboard** to visualize carbon footprint data and simulate renewable energy impact
- **ML-powered** carbon savings estimation and modeling
- **Real-time integration** with external carbon intensity APIs

## 3 Tech Stack

### 3.1 Programming Languages
- JavaScript
- Python

### 3.2 Frameworks and Libraries
- React (Frontend)
- Node.js & Express (Backend API)
- Tailwind CSS (Styling)
- Scikit-learn (ML prediction via Python)
- Axios & Recharts (Data fetching & Visualization)

### 3.3 Databases
- MongoDB (via Mongoose for structured data and user configurations)

### 3.4 Tools and Integrations
- Embeddable JS SDK (`green-cloud.js`)
- Cloud Providers (AWS, Google Cloud Platform)
- Vite (Frontend Build Tool)

## 4 Project Architecture
The system follows a modular pipeline:
1. **Configuration:** Developers set their application URL and routing preferences via the dashboard.
2. **Integration:** The `green-cloud.js` SDK is embedded in the consumer application.
3. **Measurement:** The SDK pings configured cloud regions to measure user-specific latency.
4. **Recommendation:** Backend scores regions based on real-time carbon data and latency.
5. **Routing:** Traffic is dynamically routed to the optimal data center.

## 5 Folder Structure
```text
Green-Cloud-Orchestration/
backend/
    config/
    constants/
    controllers/
    ml/
    models/
    routes/
    sdk/
    services/
    index.js
frontend/
    constants/
    public/
    src/
    index.html
    tailwind.config.js
    vite.config.js
demo/
API_PLAN.md
AWS_ROUTING_PLAN.md
README.md
```

## 6 Installation

### 6.1 Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB

### 6.2 Steps
1. Clone the repository:
```bash
git clone https://github.com/your-repo/green-cloud-orchestration.git
cd green-cloud-orchestration
```

2. Install dependencies for the backend:
```bash
cd backend
npm install
```

3. Install dependencies for the frontend:
```bash
cd ../frontend
npm install
```

## 7 Configuration
- Set environment variables in the `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```
- Set environment variables in the `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

## 8 Running the Project

### 8.1 Start Backend
```bash
cd backend
npm start
```

### 8.2 Start Frontend
```bash
cd frontend
npm run dev
```

## 9 Usage
- Access the interactive dashboard via the local frontend URL.
- Configure application settings and routing preferences (e.g., "green" vs. "performance").
- Generate and embed the `green-cloud.js` SDK into your application's source code.
- Visualize real-time carbon savings and routing metrics on the dashboard.

## 10 Example Workflow
1. User configures an app in the dashboard, prioritizing "sustainability".
2. The user embeds the JS SDK into their web application.
3. An end-user visits the application.
4. The SDK measures latency to available AWS/GCP regions.
5. The backend recommends the region with the lowest carbon intensity that meets performance thresholds.

## 11 Future Enhancements
- Expand support to additional cloud providers (e.g., Azure).
- Advanced deep learning models for predictive carbon routing.
- Integration with Kubernetes and container orchestration platforms.
- Automated carbon reporting and compliance generation.

## 12 Conclusion
Green Cloud Orchestration empowers developers to build sustainable applications without compromising performance. By intelligently routing traffic based on real-time carbon data, it reduces the environmental impact of cloud workloads and promotes a greener digital ecosystem.
