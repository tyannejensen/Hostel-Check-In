// import { getTenantById } from "@/lib/data";

// TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// TODO: how can we have the edit and view pages be the same but the URL change upon state change?

//remove this line after uncommenting the fetch request in the fetchTenants function
const mockData = {
  id: "1",
  name: "John Doe",
  email: "test@gmail.com",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const fetchTenants = async (): Promise<any> => {
    let result = null;
    // TODO: replace with actual fetch request
    // result = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) => res.json());
    // mock return data

    // After uncommenting the above code delete this result assignment
    result = new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 200);
    }).then((data) => {
      return data;
    });

    return result;
  };

  const tenant = await fetchTenants();

  // TODO: create function to fetch the a tenant by id -> add function to data.ts file
  // const tenant = await getTenantById(id)

  return (
    <>
      {tenant ? (
        // if tenant exists show the tenant details
        <div>
          <h1>{tenant.name}</h1>
          <p>{tenant.email}</p>
        </div>
      ) : (
        // if tenant does not exist show a not found message
        <div>
          <h1>Not Found</h1>
          <p>Could not find tenant with id: {id}</p>
        </div>
      )}
    </>
  );
}
