# KAVACH — Tactical Decision Support Platform for Force Readiness

> **AI-driven personnel stress prediction, force welfare optimization, and tactical squad readiness platform for uniformed services.**

[![Live Prototype](https://img.shields.io/badge/Live_Demo_of_KAVACH-v0.app-green)](https://v0--kavach.vercel.app)

---

## >> Vision & Problem Statement

Military and paramilitary organizations face ongoing challenges regarding force preservation: chronic deployment fatigue, subjective leave distribution, unaddressed traumatic stress, and mental health stigma that prevents self-reporting.

**KAVACH** transforms unstructured administrative, biometric, and operational data into objective, actionable intelligence. The platform revolves around two core metrics:

1. **Operational Readiness Score (ORS) [0–100]:** A live metric quantifying cognitive and physical combat readiness based on duty exposure, climate friction, and rest recovery.
2. **Leave Priority Index (LPI):** An algorithmic score prioritizing leave based on cumulative deployment hardship, time away from family, financial stress, and rejected leave history.

---

## >> Prototype vs. Full System Architecture

> **Note on Prototype Scope:** The current deployed version is an **interactive Minimum Viable Product (MVP) / proof-of-concept**. It represents a functional slice of the complete system vision, designed to demonstrate the end-to-end multi-role operational loop during live hackathon evaluations.

| Feature Area | Current Prototype (MVP Implementation) | Target Production Architecture (Full Vision) |
| :--- | :--- | :--- |
| **Analytics & Core Logic** | **Deterministic Math & Heuristics:** Uses explicit mathematical formulas (linear depletion and Banister recovery curves) for zero server lag and 100% explainable scoring. | **Autonomous ML Engine:** Hybrid XGBoost burnout classification, LSTM time-series stress tracking, SAFTE circadian fatigue models, and SHAP/LIME explainability. |
| **Data Storage & Sync** | **Client-Side Simulation State:** In-memory state and local parameters to allow judges to test interactions across all 5 user roles without backend database overhead. | **Dual-Table Architecture:** Table A ($O(1)$ projection-on-read state snapshot) + Table B (isolated 30-day encrypted time-series log vault with MinIO S3 cold storage). |
| **User Hierarchy Sync** | **Role Switcher Bar:** Top navigation bar allowing evaluators to instantly switch between Commander, NCO, Soldier, Leave, and Medical views. | **PostgreSQL LTREE & e-HRMS 2.0:** Centralized organizational tree (`CRPF.NS.Bn132.A_Coy.Pl1`) synced via government e-HRMS / Manav Sampada APIs. |
| **Time Progression** | **Simulated Time Scroller:** Top slider to advance hours and days on demand, modeling real-time ORS depletion and dynamic recovery interactively. | **Live Event Triggers & Cron Sync:** Real-time mTLS sync from field tablets and PWAs as shifts end and check-ins occur in actual time. |

---

## >> Interactive Prototype Walkthrough

The prototype demonstrates how information moves across the chain of command, from mission assignment down to field logs and recovery tracking.
