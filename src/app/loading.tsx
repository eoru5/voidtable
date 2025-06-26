import PortalIcon from "./_components/icons/portal-icon";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <PortalIcon className="size-14" animate="always" />
    </div>
  );
}
