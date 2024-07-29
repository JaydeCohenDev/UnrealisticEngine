export default function Outliner() {
  return (
    <div className="panel">
      outliner
      <ul>
        {window.Editor.GetWorld()
          .GetAllActors()
          .map((actor) => {
            return <li>{actor.GetDisplayName()}</li>;
          })}
      </ul>
    </div>
  );
}
