// TODO: determine how to show an 'view' and 'edit' in the url e.g. /reservations/1/view or /reservations/1/edit
// TODO: how can we have the edit and view pages be the same but the URL change upon state change?

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // TODO: create function to fetch the reservation by id -> add function to data.ts file

  return (
    <div>
      <h1>Reservation</h1>
      <p>; reservations</p>
    </div>
  );
}
