import Plasma from "../UI/Plasma";

function PlasmaBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Plasma
        color="#0069ff"
        speed={1.5}
        direction="forward"
        scale={2}
        opacity={0.2}
        mouseInteractive={false}
      />
    </div>
  );
}

export default PlasmaBackground;
