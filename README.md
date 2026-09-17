# protectora-automatizada-lowcode
# AI-Driven Pet Adoption & Automated Screening System

An event-driven software ecosystem designed to automate, validate, and screen pet adoption applications. This project replaces traditional server architecture with a modern, high-performance cloud stack—combining a native frontend, a cloud relational database, and an AI-powered evaluation engine to streamline operations and deliver empathetic, automated decision-making.


## Project Roadmap & Architecture

1. **Phase 1 (Frontend Skeleton):** Semantic structural markup built with Vanilla HTML5 and CSS, tracked locally and pushed via GitHub Desktop.
2. **Phase 2 (Database Architecture):** Multiplatform data layer deployment on Supabase Cloud utilizing a strict relational PostgreSQL engine.
3. **Phase 3 & 4 & 5 (Direct Sync & UI):** Modular client-side data fetching directly from the live database using the Supabase client library, dynamically generating catalog views without intermediate files.
4. **Phase 6 (Client-Side Hard Filtering):** Algorithmic execution gate written in Vanilla JS. It aggregates rule-by-rule rejections before wasting cloud resources, showing immediate feedback.
5. **Phase 7 (AI Core Evaluation Engine):** Real-time asynchronous transmission to Make.com webhooks where a Google Gemini AI model parses applicant responses against animal traits.
6. **Phase 8 (Production & Security):** Implementation of deterministic error handlers (`Break` directive) and final deployment on global cloud servers for 24/7 availability.


## Database Architecture (PostgreSQL - Supabase Cloud)

Documented on proptectora.sql 

## System Logic & Automation Blueprint

The system minimizes computing expenses by implementing a dual-gate filtering framework before processing applications.

### Gate 1: Client-Side Error Accumulation (JavaScript)
The frontend intercepts the submission event, initializing an array wrapper `const rejectionReasons = [];`. It evaluates strict criteria (e.g., matching a high-energy dog with a low-activity household). If conditions fail, it triggers real-time custom string feedback within the DOM and aborts the cloud payload delivery.

### Gate 2: Serverless Automation Pipeline (Make.com & Gemini AI)
Valid forms that surpass the script validations execute a `POST` request using the native Fetch API toward a Make.com cloud webhook.
* **The AI Module:** Utilizes Google Gemini API (Free tier for developers) to process qualitative textual answers against relational database columns.
* **The Decision Engine:** Gemini returns a structured verdict (`Approved` or `Rejected`) alongside a brief technical justification summary.
* **Automated Router:** 
  * *On Approval:* Triggers a swift email notification to the candidate (*"Our team will contact you shortly to schedule an interview."*) and logs a summary containing all form inputs directly into the administration inbox.
  * *On Rejection:* Dispatches a hyper-personalized, empathetic email drafted dynamically by the AI explaining the specific constraints.


## Tech Stack & Services
* **Frontend:** HTML5 (Semantic Architecture), JavaScript (ES6+ Asynchronous Fetch / DOM Manipulation).
* **Database & Cloud Infrastructure:** Supabase Cloud (PostgreSQL), Amazon Web Services (AWS Hosting via Cloud providers).
* **Integration & AI Orchestration:** Make.com Cloud Webhooks, Google AI Studio (Gemini 2.5 Flash Model).
* **DevOps & Version Control:** Git, GitHub Desktop UI Engine.


