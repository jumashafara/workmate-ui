# Workmate v1.0.0 System Document

## 1. Objective

To unify the Conversational Interface (Chatbot), ML Modeling Interpretability Dashboard, and Real-time Predictions and Decision Support functionality as the first phase of the RTV Predictives Strategy design.

---

## 2. Components of the System

### ML Modeling Interpretability

The ML Interpretability system is a model analysis and explanation tool that enables RTV staff to understand and trust the machine learning models driving our poverty alleviation initiatives. It aims to make complex AI algorithms transparent and comprehensible to both technical and non-technical stakeholders, supporting responsible AI use and data-driven decision-making in last-mile communities.

| **Component**                | **Description**                                  | **Features**                                      |
|------------------------------|--------------------------------------------------|--------------------------------------------------|
| **Model Overview**           | Summary of the model and training details.       | Model type, dataset info, version, training time, last update date. |
| **Feature Importance Visualization** | Visual explanation of feature impact.    | Bar plots, filter/sort options.                  |
| **Performance Metrics**      | Evaluation of model performance.                | Accuracy, precision, recall, F1-score, ROC-AUC, confusion matrix, regression metrics. |
| **Individual Prediction Explanation** | Explanation for single predictions. | Input panel, feature contributions, detailed output view. |
| **Latest Predictions Display** | Recent predictions overview.             | Live feed/table, timestamps, drill-down for detailed view. |
| **Data Exploration Tools**   | Insights into datasets used.                    | Dataset preview, statistical summaries (mean, median, variance). |
| **Model Comparison (Optional)** | Compare different models or versions. | Side-by-side comparison, performance metric graphs. |
| **User Interaction & Feedback** | Enhance user engagement and feedback. | Integrated chatbot, feedback form.              |
| **Customization Options**    | Personalize the dashboard experience.          | Light/Dark mode, configurable widgets.         |

### Real-time Predictions and Decision Support Functionality

This component uses machine learning to assess households' ability to meet RTV's income target. It provides early warnings for potentially off-track households and clusters, enabling proactive interventions and supporting RTV's goal of sustainable poverty alleviation in last-mile communities.

| **Component**                | **Description**                                  | **Features**                                      |
|------------------------------|--------------------------------------------------|--------------------------------------------------|
| **Prediction**               | Identify households likely to miss income target | Predict income shortfalls using ML models.      |
| **Cluster Risk Identification** | Detect at-risk household clusters.       | Analyze patterns across groups to flag risks.  |
| **Early Warning Signals**    | Generate timely alerts for potential risks.     | Automated warnings for households/clusters.    |
| **Targeted Intervention Suggestions** | Recommend improvement actions. | Data-driven strategies to aid at-risk groups. |
| **Proactive Monitoring**     | Continuous tracking of household progress.      | Real-time risk updates, dynamic monitoring.    |
| **Data-Driven Decision Support** | Empower RTV teams with insights. | Visual reports and intervention planning.      |

### Conversational Interface (Chatbot)

The chatbot is a comprehensive knowledge management and decision support system that empowers RTV staff, donors, champions, and frontline workers with accessible, accurate, and actionable insights to enhance poverty alleviation efforts.

| **Feature**                   | **Description**                                 | **Functionality**                                 |
|-------------------------------|-------------------------------------------------|--------------------------------------------------|
| **Centralized Information Repository** | Consolidates RTV program data.  | Quick access to program details, policies, procedures. |
| **Advanced AI Capabilities**  | Human-like interactions with intuitive search.  | Natural language processing for context-aware responses. |
| **Tabular Data Interpretation** | Analyzes SE surveys and Master Scorecard data. | Summarizes complex tables into actionable insights. |
| **Advanced Data Analytics**   | Data-driven advice based on real-time analysis. | Informed recommendations tailored to queries.  |

### Data Feedback Loop

Allows users to provide feedback on interventions and refine the system.

---

## 3. Reporting

- Alerts and messages will be received by different users within the system.
- Users can send and receive messages.
- Users can interact with the system for data aggregations and transformations.

---

## 4. Technology

| **Component**        | **Technology**                  |
|---------------------|---------------------------------|
| **Backend**         | Python, Django                  |
| **Frontend**        | TypeScript, React              |
| **Graphing**        | Apex Charts                   |
| **Visualization**   | CSS, Tailwind                |
| **Version Control** | Git, GitHub                  |
| **Deployment**      | AWS Beanstalk, AWS Amplify   |

---

## 5. Interfaces

Wireframes for sign-in, sign-out, model statistics, feature importance, individual predictions, and chatbot are located in the designated folder.

---

## 6. Access, Authentication, and Authorization

- Accessible via a web browser.
- Login via password and Google accounts.
- Different users have varying page access.

| **User**  | **Actions** | **Pages** |
|-----------|-------------|------------|
| **Admin** | All         | All        |

---

## 7. Delivery

The system will be delivered as an independent system with API endpoints for integration with other systems.

---

## 8. Timelines and Milestones

Refer to the attached document for development timelines and milestones.

---

## Appendix

### User Model

| **Field**      | **Type**  | **Description**                   |
|----------------|-----------|----------------------------------|
| **user_id**    | UUID      | Unique identifier for the user.  |
| **name**       | String    | Full name of the user.          |
| **email**      | String    | Email address.                  |
| **role**       | String    | Role (Admin, Data Analyst).     |
| **last_login** | DateTime  | Last login timestamp.          |

### Household Model

| **Field**        | **Type** | **Description**                   |
|------------------|----------|----------------------------------|
| **household_id** | UUID     | Unique identifier for household. |

### Prediction Model Results

| **Field**               | **Type**  | **Description**                      |
|------------------------|-----------|-------------------------------------|
| **prediction_id**      | UUID      | Unique identifier for predictions.  |
| **predicted_income**   | Float     | Predicted household income.         |
| **predicted_class**    | Integer   | Income target classification.       |
| **prediction_date**    | DateTime  | Date of prediction.                |

### Feedback Model

| **Field**         | **Type**  | **Description**                  |
|-------------------|-----------|---------------------------------|
| **feedback_id**   | UUID      | Unique feedback identifier.     |
| **feedback_text** | Text      | User feedback.                 |

### Intervention Suggestions

| **Field**             | **Type**  | **Description**                   |
|----------------------|-----------|----------------------------------|
| **intervention_id**  | UUID      | Unique intervention ID.          |
| **suggested_action** | String    | Detailed action/strategy.        |

### Model Metrics

| **Field**     | **Type**  | **Description**               |
|---------------|-----------|------------------------------|
| **accuracy**  | Float     | Model accuracy.              |
| **f1_score**  | Float     | F1-score.                   |

### User Activity Logs

| **Field**   | **Type**  | **Description**              |
|-------------|-----------|-----------------------------|
| **log_id**  | UUID      | Unique log identifier.      |
| **action**  | String    | Description of user action. |

