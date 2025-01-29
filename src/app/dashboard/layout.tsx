export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <section>{children}</section>
    </main>
  );
}
