// template.tsx har navigatsiyada qayta yaratiladi — shu sabab sahifa o'tish animatsiyasi ishlaydi.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
