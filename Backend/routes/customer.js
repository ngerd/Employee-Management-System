import express from "express";
import pool from "../DB.js";
const router = express.Router();

router.post("/create-customer", async (req, res) => {
  const {
    company_code,
    legal_name,
    street_1,
    street_2,
    street_3,
    house_number,
    postal_code,
    city,
    region,
    country,
    tax_number,
    order_currency,
    payment_term,
    payment_method,
    account_code,
    accountant,
    invoice_email,
    notices_email,
    account_manager,
    account_partner,
    sales_manager,
  } = req.body;

  // Validate required fields.
  // Note: 'postal_code' is an integer, so we check for undefined explicitly.
  if (
    !company_code ||
    !legal_name ||
    !street_1 ||
    !house_number ||
    postal_code === undefined ||
    !region ||
    !country ||
    !tax_number ||
    !order_currency ||
    !payment_term ||
    !payment_method ||
    !account_code ||
    !accountant ||
    !account_manager ||
    !account_partner ||
    !sales_manager
  ) {
    return res.status(400).json({ error: "Missing required field(s)" });
  }

  try {
    // Insert the new customer into the Customer table
    const result = await pool.query(
      `INSERT INTO public.customer (
         company_code, legal_name, street_1, street_2, street_3, house_number, postal_code,
         city, region, country, tax_number, order_currency, payment_term, payment_method,
         account_code, accountant, invoice_email, notices_email, account_manager,
         account_partner, sales_manager
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7,
         $8, $9, $10, $11, $12, $13, $14,
         $15, $16, $17, $18, $19,
         $20, $21
       ) RETURNING *`,
      [
        company_code,
        legal_name,
        street_1,
        street_2 || null,
        street_3 || null,
        house_number,
        postal_code,
        city || null,
        region,
        country,
        tax_number,
        order_currency,
        payment_term,
        payment_method,
        account_code,
        accountant,
        invoice_email || null,
        notices_email || null,
        account_manager,
        account_partner,
        sales_manager,
      ]
    );
    return res.status(201).json({ customer: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Get all customer
router.get("/allcustomer", async (req, res) => {
  try {
    const customerQuery = "SELECT * FROM public.customer";
    const customerResult = await pool.query(customerQuery);

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: "No customers found." });
    }

    res.status(200).json({ customers: customerResult.rows });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/customer-info", async (req, res) => {
  const { companyCode } = req.body;

  // Validate input: companyCode is required.
  if (!companyCode) {
    return res.status(400).json({ error: "Company code is required." });
  }

  try {
    // Query to get customer details using the provided company code
    const customerQuery =
      "SELECT * FROM public.customer WHERE company_code = $1";
    const customerResult = await pool.query(customerQuery, [companyCode]);

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Return all columns of the customer record
    return res.status(200).json({ customer: customerResult.rows[0] });
  } catch (error) {
    console.error("Error fetching customer info:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
// Update Customer
router.put("/update-customer", async (req, res) => {
  const {
    company_code,
    legal_name,
    street_1,
    street_2,
    street_3,
    house_number,
    postal_code,
    city,
    region,
    country,
    tax_number,
    order_currency,
    payment_term,
    payment_method,
    account_code,
    accountant,
    invoice_email,
    notices_email,
    account_manager,
    account_partner,
    sales_manager,
  } = req.body;

  // Validate required fields: company_code and others as needed.
  if (!company_code) {
    return res.status(400).json({ error: "Company code is required." });
  }
  // (Optionally, you can validate other required fields as well.)

  try {
    const updateQuery = `
        UPDATE public.customer
        SET legal_name      = $2,
            street_1        = $3,
            street_2        = $4,
            street_3        = $5,
            house_number    = $6,
            postal_code     = $7,
            city            = $8,
            region          = $9,
            country         = $10,
            tax_number      = $11,
            order_currency  = $12,
            payment_term    = $13,
            payment_method  = $14,
            account_code    = $15,
            accountant      = $16,
            invoice_email   = $17,
            notices_email   = $18,
            account_manager = $19,
            account_partner = $20,
            sales_manager   = $21
        WHERE company_code = $1
        RETURNING *
      `;
    const result = await pool.query(updateQuery, [
      company_code,
      legal_name,
      street_1,
      street_2 || null,
      street_3 || null,
      house_number,
      postal_code,
      city || null,
      region,
      country,
      tax_number,
      order_currency,
      payment_term,
      payment_method,
      account_code,
      accountant,
      invoice_email || null,
      notices_email || null,
      account_manager,
      account_partner,
      sales_manager,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    return res.status(200).json({ customer: result.rows[0] });
  } catch (error) {
    console.error("Error updating customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Customer
router.delete("/delete-customer", async (req, res) => {
  const { company_code } = req.body;

  // Validate that company_code is provided
  if (!company_code) {
    return res.status(400).json({ error: "Company code is required." });
  }

  try {
    const deleteQuery = `
        DELETE FROM public.customer
        WHERE company_code = $1
        RETURNING *
      `;
    const result = await pool.query(deleteQuery, [company_code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    return res
      .status(200)
      .json({ message: "Customer deleted.", customer: result.rows[0] });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-customer-codeandname", async (req, res) => { 
  try {
    const result = await pool.query(`SELECT company_code, legal_name FROM customer`);
    return res.json({ customers: result.rows }); // Changed key from 'Role' to 'customers'
  } catch (error) {
    console.error("Error retrieving customers: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
