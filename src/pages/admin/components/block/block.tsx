import "./block.css";

function block({ children }) {
  return (
    <div className="block">
      <h1>Bloc</h1>
      {children}
    </div>
  );
}

export default block;
