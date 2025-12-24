import Terminal from "@/components/UIv/TerminalAuth";

export default function App({Login}:{Login:boolean}) {
  return (
    <>
      <Terminal isLoginx={Login}></Terminal>
    </>
  );
}
