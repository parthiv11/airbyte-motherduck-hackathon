# 🦆 Quack Quack: Natural Language MotherDuck 🚀

Welcome to **Natural Language MotherDuck**, a Next.js-powered web app transforming **plain English into SQL magic** for data exploration! Built for the **Airbyte Motherduck Hackathon**, it seamlessly integrates **Airbyte**, **MotherDuck**, and **AI-driven natural language processing** for an intuitive, powerful data querying experience—**no manual SQL required**.

---

## 🐥 Key Features  

- **Natural Language to SQL (NLP Quacks)**:  
  - Type questions in plain English—no need to know SQL!  
  - Example: _"Show me the top 10 unicorns by valuation in 2023."_  
  - **MotherDuck AI** quacks back an optimized SQL query through `prompt_sql()`.  
- **Dynamic Data Visualization**:  
  - Results displayed in **tables** and **automatically generated charts** (bar, line, pie, etc.).  
  - **Toggle between table and chart views** effortlessly.  
- **AI-Powered SQL Explanation**:  
  - Click to **decode the query**—get a plain-English breakdown of the SQL structure.  
- **Seamless Data Integration with Airbyte**:  
  - Use **Airbyte’s vast connector library** to import data from hundreds of sources into **MotherDuck** for querying.  
  - Perfect for **real-time analytics and batch data pipelines**.

---

## 🛠 Technology Stack  

- **Next.js**: Fast, modern React-based frontend  
- **Vercel AI SDK**: AI-backed interactive features  
- **MotherDuck AI**: Wasm-based SQL execution with robust NLP for query generation  
- **Airbyte**: Enterprise-grade data integration and movement  
- **Framer Motion**: Smooth animations  
- **ShadcnUI & Tailwind CSS**: Beautiful, responsive UI  
- **Recharts**: Interactive and customizable data visualization

---

## 🏗 How It Works  

1. **Load data with Airbyte into MotherDuck**:  
   - Airbyte’s **vast connector library** makes integration simple—from databases to APIs to CSV files.  
2. **Ask natural language queries**:  
   - Example: _"Which companies have the highest revenue growth in 2024?"_  
3. **MotherDuck AI generates the SQL query**:  
   - Example: `SELECT company_name, revenue_growth FROM companies WHERE year = 2024 ORDER BY revenue_growth DESC LIMIT 10;`  
4. **SQL execution and visualization in the browser**:  
   - **MotherDuck’s Wasm-based tier** ensures **lightning-fast, client-side computation**.  
5. **See results in table or chart form**:  
   - Switch views instantly.  
6. **SQL explanations**:  
   - Demystify SQL with **natural language insights into query components**.

---

## 🏃‍♀️ Getting Started  

1. Install dependencies:  
   ```bash
   pnpm install
   ```

2. Configure your environment:  
   ```bash
   cp .env.example .env
   ```

3. Add API keys:  
   ```bash
   motherduck_token=your_motherduck_token_here
   ```

4. Run the development server:  
   ```bash
   pnpm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000)—your data quackery awaits! 🦆  

---

## 🌐 Learn More  

- [Next.js](https://nextjs.org/docs)  
- [Vercel AI SDK](https://sdk.vercel.ai/docs)  
- [MotherDuck AI](https://motherduck.com/docs)  
- [Airbyte](https://airbyte.io) (unmatched data connectors)  
- [Framer Motion](https://www.framer.com/motion/)  
- [ShadcnUI](https://ui.shadcn.com)  
- [Tailwind CSS](https://tailwindcss.com)  
- [Recharts](https://recharts.org)

---

With **MotherDuck’s AI-driven SQL** and **Airbyte’s data connectors**, quack your way to **analytics nirvana**—from any source to brilliant insights! 🌟