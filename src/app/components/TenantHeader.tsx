"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const TenantHeader = ({ tenant }: any) => {
  const router = useRouter();

  function navigateToEdit() {
    // navigate to edit page
    const tenantId = tenant.id;
    console.log(tenant);
    router.push(`/dashboard/tenants/${tenantId}/edit`);
  }

  function deleteTenant() {
    // delete the tenant
  }

  return (
    <div className="">
      <div className="flex justify-between gap-4 w-full">
        <div className="flex justify-start gap-[30px]">
          <h1 className="text-[var(--dark-button)] font-bold">
            {tenant.fullname}
          </h1>
          <Pencil
            onClick={navigateToEdit}
            className="text-[var(--text)] edit"
          />
        </div>
        <div>
          <Trash2 onClick={deleteTenant} className="text-[var(--text)] trash" />
        </div>
      </div>
      <div>
        <p>{tenant.email}</p>
        <p>
          {tenant.phoneNumbers.find((phone: any) => phone.isPrimary).number}
        </p>
      </div>
    </div>
  );
};

export default TenantHeader;
