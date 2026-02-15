# OCI Live Telemetry Stack

A production-grade infrastructure project featuring a containerized Node.js backend hosted on **Oracle Cloud Infrastructure (OCI)**, serving real-time system metrics to a public portfolio frontend via a custom REST API.

## 🚀 Technical Highlights
* **Infrastructure:** OCI Compute Instance (Oracle Linux 9) hardened with Stateful Ingress rules.
* **Backend:** Node.js API (Port 3000) mapping host `/proc` and `/sys` filesystems for kernel-level telemetry.
* **Orchestration:** Docker Compose managing the Metrics API and Portainer management console.
* **Frontend:** Real-time `async/fetch` pipeline in `app.js` with a pulsing "Server Live" status indicator.

## 🛠 Directory Structure
- `docker/telemetry/`: OCI backend configuration (Docker Compose & Node API).
- `Portfolio_Site/`: Public frontend utilizing the live data stream.

## 🚦 Features
- **Live Metrics:** Real CPU, Memory, Load, and Uptime data.
- **Visual Management:** Portainer console for container health monitoring.
- **Fail-Safe UI:** Automatic "Offline" status detection if the API heartbeat stops.