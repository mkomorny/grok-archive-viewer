# Grok Archive Viewer - Setup & Usage Guide

## Prerequisites
- **Node.js**: Version 20.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Grok Account Export**: An account data export JSON file from Grok (or use the provided sample dataset)

---

## 1. Installation

```bash
npm install
```

---

## 2. Loading Your Data

Place your exported conversation JSON file in:
```
public/data/data.json
```
*(A clean sample `data.json` is provided by default so you can test the interface immediately.)*

---

## 3. Running the Desktop App

To start the viewer in development mode:
```bash
npm run electron:dev
```

To run the web version in your browser:
```bash
npm run dev
```

---

## 4. Packaging Standalone Application

To package an executable for Windows:
```bash
npm run electron:build
```
