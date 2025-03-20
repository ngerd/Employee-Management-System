
# 🗂️ **Custom Data Chatbot with Ollama 3.1 8b**  

The **Employee Management System (EMS)** is a comprehensive and intuitive web application designed to streamline **project management, employee administration, task tracking, timesheet monitoring**, and other **core business processes** within an organization.

Built with **React** for the frontend and **Node.js** for the backend, EMS delivers a **seamless user experience** for administrators, managers, and employees alike. The system simplifies day-to-day operations by providing an **easy-to-use interface**, improving **collaboration, productivity**, and overall **organizational efficiency**.

## ✨ **Key Features**

### 👨‍💼 Manager Features
- **Customer Management**  
  View detailed customer cards, including general and payment information.  
  Add new customers to the system.  
  Edit and update existing customer details.  
  Delete customer records when necessary.  
  Download customer lists as Excel files for reporting and record-keeping.  

- **Employee Management**  
  View employee profiles with comprehensive information.  
  Add new employees to the system.  
  Edit employee data, roles, and assignments.  
  Delete employee records when needed.  

- **Project Management**  
  Create and manage projects, defining scopes and objectives.  
  Add team members to projects.  
  View detailed project information, including progress tracking.  
  Create tasks within projects and assign them to specific employees.  

- **Task & Timeslot Management**  
  Create timeslots for assigned tasks.  
  Use an interactive calendar to schedule task times and manage availability efficiently.  

---

### 👨‍💻 Employee Features
- **Task Management**  
  View and manage assigned tasks.  
  Update task progress and statuses.  

- **Timesheet & Timeslot Management**  
  Log work hours and submit timesheets for approval.  
  View scheduled timeslots and manage personal work calendars.  

- **Project Participation**  
  Collaborate on projects and tasks assigned by managers.  
  Access project details and stay informed on updates.  

---

## ⚙️ Tech Stack
- **Frontend**: React.js  
- **Backend**: Node.js  
- **Database**: Postgres 
- **Authentication**: JWT / Role-based Access Control  

---

## 🔗 **Useful Links**  
- 📚 **[Chainlit Documentation](https://docs.chainlit.io)** - Comprehensive resources to get started.  
- 💬 **[Chainlit Discord](https://discord.gg/k73SQ3FyUh)** - Join the community for support, collaboration, and project sharing!  
- 🌐 **[Ollama Official Website](https://ollama.ai)** - Learn more about Ollama and its offerings.  

---

## 💬 **Chatbot Use Cases**  
This chatbot is designed to:  
- **Provide Expert Answers**: Deliver detailed, accurate responses based on the **Encyclopedia of Human Development**.  
- **Simplify Knowledge Access**: Allow users to easily explore and understand topics related to human development.  
- **Support Learning and Research**: Assist students, educators, and researchers with contextual insights from a reliable source.  

---

## 🚀 **Getting Started**  
Follow these steps to set up and run the chatbot locally:  

### **Prerequisites**  
- **Python 3.7+** - Ensure Python is installed.  
- **Ollama 3.1** - Download and install from [Ollama's official site](https://www.ollama.ai).  

---

### 🛠️ **Installation**  

1. **Clone the repository:**  
   ```shell  
   git clone https://github.com/mattzuha/Chainlit-Chatbot.git  
   cd Chainlit-Chatbot  
   ```  

2. **Install dependencies:**  
   ```shell  
   pip install -r requirements.txt  
   ```  

3. **Start Ollama Model:**  
   ```shell  
   ollama run llama 3.1  
   ```  

### ⚙️ **Setting Up the Vector Database**  
For document-based interactions, run the following command to ingest documents and create a vector database:  
```shell  
python ingest.py  
```  

---

### 🖥️ **Running Locally**  
Start the chatbot by running:  
```shell  
chainlit run model.py  
```  

---

## 🎥 **YouTube Demo**  
Check out our chatbot in action on **YouTube**: [Demo Link](https://www.youtube.com/watch?v=z0TeFWldKLk)  

---

## 👤 **Authors**  
- **10421091 - Nguyen Nguyen Minh**  
- **10421114 - Nguyen Khanh Hoang Minh**  

---  

🎉 **We hope you enjoy using this chatbot! Happy coding!** 💻😊  
