import { dbConnect } from "@/lib/db";
import { User } from "@/models/User.model";

// GET DATA

export async function getTenants() {
  await dbConnect();

  const tenants = await User.find( { role: "tenant" })
  .populate({
    path: "bookings",
    populate: {
      path: "roomId",
      select: "roomNumber",
    },
  })
  .populate("fullname");


  const tenantsAsObj = tenants.map((tenant: any) =>
    tenant.toObject({ getters: true, virtuals: false })
  );

  // Ensure final data is fully JSON-serializable
  return JSON.parse(JSON.stringify(tenantsAsObj));
}

export async function getTenantById(id: string) {
  await dbConnect();

  const tenant = await User.findById(id)
    .populate("firstName", "lastName")
    .populate("email", "phoneNumbers")
    .populate("bookings")
    .populate("paymentMethods", "createdAt")
    .populate("tags", "history")
    .populate("createdBy", "updatedBy");

  const tenantObj = tenant.toObject();
  return tenantObj;
}