export default function TeamMember({
  isYou,
  onUpdateRole,
  onRemoveMember,
  membership,
  roleOptions,
}) {
  const youClass = isYou ? "block" : "hidden";
  const showRemoveButton = membership.role !== 3;

  return (
    <div className="bg-base-200 container flex border border-neutral-300 rounded-lg w-full h-fit md:h-20 mt-5 items-center justify-between p-4 shadow-base-300 hover:shadow-lg ease-in-out transition-all duration-200">
      <div className="w-full font-bold">
        {membership.member.user.first_name} {membership.member.user.last_name}
        <div className={`font-normal opacity-50  text-xs sm:text-sm md:text-md ${youClass}`}>
          This is you
        </div>
      </div>
      <div className="w-fit flex flex-col md:flex-row gap-2">
        <select
          className="select select-sm border-base-300 font-normal rounded w-full md:w-fit h-8  hover:cursor-pointer"
          value={membership.role}
          onChange={(e) =>
            onUpdateRole(membership.member.user.id, e.target.value)
          }
        >
          {roleOptions.map((option) => (
            <option
              key={option.id}
              value={option.id}
              disabled={
                (option.id == 3 && membership.role !== 3) ||
                (membership.role == 3 && option.id !== 3)
              }
            >
              {option.label}
            </option>
          ))}
        </select>
        <button
          className={`btn btn-outline btn-sm btn-error rounded w-full md:w-fit ${
            showRemoveButton ? "" : "btn-disabled"
          }`}
          disabled={!showRemoveButton}
          onClick={(e) => onRemoveMember(membership.member.user.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
