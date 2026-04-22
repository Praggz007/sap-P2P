# SAP P2P Management System

A modern, web-based simulation of the **Procure-to-Pay (P2P)** lifecycle, modeled after SAP business processes. This application provides a hands-on experience in managing procurement workflows from initial requisition to final payment.

## 🚀 Overview

This system simulates the core stages of procurement, providing users with a clear understanding of how documents flow through an enterprise system. It features a robust dashboard for monitoring KPIs and individual modules for each step in the P2P chain.

### Core Workflow Stages:
1.  **Requisition (PR):** Create purchase requests with specified materials, quantities, and cost centers.
2.  **Purchase Order (PO):** Convert requisitions into formal purchase orders released to suppliers.
3.  **Goods Receipt (GR):** Record the physical receipt of goods against open purchase orders.
4.  **Invoice (INV):** Process incoming supplier invoices and perform three-way matching.
5.  **Payment (PAY):** Execute final payments and close the transaction lifecycle.

## ✨ Key Features

-   **Procurement Dashboard:** Real-time visibility into total spend, cycle completion rates, and operational bottlenecks.
-   **SAP T-Code Navigation:** Navigate the system using industry-standard transaction codes:
    -   `ME51N` (Requisition)
    -   `ME21N` (Orders)
    -   `MIGO` (Goods Receipt)
    -   `MIRO` (Invoice)
    -   `F-53` (Payments)
    -   `/DB` (Dashboard)
-   **Master Data Simulation:** Pre-configured mock data for Vendors, Materials, and Cost Centers.
-   **Document Tracking:** Unique transaction IDs for every stage of the lifecycle.
-   **Data Persistence:** Simulation state is automatically saved to the browser's LocalStorage.
-   **Responsive Design:** Fully interactive UI built with Tailwind CSS and Lucide React icons.

## 🛠️ Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Library:** [React 19](https://react.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **State Management:** Custom React Hooks with LocalStorage persistence.

## 📂 Project Structure

```text
├── app/                  # Next.js pages and layouts
│   ├── dashboard/        # KPI and overview page
│   ├── requisition/      # PR creation module
│   ├── orders/           # PO management
│   ├── goods-receipt/    # GR processing
│   ├── invoice/          # Invoice matching
│   └── payment/          # Payment execution
├── components/           # Reusable UI components
├── hooks/                # Custom business logic (useOrders)
└── public/               # Static assets
```

## 🚦 Getting Started

### Prerequisites

-   Node.js 18.x or higher
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Praggz007/sap.git
    cd sap
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to start the simulation.

## 📄 Documentation

The project includes detailed documentation and SAP-related reference materials:
-   `PROJECT DOCUMENTATION .pdf`: Technical overview and project scope.

## 📝 License

This project is open-source and available under the MIT License.
