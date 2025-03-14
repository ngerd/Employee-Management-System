import express from "express";
import pool from "../DB.js";
const router = express.Router();

// Create Project with project_id as: account_code + 3-digit sequential number
router.post("/create-project", async (req, res) => {
  const {
    project_name,
    project_description,
    start_date,
    due_date,
    customer_id, // now using customer_id (customer's company_code)
    nation,
    cost,
    billable,   // new attribute
  } = req.body;

  const project_status = "In Progress";

  // Validate required fields
  if (
    !project_name ||
    !project_description ||
    !start_date ||
    !due_date ||
    !customer_id ||
    !nation ||
    cost === undefined ||
    billable === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Step 1: Retrieve the customer's account_code from the customer table using customer_id (company_code)
    const customerResult = await pool.query(
      'SELECT account_code FROM public.customer WHERE company_code = $1',
      [customer_id]
    );
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    const account_code = customerResult.rows[0].account_code;

    // Step 2: Determine the next sequential number for the project_id.
    // Look for existing project_ids that start with the account_code.
    const likePattern = account_code + '%';
    const maxResult = await pool.query(
      'SELECT MAX(project_id) as max_id FROM public.project WHERE project_id LIKE $1',
      [likePattern]
    );
    const maxProjectId = maxResult.rows[0].max_id;
    let newSequence = "001";
    if (maxProjectId) {
      // Extract the 3-digit sequence part (assuming it's immediately after the account_code)
      const currentSeqStr = maxProjectId.substring(account_code.length, account_code.length + 3);
      const currentSeq = parseInt(currentSeqStr, 10);
      newSequence = (currentSeq + 1).toString().padStart(3, "0");
    }
    const final_project_id = account_code + newSequence;

    // Step 3: Insert the new project into the Project table
    const result = await pool.query(
      `INSERT INTO public.project (
          project_id,
          project_name,
          project_description,
          start_date,
          due_date,
          project_status,
          customer_id,
          nation,
          cost,
          billable
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
      [
        final_project_id,
        project_name,
        project_description,
        start_date,
        due_date,
        project_status,
        customer_id,
        nation,
        cost,
        billable,
      ]
    );
    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error("Error creating project:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Get All Projects for an Employee
router.post("/get-project", async (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: "Employee ID is required." });
  }

  try {
    // Retrieve projects assigned to the employee by joining project_employee and project tables.
    const result = await pool.query(
      `SELECT * FROM public.project_employee pm 
       JOIN public.project p ON pm.project_id = p.project_id 
       WHERE pm.employee_id = $1`,
      [employee_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project or Employee not found." });
    }

    return res.status(200).json({ projects: result.rows });
  } catch (err) {
    console.error("Error retrieving projects:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/checkmanager", async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "project ID is required" });
  }

  const client = await pool.connect();
  try {
    const query = `
      SELECT employee_id 
      FROM public.project_employee  
      WHERE project_id = $1 AND ismanager = true
    `;

    const result = await client.query(query, [projectId]);

    await client.release();

    if (result.rows.length === 0) {
      return res.status(200).json({ manager: null });
    }

    return res.status(200).json({ manager: result.rows[0].employee_id });
  } catch (err) {
    await client.release();
    console.error("Error checking manager:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Project
router.post("/update", async (req, res) => {
  const {
    project_id,
    project_name,
    project_description,
    due_date,
    project_status,
    customer_id,  // new field replacing customerName
    nation,
    cost,
    billable      // new attribute
  } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: "Project ID must be provided" });
  }

  if (
    project_name === undefined &&
    project_description === undefined &&
    due_date === undefined &&
    project_status === undefined &&
    customer_id === undefined &&
    nation === undefined &&
    cost === undefined &&
    billable === undefined
  ) {
    return res.status(400).json({ error: "Missing required field to be updated" });
  }

  try {
    const updateQuery = `
      UPDATE public.project 
      SET project_name = COALESCE($1, project_name),
          project_description = COALESCE($2, project_description),
          due_date = COALESCE($3, due_date),
          project_status = COALESCE($4, project_status),
          customer_id = COALESCE($5, customer_id),
          nation = COALESCE($6, nation),
          cost = COALESCE($7, cost),
          billable = COALESCE($8, billable)
      WHERE project_id = $9
      RETURNING *`;

    const values = [
      project_name,
      project_description,
      due_date,
      project_status,
      customer_id,
      nation,
      cost,
      billable,
      project_id,
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }
    return res.status(200).json({ project: result.rows[0] });
  } catch (err) {
    console.error("Error updating project:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/info", async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res
      .status(400)
      .json({ error: "Project ID is required as a query parameter." });
  }

  try {
    // Query to get project details along with customer legal name
    const projectQuery = `
      SELECT p.*, c.legal_name as customer_name
      FROM public.project p
      JOIN public.customer c ON p.customer_id = c.company_code
      WHERE p.project_id = $1
    `;
    const projectResult = await pool.query(projectQuery, [projectId]);

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = projectResult.rows[0];

    // Query to get employees assigned to this project along with their roles
    const employeesQuery = `
      SELECT e.employee_id, e.firstname, e.lastname, e.email, r.role_name
      FROM public.project_employee ep
      JOIN public.employee e ON ep.employee_id = e.employee_id
      JOIN public.role r ON e.role_id = r.role_id
      WHERE ep.project_id = $1
    `;
    const employeesResult = await pool.query(employeesQuery, [projectId]);

    res.json({
      project: {
        project_id: project.project_id,
        project_name: project.project_name,
        project_description: project.project_description,
        start_date: project.start_date,
        due_date: project.due_date,
        created_at: project.created_at,
        customer_name: project.customer_name, // Customer name retrieved from the join
        nation: project.nation,
        cost: project.cost,
        billable: project.billable,
        project_status: project.project_status,
      },
      employees: employeesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching project info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post("/add-employee", async (req, res) => {
//   let { employee_ids, project_id, ismanager } = req.body;

//   // Validate required fields
//   if (
//     !employee_ids ||
//     !Array.isArray(employee_ids) ||
//     employee_ids.length === 0 ||
//     !project_id
//   ) {
//     return res
//       .status(400)
//       .json({ error: "Missing or invalid required fields" });
//   }

//   // Ensure employee id 1 is always included and set as manager
//   if (!employee_ids.includes(1)) {
//     employee_ids.push(1);
//   }

//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     let addedEmployees = [];

//     // Loop through each employee to add/update in the project_employee table.
//     for (const employee_id of employee_ids) {
//       // For employee 1, force ismanager true; otherwise, use provided ismanager array logic.
//       const manager =
//         employee_id === 1
//           ? true
//           : ismanager && Array.isArray(ismanager) && ismanager.includes(employee_id)
//           ? true
//           : false;

//       // Insert or update each employee into the project_employee table
//       const addEmployeeQuery = `
//         INSERT INTO public.project_employee (ismanager, project_id, employee_id)
//         VALUES ($1, $2, $3)
//         ON CONFLICT (project_id, employee_id) DO UPDATE SET ismanager = EXCLUDED.ismanager
//         RETURNING *
//       `;
//       const employeeResult = await client.query(addEmployeeQuery, [
//         manager,
//         project_id,
//         employee_id,
//       ]);
//       addedEmployees.push(employeeResult.rows[0]);

//       // Retrieve the employee's pay rate based on the project's nation
//       const payRateQuery = `
//         SELECT CASE 
//                  WHEN p.nation = 'Singapore' THEN r.pay_rate_sg 
//                  ELSE r.pay_rate_vn 
//                END AS pay_rate
//         FROM public.employee e
//         JOIN public.role r ON e.role_id = r.role_id
//         JOIN public.project p ON p.project_id = $1
//         WHERE e.employee_id = $2
//       `;
//       const payRateResult = await client.query(payRateQuery, [project_id, employee_id]);
//       const pay_rate = parseFloat(payRateResult.rows[0].pay_rate) || 0;

//       // Increment the project's cost by adding the employee's pay rate
//       await client.query(
//         `UPDATE public.project SET cost = cost + $1 WHERE project_id = $2`,
//         [pay_rate, project_id]
//       );
//     }

//     // After processing all employees, fetch the updated project cost
//     const projectCostResult = await client.query(
//       `SELECT cost FROM public.project WHERE project_id = $1`,
//       [project_id]
//     );
//     const updatedCost = parseFloat(projectCostResult.rows[0].cost) || 0;

//     await client.query("COMMIT");

//     return res.status(201).json({
//       message: "Employees added successfully",
//       addedEmployees,
//       updated_cost: updatedCost,
//     });
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error adding employees:", error);
//     return res
//       .status(500)
//       .json({ error: "Internal Server Error", details: error.message });
//   } finally {
//     client.release();
//   }
// });

router.post("/add-employee", async (req, res) => {
  let { employee_ids, project_id, ismanager } = req.body;

  // Validate required fields
  if (
    !employee_ids ||
    !Array.isArray(employee_ids) ||
    employee_ids.length === 0 ||
    !project_id
  ) {
    return res
      .status(400)
      .json({ error: "Missing or invalid required fields" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let addedEmployees = [];

    // Loop through each employee to add/update in the project_employee table.
    for (const employee_id of employee_ids) {
      // Determine manager status based solely on the provided ismanager array.
      const manager = Array.isArray(ismanager) && ismanager.includes(employee_id);

      // Insert or update each employee into the project_employee table
      const addEmployeeQuery = `
        INSERT INTO public.project_employee (ismanager, project_id, employee_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (project_id, employee_id) DO UPDATE SET ismanager = EXCLUDED.ismanager
        RETURNING *
      `;
      const employeeResult = await client.query(addEmployeeQuery, [
        manager,
        project_id,
        employee_id,
      ]);
      addedEmployees.push(employeeResult.rows[0]);

      // Retrieve the employee's pay rate based on the project's nation
      const payRateQuery = `
        SELECT CASE 
                 WHEN p.nation = 'Singapore' THEN r.pay_rate_sg 
                 ELSE r.pay_rate_vn 
               END AS pay_rate
        FROM public.employee e
        JOIN public.role r ON e.role_id = r.role_id
        JOIN public.project p ON p.project_id = $1
        WHERE e.employee_id = $2
      `;
      const payRateResult = await client.query(payRateQuery, [project_id, employee_id]);
      const pay_rate = parseFloat(payRateResult.rows[0].pay_rate) || 0;

      // Increment the project's cost by adding the employee's pay rate
      await client.query(
        `UPDATE public.project SET cost = cost + $1 WHERE project_id = $2`,
        [pay_rate, project_id]
      );
    }

    // After processing all employees, fetch the updated project cost
    const projectCostResult = await client.query(
      `SELECT cost FROM public.project WHERE project_id = $1`,
      [project_id]
    );
    const updatedCost = parseFloat(projectCostResult.rows[0].cost) || 0;

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Employees added successfully",
      addedEmployees,
      updated_cost: updatedCost,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding employees:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  } finally {
    client.release();
  }
});

//Delete employee from project
router.post("/delete-employee", async (req, res) => {
  const { employee_id, project_id } = req.body;
  if (!employee_id && !project_id) {
    return res.status(400).json({ error: "Missing reqired field" });
  }
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //Fetch project's detail and pay rate
    const query = `SELECT p.nation, p.cost, r.pay_rate_sg, r.pay_rate_vn
                    FROM public.project p
                    JOIN public.project_employee pm ON pm.project_id = p.project_id
                    JOIN public.employee e ON pm.employee_id = e.employee_id
                    JOIN public.role r ON r.role_id = e.role_id
                    WHERE pm.employee_id = $1 AND pm.project_id = $2`;
    const result = await client.query(query, [employee_id, project_id]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Project or Employee not found." });
    }

    const {
      nation,
      cost: currentCost,
      pay_rate_sg,
      pay_rate_vn,
    } = result.rows[0];
    const payRate = nation === "Singapore" ? pay_rate_sg : pay_rate_vn;
    const newCost = parseFloat(currentCost) - parseFloat(payRate);

    await client.query(
      `UPDATE public."project" SET cost = $1 WHERE project_id = $2`,
      [newCost, project_id]
    );

    const deleteEmployee = `DELETE FROM public."project_employee" WHERE employee_id = $1 AND project_id = $2`;
    const value = [employee_id, project_id];
    await client.query(deleteEmployee, value);

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Delete successfully",
      updated_cost: newCost,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error deleting employee: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});
export default router;
