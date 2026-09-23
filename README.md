# Obesity Prediction System

An end-to-end machine learning web application that predicts obesity levels from physical-condition and lifestyle-related attributes. The system combines a trained XGBoost classification model with model explainability, rule-based recommendations, Firebase authentication and storage, a Flask REST API, and a React frontend.

## Project Overview

Obesity is influenced by multiple physical, dietary, lifestyle, and behavioral factors. This project develops a machine learning system capable of classifying an individual's obesity level using structured input data.

The project was developed as a complete machine learning software system rather than only a model-training experiment. It covers the complete pipeline:

**Dataset → Data Preprocessing → Exploratory Data Analysis → Model Training → Hyperparameter Tuning → Evaluation → Explainability → Recommendations → REST API → Web Application → Cloud Deployment**

The final application allows users to enter their information through a web interface, receive an obesity-level prediction, view the major factors influencing the model's prediction, and receive rule-based recommendations.

## Key Features

* Seven-class obesity-level classification
* XGBoost-based machine learning model
* Data preprocessing using scikit-learn pipelines
* Stratified train-test splitting
* Hyperparameter tuning
* 5-fold cross-validation
* Native XGBoost feature contribution analysis
* Top contributing factors for each prediction
* Rule-based recommendations based on predicted class
* React-based prediction interface
* Firebase email/password authentication
* Firebase Firestore prediction history
* Daily prediction limit
* Dashboard with prediction statistics
* Prediction history
* Weight trend visualization
* REST API using Flask
* Production deployment using Render

## Dataset

The project uses the `ObesityDataSet_raw_and_data_sinthetic.csv` dataset.
Dataset Link- https://drive.google.com/drive/folders/1uumS9LfkkC_cdBuho7Uq81VBbahB2eJW?usp=sharing

The original dataset contains:

* 2,111 observations
* 16 input features
* 1 target variable
* 7 target classes

The target variable is `NObeyesdad`.

### Target Classes

| Class ID | Obesity Level       |
| -------- | ------------------- |
| 0        | Insufficient_Weight |
| 1        | Normal_Weight       |
| 2        | Obesity_Type_I      |
| 3        | Obesity_Type_II     |
| 4        | Obesity_Type_III    |
| 5        | Overweight_Level_I  |
| 6        | Overweight_Level_II |

## Input Features

The final model uses the original 16 features from the dataset.

### Numerical Features

* `Age`
* `Height`
* `Weight`
* `FCVC`
* `NCP`
* `CH2O`
* `FAF`
* `TUE`

### Categorical Features

* `Gender`
* `family_history_with_overweight`
* `FAVC`
* `CAEC`
* `SMOKE`
* `SCC`
* `CALC`
* `MTRANS`

BMI was explored during the analysis but was not included as an input feature in the final model.

## Machine Learning Methodology

### 1. Data Cleaning

The initial dataset contained 2,111 rows.

Duplicate records were identified and removed, resulting in:

**2,087 unique observations**

The cleaned dataset contained no missing values.

This cleaning step was important because duplicate observations could cause the model to receive repeated information during training and potentially produce an overly optimistic evaluation.

### 2. Exploratory Data Analysis

Exploratory analysis was performed to understand:

* Feature distributions
* Numerical relationships
* Categorical feature distributions
* Target-class distribution
* Relationships between physical and lifestyle variables
* Potentially redundant or derived features

BMI was calculated and examined during this stage but was excluded from the final model so that the production prediction system remained based on the original dataset features.

### 3. Train-Test Split

The cleaned dataset was divided using an 80/20 stratified split.

| Dataset  | Samples | Features |
| -------- | ------: | -------: |
| Training |   1,669 |       16 |
| Testing  |     418 |       16 |

Stratification was used to preserve the distribution of the seven obesity classes in both subsets.

### 4. Feature Preprocessing

A scikit-learn preprocessing pipeline was created to ensure consistent transformations during both training and inference.

Numerical features were standardized using `StandardScaler`.

Categorical features were transformed using `OneHotEncoder` with:

```text
handle_unknown='ignore'
sparse_output=False
```

The 16 original input features were transformed into **31 model-ready features**.

The preprocessing pipeline was serialized and reused by the backend so that incoming production data is processed in exactly the same way as training data.

### 5. Model Selection and Training

XGBoost was selected as the final classification algorithm because it is well suited for structured/tabular datasets and can model nonlinear relationships between physical, dietary, and behavioral variables.

The model was trained as a seven-class classification system.

Hyperparameter tuning was performed to identify a strong configuration while evaluating performance using cross-validation.

### 6. Model Evaluation

The final model achieved:

* **Test Accuracy: 96.89%**
* **5-Fold Cross-Validation Accuracy: 96.76% ± 0.83%**

The test set was held out from model training and used for final evaluation.

The trained model and preprocessing pipeline were saved as:

```text
ml/models/best_model.pkl
ml/models/preprocessing_pipeline.pkl
```

## Explainability

The application provides an explanation for every prediction.

An initial attempt was made to use the external SHAP Python package with XGBoost's `TreeExplainer`. However, the installed SHAP version encountered compatibility issues with the multiclass XGBoost model, specifically around the model's vector-valued `base_score`.

Rather than weakening the explainability component or changing the trained model, the system was redesigned to use XGBoost's native prediction contribution functionality:

```text
pred_contribs=True
```

The model generates feature contributions for each class. The contribution values for the predicted class are selected, and contributions belonging to one-hot encoded categorical variables are grouped back into their original feature names.

The system then returns the five features with the largest absolute contributions.

Each factor is presented with a direction indicating whether it contributed toward or away from the predicted class.

These contributions describe **model behavior and should not be interpreted as causal relationships**.

## Recommendation System

A rule-based recommendation module was implemented separately from the machine learning model.

The recommendation system generates recommendations according to the predicted obesity category.

This separation keeps the responsibilities distinct:

```text
Machine Learning Model
        ↓
Obesity Classification
        ↓
Rule-Based Recommendation System
        ↓
User Recommendations
```

The recommendations are therefore not presented as outputs learned directly from the XGBoost model.

## System Architecture

The application follows a layered architecture consisting of the machine learning layer, backend API, frontend application, and cloud services.

```text
                         User
                           │
                           ▼
                   React Frontend
                           │
                    HTTP REST Request
                           │
                           ▼
                    Flask Backend
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Preprocessing              XGBoost Model
          Pipeline                      │
              │                         ▼
              └──────────────► Prediction
                                        │
                                        ▼
                               Feature Contributions
                                        │
                                        ▼
                                  Explainability
                                        │
                                        ▼
                                Recommendations
                                        │
                                        ▼
                                  JSON Response
                                        │
                                        ▼
                                  React Frontend

             Firebase Authentication
                       │
                       ▼
                  Firestore
                       │
                       ▼
           Prediction History / Dashboard
```

## Application Architecture

The project is organized into three major application layers.

### Machine Learning Layer

Responsible for:

* Dataset processing
* Model training
* Preprocessing
* Prediction
* Explainability
* Recommendation generation

### Backend Layer

The Flask backend provides the REST API and connects the frontend with the machine learning pipeline.

The primary endpoint is:

```text
POST /predict
```

The endpoint:

1. Receives user input as JSON.
2. Validates the required features.
3. Applies the saved preprocessing pipeline.
4. Generates an obesity prediction.
5. Generates model-based feature contributions.
6. Generates recommendations.
7. Returns the complete result as JSON.

### Frontend Layer

The React frontend provides:

* Authentication
* Prediction form
* Input validation
* Prediction results
* Contributing factors
* Recommendations
* Dashboard
* Prediction history
* Weight trend visualization
* Daily prediction tracking

React Router is used for navigation between application views.

Recharts is used for the weight trend visualization.

## Firebase Integration

Firebase is used for application-level user management and data storage.

### Firebase Authentication

Email/password authentication is used for:

* User registration
* Login
* Logout
* Maintaining authenticated sessions

### Firestore

Prediction records are stored under user-specific collections:

```text
users/
└── {userId}/
    └── predictions/
        └── {predictionId}
```

Stored information includes:

* Prediction input
* Predicted obesity level
* Top contributing factors
* Recommendations
* Timestamp

Firestore security rules restrict prediction data access to the authenticated user who owns the corresponding records.

## Daily Prediction Limit

The application includes a limit of five predictions per user per day.

The application tracks the user's prediction records and displays:

```text
Today's predictions: X / 5
```

Once the limit is reached, additional predictions are disabled for that day.

## Frontend Components

The frontend is built using React and Vite.

Major application components include:

* Prediction Form
* Prediction Result
* Dashboard
* Prediction History
* Weight Trend Chart
* Authentication pages

The dashboard provides an overview of previous predictions and visualizes weight changes over time.

## Backend API

The Flask backend exposes the machine learning functionality through a REST API.

Example request:

```json
{
  "Gender": "Male",
  "Age": 21,
  "Height": 1.75,
  "Weight": 75,
  "family_history_with_overweight": "yes",
  "FAVC": "yes",
  "FCVC": 2,
  "NCP": 3,
  "CAEC": "Sometimes",
  "SMOKE": "no",
  "CH2O": 2,
  "SCC": "no",
  "FAF": 1,
  "TUE": 1,
  "CALC": "Sometimes",
  "MTRANS": "Public_Transportation"
}
```

The API returns the predicted class together with the model's top contributing factors and recommendations.

## Technology Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Joblib
* Jupyter Notebook

### Backend

* Python
* Flask
* Flask-CORS
* Gunicorn

### Frontend

* React
* Vite
* JavaScript
* React Router
* Recharts

### Authentication and Database

* Firebase Authentication
* Firebase Firestore

### Development and Deployment

* Git
* GitHub
* Render

## Project Structure

```text
obesity-prediction-system/
│
├── ml/
│   ├── dataset/
│   │   └── ObesityDataSet_raw_and_data_sinthetic.csv
│   │
│   ├── models/
│   │   ├── best_model.pkl
│   │   └── preprocessing_pipeline.pkl
│   │
│   ├── notebooks/
│   │
│   ├── results/
│   │
│   ├── src/
│   │   ├── predict.py
│   │   ├── explain.py
│   │   └── recommend.py
│   │
│   └── requirements.txt
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Challenges Faced and Solutions

Developing the project from a machine learning experiment into a deployed full-stack application introduced several practical challenges.

### 1. Dataset Quality and Duplicate Records

**Challenge:**
The original dataset contained 2,111 observations, including duplicate records.

**Solution:**
Duplicate rows were identified and removed before model development, leaving 2,087 unique observations. The cleaned dataset was then used for subsequent analysis and model training.

### 2. Avoiding Unnecessary Derived Features

**Challenge:**
BMI is highly relevant to obesity classification, but directly including a derived BMI feature could make the model less representative of the original feature set.

**Solution:**
BMI was explored during EDA but excluded from the final model. The deployed model therefore uses the original 16 dataset features.

### 3. Maintaining Consistent Preprocessing

**Challenge:**
The model requires numerical scaling and categorical encoding. Applying preprocessing differently during production inference could result in incorrect predictions.

**Solution:**
A complete scikit-learn preprocessing pipeline was saved alongside the trained model. The backend loads this same pipeline before making predictions.

### 4. Multiclass Explainability Compatibility

**Challenge:**
The initial SHAP implementation using `TreeExplainer` failed because of compatibility issues between the installed SHAP version and the multiclass XGBoost model's vector-valued `base_score`.

**Solution:**
The external SHAP dependency was removed from the production requirements. XGBoost's native `pred_contribs=True` functionality was used instead. The resulting contributions were processed and mapped back to the original feature names.

This also reduced unnecessary production dependencies.

### 5. Managing Production Dependencies

**Challenge:**
The initial environment contained a much larger dependency stack, including packages that were not required by the production application.

**Solution:**
The actual imports used by the application were inspected and the production requirements were reduced to the packages required by Flask, preprocessing, XGBoost, model serialization, and data processing.

The final production requirements include:

```text
Flask==3.1.3
flask-cors==6.0.5
joblib==1.6.0
numpy==2.2.6
pandas==2.3.3
scikit-learn==1.7.2
xgboost==3.2.0
gunicorn
```

### 6. Local-to-Production Backend Configuration

**Challenge:**
The frontend originally communicated with the Flask backend through a local development address. That would not work once the frontend was deployed.

**Solution:**
The frontend API service was changed to read the backend URL from the Vite environment variable:

```text
VITE_API_URL
```

The deployed frontend was configured to use the Render backend URL.

### 7. Flask Development Server vs Production Server

**Challenge:**
The Flask development configuration used the development server, which is not appropriate for production deployment.

**Solution:**
The application was changed to expose the Flask application without enabling debug mode, and Render runs the application through Gunicorn:

```text
gunicorn backend.app:app
```

The prediction logic itself was not changed.

### 8. Frontend and Backend Deployment

**Challenge:**
The project consists of a React frontend and Flask backend stored in the same GitHub repository. They require different deployment configurations.

**Solution:**
The backend was deployed as a Render Web Service using the repository root and the `ml/requirements.txt` dependency file.

The frontend was deployed as a separate Render Static Site using:

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

This allowed both services to be deployed independently while remaining in the same repository.

### 9. Firebase Environment Variables in Production

**Challenge:**
The deployed frontend initially displayed only the application background and failed to initialize Firebase.

The browser console reported:

```text
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

**Cause:**
The local Firebase environment variables existed in the development environment but had not yet been configured in Render.

**Solution:**
The required `VITE_FIREBASE_*` environment variables were added to the Render frontend environment. After the site was rebuilt, Firebase authentication initialized correctly.

### 10. Frontend API and Firebase Configuration Separation

**Challenge:**
The frontend required both Firebase configuration and the production Flask API URL.

**Solution:**
Environment variables were used to separate deployment configuration from source code:

```text
VITE_API_URL
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

The `.env` file was excluded from Git using `.gitignore`.

### 11. Prediction History Timestamp Issue

**Challenge:**
The prediction history and weight trend chart initially displayed multiple predictions with the same date label, making different weights appear to overlap.

**Solution:**
The chart's X-axis was changed to use a timestamp containing both date and time instead of only the calendar date.

This allowed multiple predictions made on the same day to appear as separate observations.

### 12. Firestore Timestamp Handling

**Challenge:**
Prediction history processing initially attempted to call timestamp methods on values that could be undefined.

**Solution:**
Timestamp handling was made conditional so that the application safely processes records when a timestamp is unavailable.

### 13. Daily Prediction Limit

**Challenge:**
The application needed to restrict each user to five predictions per day while still allowing the prediction history to remain accessible.

**Solution:**
The application counts the authenticated user's prediction records for the current local calendar day and disables the prediction action after five submissions.

### 14. Git Repository and Environment Files

**Challenge:**
The project required version control without accidentally committing local environments or configuration files.

**Solution:**
A root `.gitignore` was created to exclude:

* Python virtual environments
* Python cache files
* `.env` files
* Node modules
* Frontend build output
* IDE configuration
* Firebase local configuration

The repository was then committed and pushed to GitHub.

### 15. Render Build Warning

**Challenge:**
The frontend production build generated a warning that the main JavaScript bundle exceeded the recommended 500 kB size after minification.

The build reported a JavaScript bundle of approximately 1.17 MB before gzip compression.

**Solution:**
The warning was evaluated as a performance optimization warning rather than a deployment failure. The application successfully built and deployed.

Code splitting can be introduced later if bundle optimization becomes necessary.

### 16. Cloud Deployment and Testing

**Challenge:**
A local application working correctly does not guarantee that the deployed frontend, backend, Firebase configuration, and API communication will all work together.

**Solution:**
The complete system was tested after deployment, including:

* User registration
* User login
* Prediction submission
* Prediction results
* Model explanations
* Recommendations
* Dashboard
* Prediction history
* Weight trend chart
* Daily prediction limit
* Frontend-to-backend communication

The deployed application successfully completed end-to-end testing.

## Development Workflow

The project evolved through the following development workflow:

```text
Dataset Acquisition
        ↓
Dataset Inspection
        ↓
Duplicate Removal
        ↓
Exploratory Data Analysis
        ↓
Feature Selection
        ↓
Train-Test Split
        ↓
Preprocessing Pipeline
        ↓
XGBoost Training
        ↓
Hyperparameter Tuning
        ↓
Cross-Validation
        ↓
Held-Out Test Evaluation
        ↓
Model Serialization
        ↓
Prediction Module
        ↓
Explainability Module
        ↓
Recommendation Module
        ↓
Flask REST API
        ↓
React Frontend
        ↓
Firebase Authentication
        ↓
Firestore Integration
        ↓
GitHub Version Control
        ↓
Render Backend Deployment
        ↓
Render Frontend Deployment
        ↓
End-to-End Testing
```

## Current Model Performance

| Metric                       | Result |
| ---------------------------- | -----: |
| Test Accuracy                | 96.89% |
| 5-Fold CV Mean Accuracy      | 96.76% |
| 5-Fold CV Standard Deviation |  0.83% |
| Number of Classes            |      7 |
| Training Samples             |  1,669 |
| Test Samples                 |    418 |
| Original Input Features      |     16 |
| Transformed Features         |     31 |

## Deployment

The project is deployed as separate frontend and backend services.

### Backend

The Flask API is deployed as a Render Web Service.

```text
Build Command:
pip install -r ml/requirements.txt

Start Command:
gunicorn backend.app:app
```

### Frontend

The React application is deployed as a Render Static Site.

```text
Root Directory:
frontend

Build Command:
npm install && npm run build

Publish Directory:
dist
```

The frontend communicates with the deployed Flask API through:

```text
VITE_API_URL
```

Firebase configuration is supplied through frontend environment variables during deployment.

## Live Application

**Frontend:**
https://obesity-prediction-system-wlqb.onrender.com

**Backend API:**
https://obesity-prediction-api.onrender.com

## Security and Configuration

Environment-specific configuration is kept outside the Git repository.

Environment variables are used for:

* Firebase configuration
* Backend API URL
* Frontend origin configuration

Local `.env` files are excluded using `.gitignore`.

The backend supports restricting CORS to the deployed frontend origin through the `FRONTEND_URL` environment variable.

Firestore rules restrict users to their own prediction records.

## Limitations

* The model is trained on the available dataset and may not generalize equally to all populations.
* The prediction represents a machine learning classification result rather than a medical diagnosis.
* Model feature contributions describe the behavior of the trained model and do not establish causality.
* Recommendations are rule-based application outputs and should not be treated as individualized medical advice.
* The current daily prediction limit is implemented at the application level rather than as a transactional server-side rate limiter.
* The current production deployment uses free-tier cloud infrastructure, which may introduce cold-start latency after periods of inactivity.
* The frontend bundle can be optimized further through code splitting if required.

## Future Improvements

Potential future improvements include:

* Larger and more diverse datasets
* External validation using independent datasets
* More extensive model comparison
* Model calibration
* Model monitoring
* Automated testing
* CI/CD integration
* Server-side rate limiting
* More robust backend authorization
* Containerized deployment
* Improved recommendation logic
* Advanced analytics and visualization
* Frontend code splitting and performance optimization

## Disclaimer

This project is intended for educational and software-development purposes. The predictions generated by the system should not be considered a medical diagnosis or a substitute for professional medical advice.
